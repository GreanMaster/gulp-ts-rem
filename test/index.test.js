'use strict';
const tsPathReplace = require('../');
const expect = require('chai').expect;
const fs = require('fs');
const File = require('vinyl');
const path = require('path');

describe('gulp-ts-path-replace', () => {
  describe('tsPathReplace()', () => {
    var file, check;
    beforeEach(() => {
      file = new File({
        path: 'test/fixtures/example1',
        contents: new Buffer('')
      });
      check = (stream, done, callback) => {
        stream.on('data', function (newFile) {
          callback(newFile);
          done();
        });
        stream.write(file);
        stream.end();
      }
    });
    describe('buffered input', () => {
      beforeEach(() => {
        file = new File({
          path: 'test/fixtures/example1/foo.js',
          contents: fs.readFileSync('test/fixtures/example1/foo.js')
        });
      });
      it('should equal buffer', (done) => {
        var stream = tsPathReplace();
        expect(file.isBuffer()).to.eq(true);
        check(stream, done, (newFile) => {
          expect(newFile.isBuffer()).to.eq(true);
        });
      });
      describe('baseUrl', () => {
        describe('"."', () => {
          it('should replace with ./', (done) => {
            file = new File({
              path: 'test/fixtures/example1/foo.js',
              contents: fs.readFileSync('test/fixtures/example1/foo.js')
            });
            var stream = tsPathReplace({tsconfig: 'test/fixtures/example1/tsconfig.json'});
            check(stream, done, (newFile) => {
              expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('.');
              expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/example1/foo.js', 'utf8'));
            });
          });
        });
        describe('"./"', () => {
          it('should replace with ./', (done) => {
            file = new File({
              path: 'test/fixtures/example2/foo.js',
              contents: fs.readFileSync('test/fixtures/example2/foo.js')
            });
            var stream = tsPathReplace({tsconfig: 'test/fixtures/example2/tsconfig.json'});
            check(stream, done, (newFile) => {
              expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('./');
              expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/example2/foo.js', 'utf8'));
            });
          });
        });
        describe('"./generated/templates"', () => {
          it('should replace with ./generated/templates', (done) => {
            file = new File({
              path: 'test/fixtures/example3/foo.js',
              contents: fs.readFileSync('test/fixtures/example3/foo.js')
            });
            var stream = tsPathReplace({tsconfig: 'test/fixtures/example3/tsconfig.json'});
            check(stream, done, (newFile) => {
              expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('./generated/templates');
              expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/example3/foo.js', 'utf8'));
            });
          });
        });
        describe('nested', () => {
          it('should replace with ../', (done) => {
            file = new File({
              path: 'test/fixtures/example4/foo/index.js',
              contents: fs.readFileSync('test/fixtures/example4/foo/index.js')
            });
            var stream = tsPathReplace({tsconfig: 'test/fixtures/example4/tsconfig.json'});
            check(stream, done, (newFile) => {
              expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('./');
              expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/example4/foo/index.js', 'utf8'));
            });
          });
          it('should replace with ../ and have .js extension', (done) => {
            file = new File({
              path: 'test/fixtures/example5/foo/index.js',
              contents: fs.readFileSync('test/fixtures/example5/foo/index.js')
            });
            var stream = tsPathReplace({tsconfig: 'test/fixtures/example5/tsconfig.json'});
            check(stream, done, (newFile) => {
              expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('./');
              expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/example5/foo/index.js', 'utf8'));
            });
          });
          describe('more than one nested', () => {
            it('should replace with ../../ and have .js extension', (done) => {
              file = new File({
                path: 'test/fixtures/example6/src/foo/foo.js',
                contents: fs.readFileSync('test/fixtures/example6/src/foo/foo.js')
              });
              var stream = tsPathReplace({tsconfig: 'test/fixtures/example6/tsconfig.json'});
              check(stream, done, (newFile) => {
                expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('./');
                expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/example6/src/foo/foo.js', 'utf8'));
              });
            });
          });
        });
      });
      describe('paths', () => {
        it('should related with baseUrl', (done) => {
          file = new File({
            path: 'test/fixtures/example7/src/foo/foo.js',
            contents: fs.readFileSync('test/fixtures/example7/src/foo/foo.js')
          });
          var stream = tsPathReplace({tsconfig: 'test/fixtures/example7/tsconfig.json'});
          check(stream, done, (newFile) => {
            expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('./');
            expect(newFile.opts.tsconfig.compilerOptions.paths).to.deep.eq({'views/*': ['generated/templates/views/*']});
            expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/example7/src/foo/foo.js', 'utf8'));
          });
        });
        it('should support single asterisk(*)', (done) => {
          file = new File({
            path: 'test/fixtures/example8/src/foo/foo.js',
            contents: fs.readFileSync('test/fixtures/example8/src/foo/foo.js')
          });
          var stream = tsPathReplace({tsconfig: 'test/fixtures/example8/tsconfig.json'});
          check(stream, done, (newFile) => {
            expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('./');
            expect(newFile.opts.tsconfig.compilerOptions.paths).to.deep.eq({'*': ['generated/templates/views/*']});
            expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/example8/src/foo/foo.js', 'utf8'));
          });
        });
      });
      describe('multi', () => {
        describe('require module', () => {
          describe('have "paths" in tsconfig.json', () => {
            it('should replace isolated each "require"', (done) => {
              file = new File({
                path: 'test/fixtures/example9/src/foo/foo.js',
                contents: fs.readFileSync('test/fixtures/example9/src/foo/foo.js')
              });
              var stream = tsPathReplace({tsconfig: 'test/fixtures/example9/tsconfig.json'});
              check(stream, done, (newFile) => {
                expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('./');
                expect(newFile.opts.tsconfig.compilerOptions.paths).to.deep.eq({'*': ['generated/templates/*']});
                expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/example9/src/foo/foo.js', 'utf8'));
              });
            });
          });
          describe('do not have "paths" in tsconfig.json', () => {
            it('should replace isolated each "require"', (done) => {
              file = new File({
                path: 'test/fixtures/example10/src/foo/foo.js',
                contents: fs.readFileSync('test/fixtures/example10/src/foo/foo.js')
              });
              var stream = tsPathReplace({tsconfig: 'test/fixtures/example10/tsconfig.json'});
              check(stream, done, (newFile) => {
                expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('./');
                expect(newFile.opts.tsconfig.compilerOptions.paths).to.eq(undefined);
                expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/example10/src/foo/foo.js', 'utf8'));
              });
            });
          });
        });
      });
      describe('real world', () => {
        beforeEach(() => {
          file = new File({
            path: 'test/fixtures/realworld/spec/small/counter/indexTest.js',
            contents: fs.readFileSync('test/fixtures/realworld/spec/small/counter/indexTest.js')
          });
        });
        it('should avoid to replace if module do not exist in file/folder', (done) => {
          var stream = tsPathReplace({tsconfig: 'test/fixtures/realworld/tsconfig.json'});
          check(stream, done, (newFile) => {
            expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/realworld/spec/small/counter/indexTest.js', 'utf8'));
          });
        });
      });
    });
    describe('options', () => {
      describe('tsconfig', () => {
        beforeEach(() => {
          file = new File({
            path: 'test/fixtures/example1/foo.js',
            contents: fs.readFileSync('test/fixtures/example1/foo.js')
          });
        });
        it('should search for tsconfig.json relative with input file if don\'t specify tsconfig path', (done) => {
          var stream = tsPathReplace();
          check(stream, done, (newFile) => {
            expect(newFile.opts.tsconfig.path).to.eq(path.posix.join(path.dirname(file.path), 'tsconfig.json'));
          });
        });
        it('should have specify tsconfig.json', (done) => {
          var stream = tsPathReplace({tsconfig: 'test/fixtures/example1/tsconfig.json'});
          check(stream, done, (newFile) => {
            expect(newFile.opts.tsconfig.path).to.eq('test/fixtures/example1/tsconfig.json');
            expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('.');
          });
        });
      });
      xdescribe('ignoreOutDir', () => {
        beforeEach(() => {
          file = new File({
            path: 'test/fixtures/options/ignoreOutDir/src/foo/foo.js',
            contents: fs.readFileSync('test/fixtures/options/ignoreOutDir/src/foo/foo.js')
          });
        });
        describe('"true"', () => {
          it('should relative with tsconfig.json', (done) => {
            var stream = tsPathReplace({tsconfig: 'test/fixtures/options/ignoreOutDir/tsconfig.json', ignoreOutDir: true});
            check(stream, done, (newFile) => {
              expect(newFile.opts.ignoreOutDir).to.eq(true);
            });
          });
        });
      });
    });
  });
});
