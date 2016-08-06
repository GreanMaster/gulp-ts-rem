'use strict';

const Transform = require('readable-stream/transform');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

function getPathToTsconfig (option, cwd) {
  // if (Object.keys(option).length === 0 && option.constructor === Object) {
  if (option.tsconfig === undefined && option.constructor === Object) {
    return path.posix.join(cwd, 'tsconfig.json');
  }
  return option.tsconfig;
}
function getOptionsFromTsconfig (TsconfigPath) {
  return JSON.parse(fs.readFileSync(TsconfigPath));
}
function isHaveFileOn (moduleGlob) {
  // http://stackoverflow.com/questions/18112204/get-all-directories-within-directory-nodejs
  // return fs.readdirSync(currentPath).filter(file => fs.statSync(path.join(currentPath, file)).isDirectory());
  let globing = glob.sync(moduleGlob);
  if (globing.length > 0) {
    return true;
  }
  return false;
}
function isNotDotDir (dot) {
  if (path.join(dot, 'example') !== 'example') {
    return true;
  }
  return false;
}
function joinPath (file, moduleName, relativeO = true) {
  var tsconfig = file.opts.tsconfig;
  var relative;
  if (relativeO) {
    relative = path.posix.relative(
      path.dirname(file.path),
      path.posix.join(
        path.dirname(tsconfig.path),
        tsconfig.compilerOptions.baseUrl,
        moduleName
      )
    );
  } else {
    relative = path.posix.join(
        path.dirname(tsconfig.path),
        tsconfig.compilerOptions.baseUrl,
        moduleName
      );
  }
  if (relative === moduleName || isNotDotDir(tsconfig.compilerOptions.baseUrl)) {
    return './' + relative;
  }
  return relative;
}
function resolveModulePath (file, moduleName, relative = true) {
  var tsconfig = file.opts.tsconfig;
  var moduleGlob;
  if (tsconfig.compilerOptions.paths) {
    for (let key in tsconfig.compilerOptions.paths) {
      if (tsconfig.compilerOptions.paths.hasOwnProperty(key)) {
        let pathOption = tsconfig.compilerOptions.paths[key][0];
        let prefix = pathOption.substr(0, pathOption.indexOf('*'));
        let suffix = moduleName.substr(key.indexOf('*'));
        moduleGlob = joinPath(file, prefix + suffix, false) + '?(.js)';
        if (isHaveFileOn(moduleGlob)) {
          return joinPath(file, prefix + suffix, relative);
        }
        return moduleName;
      }
    }
  }
  moduleGlob = joinPath(file, moduleName, false) + '?(.js)';
  if (isHaveFileOn(moduleGlob)) {
    return joinPath(file, moduleName, relative);
  }
  return moduleName;
}
function getRelativePath (file) {
  // regex : https://regex101.com/r/nO1eN8/6
  var search = /^(?!\/\/)(.+)(require\(')([^']*)('\);?)/gm;
  var replacement, matchs;
  var content = String(file.contents);
  var matched = [];
  matchs = search.exec(content)
  while (matchs) {
    matched.push(matchs.slice(0, 5));
    matchs = search.exec(content);
  }
  matched.forEach((element) => {
    replacement = element[1] + element[2] + resolveModulePath(file, element[3]) + element[4];
    content = content.replace(element[0], replacement);
  });
  return content;
}

module.exports = function (options = {}) {
  return new Transform({
    objectMode: true,
    transform: function (file, encoding, callback) {
      if (file.isNull()) {
        return callback(null, file);
      }
      if (file.isStream()) {
        console.log('hello.wrong');
        return callback(null, file);
      }
      if (file.isBuffer()) {
        file.opts = options;
        file.opts.tsconfig = {path: getPathToTsconfig(options, path.dirname(file.path))};
        file.opts.tsconfig = Object.assign(
          file.opts.tsconfig,
          getOptionsFromTsconfig(file.opts.tsconfig.path)
        );
        file.contents = new Buffer(getRelativePath(file));
        return callback(null, file);
      }
      return callback(null, file);
    }
  });
}
