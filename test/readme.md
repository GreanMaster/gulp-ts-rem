# TOC
   - [gulp-ts-path-replace](#gulp-ts-path-replace)
     - [tsPathReplace()](#gulp-ts-path-replace-tspathreplace)
       - [buffered input](#gulp-ts-path-replace-tspathreplace-buffered-input)
         - [baseUrl](#gulp-ts-path-replace-tspathreplace-buffered-input-baseurl)
           - ["."](#gulp-ts-path-replace-tspathreplace-buffered-input-baseurl-)
           - ["./"](#gulp-ts-path-replace-tspathreplace-buffered-input-baseurl-)
           - ["./generated/templates"](#gulp-ts-path-replace-tspathreplace-buffered-input-baseurl-generatedtemplates)
           - [nested](#gulp-ts-path-replace-tspathreplace-buffered-input-baseurl-nested)
             - [more than one nested](#gulp-ts-path-replace-tspathreplace-buffered-input-baseurl-nested-more-than-one-nested)
         - [paths](#gulp-ts-path-replace-tspathreplace-buffered-input-paths)
         - [multi](#gulp-ts-path-replace-tspathreplace-buffered-input-multi)
           - [require module](#gulp-ts-path-replace-tspathreplace-buffered-input-multi-require-module)
             - [have "paths" in tsconfig.json](#gulp-ts-path-replace-tspathreplace-buffered-input-multi-require-module-have-paths-in-tsconfigjson)
             - [do not have "paths" in tsconfig.json](#gulp-ts-path-replace-tspathreplace-buffered-input-multi-require-module-do-not-have-paths-in-tsconfigjson)
         - [real world](#gulp-ts-path-replace-tspathreplace-buffered-input-real-world)
       - [options](#gulp-ts-path-replace-tspathreplace-options)
         - [tsconfig](#gulp-ts-path-replace-tspathreplace-options-tsconfig)
         - [ignoreOutDir](#gulp-ts-path-replace-tspathreplace-options-ignoreoutdir)
           - ["true"](#gulp-ts-path-replace-tspathreplace-options-ignoreoutdir-true)
<a name=""></a>
 
<a name="gulp-ts-path-replace"></a>
# gulp-ts-path-replace
<a name="gulp-ts-path-replace-tspathreplace"></a>
## tsPathReplace()
<a name="gulp-ts-path-replace-tspathreplace-buffered-input"></a>
### buffered input
should equal buffer.

```js
var stream = tsPathReplace();
expect(file.isBuffer()).to.eq(true);
check(stream, done, (newFile) => {
  expect(newFile.isBuffer()).to.eq(true);
});
```

<a name="gulp-ts-path-replace-tspathreplace-buffered-input-baseurl"></a>
#### baseUrl
<a name="gulp-ts-path-replace-tspathreplace-buffered-input-baseurl-"></a>
##### "."
should replace with ./.

```js
file = new File({
  path: 'test/fixtures/example1/foo.js',
  contents: fs.readFileSync('test/fixtures/example1/foo.js')
});
var stream = tsPathReplace({tsconfig: 'test/fixtures/example1/tsconfig.json'});
check(stream, done, (newFile) => {
  expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('.');
  expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/example1/foo.js', 'utf8'));
});
```

<a name="gulp-ts-path-replace-tspathreplace-buffered-input-baseurl-"></a>
##### "./"
should replace with ./.

```js
file = new File({
  path: 'test/fixtures/example2/foo.js',
  contents: fs.readFileSync('test/fixtures/example2/foo.js')
});
var stream = tsPathReplace({tsconfig: 'test/fixtures/example2/tsconfig.json'});
check(stream, done, (newFile) => {
  expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('./');
  expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/example2/foo.js', 'utf8'));
});
```

<a name="gulp-ts-path-replace-tspathreplace-buffered-input-baseurl-generatedtemplates"></a>
##### "./generated/templates"
should replace with ./generated/templates.

```js
file = new File({
  path: 'test/fixtures/example3/foo.js',
  contents: fs.readFileSync('test/fixtures/example3/foo.js')
});
var stream = tsPathReplace({tsconfig: 'test/fixtures/example3/tsconfig.json'});
check(stream, done, (newFile) => {
  expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('./generated/templates');
  expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/example3/foo.js', 'utf8'));
});
```

<a name="gulp-ts-path-replace-tspathreplace-buffered-input-baseurl-nested"></a>
##### nested
should replace with ../.

```js
file = new File({
  path: 'test/fixtures/example4/foo/index.js',
  contents: fs.readFileSync('test/fixtures/example4/foo/index.js')
});
var stream = tsPathReplace({tsconfig: 'test/fixtures/example4/tsconfig.json'});
check(stream, done, (newFile) => {
  expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('./');
  expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/example4/foo/index.js', 'utf8'));
});
```

should replace with ../ and have .js extension.

```js
file = new File({
  path: 'test/fixtures/example5/foo/index.js',
  contents: fs.readFileSync('test/fixtures/example5/foo/index.js')
});
var stream = tsPathReplace({tsconfig: 'test/fixtures/example5/tsconfig.json'});
check(stream, done, (newFile) => {
  expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('./');
  expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/example5/foo/index.js', 'utf8'));
});
```

<a name="gulp-ts-path-replace-tspathreplace-buffered-input-baseurl-nested-more-than-one-nested"></a>
###### more than one nested
should replace with ../../ and have .js extension.

```js
file = new File({
  path: 'test/fixtures/example6/src/foo/foo.js',
  contents: fs.readFileSync('test/fixtures/example6/src/foo/foo.js')
});
var stream = tsPathReplace({tsconfig: 'test/fixtures/example6/tsconfig.json'});
check(stream, done, (newFile) => {
  expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('./');
  expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/example6/src/foo/foo.js', 'utf8'));
});
```

<a name="gulp-ts-path-replace-tspathreplace-buffered-input-paths"></a>
#### paths
should related with baseUrl.

```js
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
```

should support single asterisk(*).

```js
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
```

<a name="gulp-ts-path-replace-tspathreplace-buffered-input-multi"></a>
#### multi
<a name="gulp-ts-path-replace-tspathreplace-buffered-input-multi-require-module"></a>
##### require module
<a name="gulp-ts-path-replace-tspathreplace-buffered-input-multi-require-module-have-paths-in-tsconfigjson"></a>
###### have "paths" in tsconfig.json
should replace isolated each "require".

```js
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
```

<a name="gulp-ts-path-replace-tspathreplace-buffered-input-multi-require-module-do-not-have-paths-in-tsconfigjson"></a>
###### do not have "paths" in tsconfig.json
should replace isolated each "require".

```js
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
```

<a name="gulp-ts-path-replace-tspathreplace-buffered-input-real-world"></a>
#### real world
should avoid to replace if module do not exist in file/folder.

```js
var stream = tsPathReplace({tsconfig: 'test/fixtures/realworld/tsconfig.json'});
check(stream, done, (newFile) => {
  expect(newFile.contents.toString()).to.eq(fs.readFileSync('test/expected/realworld/spec/small/counter/indexTest.js', 'utf8'));
});
```

<a name="gulp-ts-path-replace-tspathreplace-options"></a>
### options
<a name="gulp-ts-path-replace-tspathreplace-options-tsconfig"></a>
#### tsconfig
should search for tsconfig.json relative with input file if don't specify tsconfig path.

```js
var stream = tsPathReplace();
check(stream, done, (newFile) => {
  expect(newFile.opts.tsconfig.path).to.eq(path.posix.join(path.dirname(file.path), 'tsconfig.json'));
});
```

should have specify tsconfig.json.

```js
var stream = tsPathReplace({tsconfig: 'test/fixtures/example1/tsconfig.json'});
check(stream, done, (newFile) => {
  expect(newFile.opts.tsconfig.path).to.eq('test/fixtures/example1/tsconfig.json');
  expect(newFile.opts.tsconfig.compilerOptions.baseUrl).to.eq('.');
});
```

<a name="gulp-ts-path-replace-tspathreplace-options-ignoreoutdir"></a>
#### ignoreOutDir
<a name="gulp-ts-path-replace-tspathreplace-options-ignoreoutdir-true"></a>
##### "true"
