//Plugins and requires
var gulp = require('gulp');
var bump = require('gulp-bump');
var uncss = require('gulp-uncss');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var htmlmin = require('gulp-htmlmin');
var runSequence = require('run-sequence');
var minifycss = require('gulp-minify-css');
var livereload = require('gulp-livereload');
var stripCode  = require('gulp-strip-code');
var autoprefix = require('gulp-autoprefixer');
var js_obfuscator = require('gulp-js-obfuscator');
var clearlines = require('gulp-remove-empty-lines');

//Set up Paths
var DEV_PATH = 'dev/';
var TEST_PATH = 'test/';
var PROD_PATH = 'prod/';


//-----------------------------------Watch and Server reload tasks-------------------------------------//
//Watch certain directories for changes
gulp.task('watch',function (){
  console.log('Starting watch task');
  require('./server.js');
  livereload.listen();
  // Watch for changes in all files of the dev directory
    gulp.watch([DEV_PATH + '*.*',DEV_PATH +'js/*.*'],['b-reload'])
    gulp.watch([DEV_PATH +'css/*.*'],['styles'])
});


//b-reload
gulp.task('b-reload',function (){
  //No task specifics just want to kick off live livereload
   return gulp.src(DEV_PATH)
  .pipe(livereload());
});

//-----------------------------------Watch and Server reload tasks-------------------------------------//

//-----------------------------------HTML manipulation tasks-------------------------------------//

//Clean up Html
gulp.task('indexcleanup', function () {
  console.log('Cleaning up index.html.');
  gulp.src(TEST_PATH + 'index.html')
  //Removes comment block for live server upon staging.
  .pipe(stripCode({
      start_comment: "start-test-block",
      end_comment: "end-test-block"
    }))
  .pipe(clearlines({
    removeComments: true
  }))
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest(TEST_PATH));
});
//-----------------------------------HTML manipulation tasks-------------------------------------//

//-----------------------------------JavaScript manipulation tasks-------------------------------------//

//Uglify and combine all specified js files into one
gulp.task('scriptswork',function (){
  console.log('Starting scriptswork task');
   return gulp.src(DEV_PATH + 'js/main.js')
         .pipe(uglify())
         .pipe(concat('main.js')) // This is if you are combining multiple js files into one.
         .pipe(gulp.dest(DEV_PATH + '/js/obf'));
});


//Pre-obfuscation remove current js file to avoid conflict
gulp.task('pre-obfuscation', function () {
    return gulp.src([TEST_PATH + '/js/main.js',TEST_PATH + '/js/obf',TEST_PATH + 'css/reset.css',TEST_PATH + 'css/main.css'], {read: false})
        .pipe(clean());
});


//Javascript Obfuscator
gulp.task('obfuscate',function (){
  console.log('Obfuscating js file.');
  var path = {
    build: {
      js: TEST_PATH + '/js',
    },
    src: {
      js: DEV_PATH + '/js/obf/main.js',
    }
};
  return gulp.src(path.src.js)
      .pipe(js_obfuscator({}, ["**/jquery-*.js"]))
      .pipe(gulp.dest(path.build.js));
});


//Post-obfuscation remove current js file to avoid conflict
gulp.task('postflight', function () {
    return gulp.src([TEST_PATH,DEV_PATH + '/js/obf'], {read: false})
        .pipe(clean());
});

//-----------------------------------JavaScript manipulation tasks-------------------------------------//


//-----------------------------------CSS manipulation tasks-------------------------------------//

//Auto clean unused css, prefix, concat and minify custom css files in the project
gulp.task('styles',function (){
  console.log('Starting styles task');
  return gulp.src([DEV_PATH + 'css/reset.css',DEV_PATH + 'css/main.css'])
  .pipe(autoprefix({
              browsers: ['last 2 versions'],
              cascade: false
          }))
  .pipe(concat('styles.css'))
  .pipe(minifycss())
  .pipe(gulp.dest(DEV_PATH + '/css'))
  .pipe(livereload());
});


//Clean up all unused css across specified .css and .html files
gulp.task('cleancss', function() {
  return gulp.src([DEV_PATH + 'css/reset.css',DEV_PATH + 'css/main.css'])
    .pipe(uncss({html: [DEV_PATH + 'index.html']}))
    .pipe(gulp.dest(DEV_PATH + '/css'));
});
//-----------------------------------CSS manipulation tasks-------------------------------------//


//-----------------------------------Directory building and manipulation tasks-------------------------------------//
//Clean Test Directories
gulp.task('cleantest', function () {
  console.log('Cleaning Up files and directories');
    return gulp.src(TEST_PATH, {read: false})
        .pipe(clean());
});

//Clean Prod Directories
gulp.task('cleanprod', function () {
  console.log('Cleaning Up files and directories');
    return gulp.src(PROD_PATH, {read: false})
        .pipe(clean());
});

//Build the test directory structure and files
gulp.task('buildtest', function() {
  console.log('Building test directory');
  return gulp.src(DEV_PATH + '**/*')
    .pipe( gulp.dest(TEST_PATH))
});

////Build the prod directory structure and files from test
gulp.task('buildprod', function() {
  console.log('Building production directory');
  return gulp.src(TEST_PATH + '**/*')
    .pipe( gulp.dest(PROD_PATH))
});
//-----------------------------------Directory building and manipulation tasks-------------------------------------//


//-----------------------------------Utility tasks-------------------------------------//

//Update the version in package.json
gulp.task("bump", function () {
  console.log('Updating the buid version.');
    return gulp.src("./package.json")
        .pipe(bump({ type: "minor" }))
        .pipe(gulp.dest("./"));
});


//In sequence build the test directory, clean up index.html, obfuscate the javascript, remove "live reload" script from test/index.html, clean/auto-prefix/minify css files and update version # in the package.json and stage all of the files
//publishtest
gulp.task('stagetest',function (){
console.log('Starting to Publish test files..............');
runSequence('cleantest','scriptswork','buildtest','indexcleanup','pre-obfuscation','obfuscate','bump');
console.log('Completed publishing test files..............');
});

//Stage files from test to prod and delete test dir
gulp.task('stageprod',function (){
console.log('Starting to Publish production files..............');
runSequence('cleanprod','buildprod','postflight');
console.log('Completed publishing production files..............');
});

//-----------------------------------Utility tasks-------------------------------------//
