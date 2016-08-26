# gulp-ts-rem
[![Build Status](https://travis-ci.org/GreanMaster/gulp-ts-rem.svg?branch=master)](https://travis-ci.org/GreanMaster/gulp-ts-rem)
[![Coverage Status](https://coveralls.io/repos/github/GreanMaster/ts-relative-module/badge.svg?branch=master)](https://coveralls.io/github/GreanMaster/ts-relative-module?branch=master)
[![Dependency Status](https://gemnasium.com/badges/github.com/GreanMaster/gulp-ts-rem.svg)](https://gemnasium.com/github.com/GreanMaster/gulp-ts-rem)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

gulp **T**ype**S**cript **Re**lative **M**odule

## Install
`npm install --save-dev gulp-ts-rem`
## Usage
```JavaScript
const rem = require('gulp-ts-rem')
gulp.task('build:relative', function () {
    return gulp.src(['build/**/*.js'])
        .pipe(rem())
        .pipe(gulp.dest())
})
```
