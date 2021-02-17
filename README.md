Node Wandbox API
===
[![NPM version][npm-image]][npm-url] [![Dependencies][dependencies-image]][dependencies-url]

> Access Social Compilation Service [Wandbox][wandbox] via API from Node.js.


## Installation

``` bash
$ npm install wandbox-api-updated
```


## Usage

``` javascript
var runWandbox = require( 'wandbox-api-updated' );
```

#### runWandbox( [dest,] src[, opts], clbk )

Compile and run programs on [Wandbox][wandbox]. `src` has to be the path of the source file that Wandbox should compile. Results of API call are passed to `clbk`, a callback function which
has an `error` and `result` parameter, and optionally saved to the file specified in `dest`. To change the default compiler options, an options object can be supplied (`opts`).

``` javascript
/* FILE: code.cpp
	#include <iostream>
	int main() {
		std::cout << "All is well" << std::endl;
	}
*/

// Pass results to callback function...
runWandbox( './code.cpp', clbk );

// Save results to JSON file...
runWandbox( './output.json', '/code.cpp', clbk );

function clbk( error, results ) {
	if ( error ) {
		throw new Error( error.message );
	}
	var out = results;
	/* OUTPUT:
		{
			program_message: 'All is well\n',
			program_output: 'All is well\n',
			status: '0'
		}
	*/
}
```

Per Node.js convention, the callback function receives two arguments: `err` and `res`. `err` will be an `error` object in case the GET request is not successful and `null` otherwise,
in which case `res` will hold the results from running the code on Wandbox. According to the [Wandbox API documentation][wandbox-api-docs], the result `object` might have the following key-value pairs:

*	__status__: Exit code
*	__signal__: Signal message
*	__compiler_output__: stdout at compiling
*	__compiler_error__:  stderr at compiling
*	__compiler_message__: merged messages compiler_output and compiler_error
*	__program_output__: stdout at runtime
*	__program_error__: stderr at runtime
*	__program_message__: merged messages program_output and program_error

If `save` option is set to true, the result in addition have the following key-value pairs:

*	__permlink__: permlink you can pass to GET /permlink/:link.
*	__url__ URL to display on browser.

#### runWandbox.fromString( [dest,] code[, opts], clbk )

Directly compile and execute code in a source code `string`.

```javascript
runWandbox.fromString( '#include <iostream>\nint main() {\n\tstd::cout << "All is well" << std::endl;}', clbk );

function clbk( error, results ) {
	if ( error ) {
		throw new Error( error.message );
	}
	var out = results;
}
```

The two exported `functions` accept the following `options`:
*	__compiler__: name of used compiler. Default: `'gcc-head'`.
*	__codes__: additional codes, objects with `file` and `code` keys. Default: `[]`.
*	__options__: used options for a compiler joined by comma. Default: `''`.
*	__stdin__: standard input. Default: `''`.
*	__compiler-option-raw__: additional compile-time options joined by line-break. Default: `''`.
*	__runtime-option-raw__: additional run-time options joined by line-break. Default: `''`.
*	__save__: boolean indicating whether permanent link should be generated. Default: `false`.

To specify which compiler to use, set the `compiler` option.

```javascript
var code = 'print("I can also run Python.")';

runWandbox.fromString( code, { 'compiler': 'python-3.5.0' }, function clbk( errror, results ) {
	var out = results;
	/*
		{
			program_message: 'I can also run Python.\n',
			program_output: 'I can also run Python.\n',
			status: '0'
		}
	*/
});
```

To specify compile options, supply a comma-separated list to `options`.

```javascript
var code = '#include <iostream>\r\n int main() { int x = 0; std::cout << "hoge" << std::endl; }';

runWandbox.fromString( code, { 'options': 'warning,gnu++1y' }, function clbk( error, results ) {
	var out = res;
	/*
		{ compiler_error: 'prog.cc: In function \'int main()\':\nprog.cc:2:19: warning: unused variable \'x\' [-Wunused-variable]\n  int main() { int x = 0; std::cout << "hoge" << std::endl; }\n                   ^\n',
		  compiler_message: 'prog.cc: In function \'int main()\':\nprog.cc:2:19: warning: unused variable \'x\' [-Wunused-variable]\n  int main() { int x = 0; std::cout << "hoge" << std::endl; }\n                   ^\n',
		  program_message: 'hoge\n',
		  program_output: 'hoge\n',
		  status: '0' }
	*/
});
```

