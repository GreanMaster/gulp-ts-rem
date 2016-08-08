[1mdiff --git a/.travis.yml b/.travis.yml[m
[1mindex 861ff4d..cacec8e 100644[m
[1m--- a/.travis.yml[m
[1m+++ b/.travis.yml[m
[36m@@ -3,3 +3,6 @@[m [mnode_js:[m
   - "5"[m
   - "4"[m
   - "node"[m
[32m+[m[32mafter_script:[m
[32m+[m[32m- npm run coverage[m
[32m+[m[32m- cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage[m
\ No newline at end of file[m
[1mdiff --git a/package.json b/package.json[m
[1mindex b4a8b8f..e8f8962 100644[m
[1m--- a/package.json[m
[1m+++ b/package.json[m
[36m@@ -4,16 +4,19 @@[m
   "description": "replace the module path for TypeScript",[m
   "main": "index.js",[m
   "scripts": {[m
[31m-    "test": "./node_modules/mocha/bin/mocha"[m
[32m+[m[32m    "test": "./node_modules/mocha/bin/mocha",[m
[32m+[m[32m    "coverage": "istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec"[m
   },[m
   "author": "Jame",[m
   "license": "MIT ",[m
   "devDependencies": {[m
     "chai": "^3.5.0",[m
[32m+[m[32m    "coveralls": "^2.11.12",[m
     "eslint": "^3.1.1",[m
     "eslint-config-standard": "^5.3.5",[m
     "eslint-plugin-standard": "^2.0.0",[m
[31m-    "mocha": "^3.0.1"[m
[32m+[m[32m    "mocha": "^3.0.1",[m
[32m+[m[32m    "mocha-lcov-reporter": "^1.2.0"[m
   },[m
   "dependencies": {[m
     "glob": "^7.0.5",[m
warning: LF will be replaced by CRLF in package.json.
The file will have its original line endings in your working directory.
