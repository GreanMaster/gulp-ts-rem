'use strict'

var tsPathReplace = require('../')
var expect = require('chai').expect
var fs = require('fs')
var File = require('vinyl')
var path = require('path')

describe('gulp-ts-path-replace', function () {
  describe('tsPathReplace()', function () {
    var file, check
    beforeEach(function () {
      file = new File({
        path: 'test/fixtures/example1',
        contents: new Buffer('')
      })
      check = function (stream, done, callback) {
        stream.on('data', function (newFile) {
          callback(newFile)
          done()
        })
        stream.write(file)
        stream.end()
      }
    })
    describe('null input', function () {
      it('should equal null', function (done) {
        file = new File({
          path: 'test/fixtures/example1/foo.js',
          contents: null
        })
        var stream = tsPathReplace()
        check(stream, done, function (newFile) {
          expect(newFile.isNull()).to.eq(true)
        })
      })
    })
    describe('streamed input', function () {
      it('should equal stream', function (done) {
        file = new File({
          path: 'test/fixtures/example1/foo.js',
          contents: fs.createReadStream('test/fixtures/example1/foo.js')
        })
        var stream = tsPathReplace()
        check(stream, done, function (newFile) {
          expect(newFile.isStream()).to.eq(true)
        })
      })
    })
    describe('buffered input', function () {
      it('should equal buffer', function (done) {
        file = new File({
          path: 'test/fixtures/example1/foo.js',
          contents: fs.readFileSync('test/fixtures/example1/foo.js')
        })
        var stream = tsPathReplace()
        expect(file.isBuffer()).to.eq(true)
        check(stream, done, function (newFile) {
          expect(newFile.isBuffer()).to.eq(true)
        })
      })
      describe('baseUrl', function () {
        describe('"."', function () {
          it('should replace with ./', function (done) {
            file = new File({
              path: 'test/fixtures/example1/foo.js',
              contents: fs.readFileSync('test/fixtures/example1/foo.js')
            })
            var stream = tsPathReplace({ tsconfig: 'test/fixtures/example1/tsconfig.json' })
            check(stream, done, function (newFile) {
              expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('.')
              expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/example1/foo.js', 'utf8'))
            })
          })
        })
        describe('"./"', function () {
          it('should replace with ./', function (done) {
            file = new File({
              path: 'test/fixtures/example2/foo.js',
              contents: fs.readFileSync('test/fixtures/example2/foo.js')
            })
            var stream = tsPathReplace({ tsconfig: 'test/fixtures/example2/tsconfig.json' })
            check(stream, done, function (newFile) {
              expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('./')
              expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/example2/foo.js', 'utf8'))
            })
          })
        })
        describe('"./generated/templates"', function () {
          it('should replace with ./generated/templates', function (done) {
            file = new File({
              path: 'test/fixtures/example3/foo.js',
              contents: fs.readFileSync('test/fixtures/example3/foo.js')
            })
            var stream = tsPathReplace({ tsconfig: 'test/fixtures/example3/tsconfig.json' })
            check(stream, done, function (newFile) {
              expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('./generated/templates')
              expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/example3/foo.js', 'utf8'))
            })
          })
        })
        describe('nested', function () {
          it('should replace with ../', function (done) {
            file = new File({
              path: 'test/fixtures/example4/foo/index.js',
              contents: fs.readFileSync('test/fixtures/example4/foo/index.js')
            })
            var stream = tsPathReplace({ tsconfig: 'test/fixtures/example4/tsconfig.json' })
            check(stream, done, function (newFile) {
              expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('./')
              expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/example4/foo/index.js', 'utf8'))
            })
          })
          it('should replace with ../ and have .js extension', function (done) {
            file = new File({
              path: 'test/fixtures/example5/foo/index.js',
              contents: fs.readFileSync('test/fixtures/example5/foo/index.js')
            })
            var stream = tsPathReplace({ tsconfig: 'test/fixtures/example5/tsconfig.json' })
            check(stream, done, function (newFile) {
              expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('./')
              expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/example5/foo/index.js', 'utf8'))
            })
          })
          describe('more than one nested', function () {
            it('should replace with ../../ and have .js extension', function (done) {
              file = new File({
                path: 'test/fixtures/example6/src/foo/foo.js',
                contents: fs.readFileSync('test/fixtures/example6/src/foo/foo.js')
              })
              var stream = tsPathReplace({ tsconfig: 'test/fixtures/example6/tsconfig.json' })
              check(stream, done, function (newFile) {
                expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('./')
                expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/example6/src/foo/foo.js', 'utf8'))
              })
            })
          })
        })
      })
      describe('paths', function () {
        it('should related with baseUrl', function (done) {
          file = new File({
            path: 'test/fixtures/example7/src/foo/foo.js',
            contents: fs.readFileSync('test/fixtures/example7/src/foo/foo.js')
          })
          var stream = tsPathReplace({ tsconfig: 'test/fixtures/example7/tsconfig.json' })
          check(stream, done, function (newFile) {
            expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('./')
            expect(newFile.opts.tsconfig.compilerOptions.paths).to.deep.eq({ 'views/*': ['generated/templates/views/*'] })
            expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/example7/src/foo/foo.js', 'utf8'))
          })
        })
        it('should support single asterisk(*)', function (done) {
          file = new File({
            path: 'test/fixtures/example8/src/foo/foo.js',
            contents: fs.readFileSync('test/fixtures/example8/src/foo/foo.js')
          })
          var stream = tsPathReplace({ tsconfig: 'test/fixtures/example8/tsconfig.json' })
          check(stream, done, function (newFile) {
            expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('./')
            expect(newFile.opts.tsconfig.compilerOptions.paths).to.deep.eq({ '*': ['generated/templates/views/*'] })
            expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/example8/src/foo/foo.js', 'utf8'))
          })
        })
      })
      describe('multi', function () {
        describe('require module', function () {
          describe('have "paths" in tsconfig.json', function () {
            it('should replace isolated each "require"', function (done) {
              file = new File({
                path: 'test/fixtures/example9/src/foo/foo.js',
                contents: fs.readFileSync('test/fixtures/example9/src/foo/foo.js')
              })
              var stream = tsPathReplace({ tsconfig: 'test/fixtures/example9/tsconfig.json' })
              check(stream, done, function (newFile) {
                expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('./')
                expect(newFile.opts.tsconfig.compilerOptions.paths).to.deep.eq({ '*': ['generated/templates/*'] })
                expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/example9/src/foo/foo.js', 'utf8'))
              })
            })
          })
          describe('do not have "paths" in tsconfig.json', function () {
            it('should replace isolated each "require"', function (done) {
              file = new File({
                path: 'test/fixtures/example10/src/foo/foo.js',
                contents: fs.readFileSync('test/fixtures/example10/src/foo/foo.js')
              })
              var stream = tsPathReplace({ tsconfig: 'test/fixtures/example10/tsconfig.json' })
              check(stream, done, function (newFile) {
                expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('./')
                expect(newFile.opts.tsconfig.compilerOptions.paths).to.eq(undefined)
                expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/example10/src/foo/foo.js', 'utf8'))
              })
            })
          })
        })
      })
      describe('real world', function () {
        beforeEach(function () {
          file = new File({
            path: 'test/fixtures/realworld/spec/small/counter/indexTest.js',
            contents: fs.readFileSync('test/fixtures/realworld/spec/small/counter/indexTest.js')
          })
        })
        it('should avoid to replace if module do not exist in file/folder', function (done) {
          var stream = tsPathReplace({ tsconfig: 'test/fixtures/realworld/tsconfig.json' })
          check(stream, done, function (newFile) {
            expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/realworld/spec/small/counter/indexTest.js', 'utf8'))
          })
        })
      })
    })
    describe('options', function () {
      describe('tsconfig', function () {
        beforeEach(function () {
          file = new File({
            path: 'test/fixtures/example1/foo.js',
            contents: fs.readFileSync('test/fixtures/example1/foo.js')
          })
        })
        it('should search for tsconfig.json relative with input file if don\'t specify tsconfig path', function (done) {
          var stream = tsPathReplace()
          check(stream, done, function (newFile) {
            expect(newFile.opts.tsconfig.path).to.eq(path.posix.join(path.dirname(file.path), 'tsconfig.json'))
          })
        })
        it('should have specify tsconfig.json', function (done) {
          var stream = tsPathReplace({ tsconfig: 'test/fixtures/example1/tsconfig.json' })
          check(stream, done, function (newFile) {
            expect(newFile.opts.tsconfig.path).to.eq('test/fixtures/example1/tsconfig.json')
            expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('.')
          })
        })
      })
      xdescribe('ignoreOutDir', function () {
        beforeEach(function () {
          file = new File({
            path: 'test/fixtures/options/ignoreOutDir/src/foo/foo.js',
            contents: fs.readFileSync('test/fixtures/options/ignoreOutDir/src/foo/foo.js')
          })
        })
        describe('"true"', function () {
          it('should relative with tsconfig.json', function (done) {
            var stream = tsPathReplace({ tsconfig: 'test/fixtures/options/ignoreOutDir/tsconfig.json', ignoreOutDir: true })
            check(stream, done, function (newFile) {
              expect(newFile.opts.ignoreOutDir).to.eq(true)
            })
          })
        })
      })
    })
  })
})