To generate a permanent link to the compiled program, set `save` to `true`.

```javascript
var code = 'print("I can also run Python.")';
runWandbox.fromString( code, {
	'compiler': 'python-3.5.0',
	'save': true
}, function clbk( error, results ) {
	var out = results;
	/*
		{
			permlink: 'hcx4qh0WIkX2YDps',
			program_message: 'I can also run Python.\n',
			program_output: 'I can also run Python.\n',
			status: '0',
			url: 'http://melpon.org/wandbox/permlink/hcx4qh0WIkX2YDps'
		}
	*/
});
```

---
## Examples

``` javascript
var runWandbox = require( 'wandbox-api-update' );

// String:

var code = '#include <iostream>\nint main() {\n\tstd::cout << "All is well" << std::endl;}';
runWandbox.fromString( code, clbk );

// File:

// Pass result to callback function...
runWandbox( './examples/fixtures/code.cpp', clbk );

// Save output to file...
runWandbox( './examples/fixtures/output.json', './examples/fixtures/code.cpp', clbk );

function clbk( error, results ) {
	if ( error ) {
		throw new Error( error.message );
	}
	console.log( results );
}
```

To run the example code from the top-level application directory,

``` bash
$ DEBUG=* node ./examples/index.js
```


---
## CLI

### Installation

To use the module as a general utility, install the module globally

``` bash
$ npm install -g wandbox-api-updated
```


### Usage

``` bash
Usage: runWandbox [options] src

Options:

  -h,  --help                Print this message.
  -V,  --version             Print the package version.
       --file                Boolean indicating whether src is a file path or code to be evaluated. Default: false.
       --compiler            Name of used compiler. Default: gcc-head.
       --options             Used options for a compiler joined by comma. Default: boost-1.60,warning,gnu++1y.
       --codes               Additional codes, objects with `file` and `code` keys. Default: [].
       --save                Boolean indicating whether permanent link should be generated. Default: false.
       --stdin               Standard input.
       --compiler-option-raw Additional compile-time options joined by line-break. Default: "".
       --runtime-option-raw  Additional run-time options joined by line-break. Default: "".
  -o,  --output file          Output file path.
```


### Examples

Setting the compiler using the command-line option:

``` bash
$ DEBUG=* runWandbox --compiler <compiler> <code comes here>
# => '[{...},{...},...]'
```

For local installations, modify the command to point to the local installation directory; e.g.,

``` bash
$ DEBUG=* ./node_modules/.bin/runWandbox --file --compiler <compiler> <file_path comes here>
# => '[{...},{...},...]'
```

Or, if you have cloned this repository and run `npm install`, modify the command to point to the executable; e.g.,

``` bash
$ DEBUG=* node ./bin/cli --compiler <compiler> <code comes here>
# => '[{...},{...},...]'
```


---
## Tests

### Unit

This repository uses [tape][tape] for unit tests. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul][istanbul] as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


### Browser Support

This repository uses [Testling][testling] for browser testing. To run the tests in a (headless) local web browser, execute the following command in the top-level application directory:

``` bash
$ make test-browsers
```

To view the tests in a local web browser,

``` bash
$ make view-browser-tests
```

<!-- [![browser support][browsers-image]][browsers-url] -->


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2016. Philipp Burckhardt.


[npm-image]: http://img.shields.io/npm/v/wandbox-api-updated.svg
[npm-url]: https://npmjs.org/package/wandbox-api-update

[tape]: https://github.com/substack/tape
[istanbul]: https://github.com/gotwarlost/istanbul
[testling]: https://ci.testling.com

[wandbox]: http://melpon.org/wandbox/
[wandbox-api-docs]: https://github.com/melpon/wandbox/blob/master/kennel2/API.rst
