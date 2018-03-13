# Task Runners 104:

As a continuation from the 4th task runner tutorial, in this session we are going to be using plugins to manage the style sheets for the project.

# TR-104 directory structure as follows:
Project Folder(TR-104)
tr-104/
|- dev/

  |- index.html
  
  |- js/
  
    |- main.js
    
    |- jquery-3.3.1.min.js
    
  |- css/

      |- main.css

      |- reset.css

      |- styles.css

gulpfile.js

README.md

package.json

package-lock.json

server.js

*** ">>" means run this from the command terminal without the ">>" ***

# Some introduction
Install NODE.JS:
-- Install Node:
http://nodejs.org

--Open a command prompt and navigate to your project directory.

--NPM and gulp should already be installed from the previous session but if you started a new project do not worry. The commands with install and load all you need.

--We are adding (3) new plug-ins for this one.

--The gulp-minify-css is the plugin to clean up and minimize css files.

--The gulp-autoprefixer is the "postprocessor" for handling vendor prefixes in CSS.

--The gulp-uncss to clean up unused css across .css and html files.

# Install
Here are all of the commands to run(once Node is installed):

(Open a command prompt and navigate to the project directory)

********************** Command to install npm **********************
>>npm install

********************** Single line command to install all plugins ***************
>>npm install gulp gulp-cli gulp-htmlclean gulp-clean-css gulp-concat gulp-uglify run-sequence gulp-htmlmin gulp-bump del gulp-remove-empty-lines gulp-clean gulp-js-obfuscator gulp-livereload gulp-strip-code static-server gulp-minify-css gulp-autoprefixer gulp-uncss --save-dev


# Run

--Open the dev/css/main.css file in an editor.

--Add a style to a element that does not exist in index.html ex: #divname {text-align : center;}

--Save the file.

**********************Run the following command in the terminal***************
>>gulp cleancss

--Open th dev/css/main.css file in an editor.

--Notice all styles are gone that have no referrence in index.html.


**********************Run the following command in the terminal***************

>>gulp watch

--Launch index.html in a browser

-- Open a file from the dev/css/main.css in an editor make a change and save it, the browser will reflect and render changes.

-- Open the dev/css/main.css to verify that it has been auto-prefixed and minified.

-- **DO NOT edit styles.css or the changes will be overwritten, main.css and any others you want to add are for editing/development those will get output to styles.css. **


>>ctrl + c   

& y for yes to stop livereload server and run any other gulp command. (gulp stagetest or gulp stageprod)

**********************Run the following command in the terminal***************

>> gulp stagetest

-- Open index.html in the test directory in an editor you will see the live reload script at the bottom is now gone along with the comments and blanklines.

-- Open the test/js/main.js in an editor to verify that the contents are obfuscated.

-- Verify that test/css/styles.css is the only css file in that directory.

-- Open the test/css/styles.css to verify that it has been auto-prefixed and minified.

**********************Run the following command in the terminal***************
>>gulp stageprod

--Now all of the files from the test directory are in the production folder ready for deployment.

************************************************
####Extra npm commands:
-Remove unused packages from the directory to keep things lean.

>>npm prune

************************************************
Part I: (HTML File clean-up)

https://github.com/mstatt/tr-101

Part II: (Javascript Obfuscation)

https://github.com/mstatt/tr-102

Part III: (Live reload)

https://github.com/mstatt/tr-103

Part V: (Image Compression)

https://github.com/mstatt/tr-105

************************************************
Helpful Link:
https://gist.github.com/renarsvilnis/ab8581049a3efe4d03d8
