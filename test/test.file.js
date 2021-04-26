'use strict';

// MODULES //

var tape = require( 'tape' );
var assert = require( 'chai' ).assert;
var path = require( 'path' );
var mkdirp = require( 'mkdirp' );
var exists = require( 'utils-fs-exists' );
var noop = require( '@kgryte/noop' );
var runWandbox = require( './../lib/file.js' );
var file_v2 = require( './../lib/file_v2.js');
var copy = require( 'utils-copy' );


// FIXTURES //

var gammaExpected = require( './fixtures/gamma_expected.json' );
var sampleExpected = require( './fixtures/sample_expected.json' );


// TESTS //

tape( 'main export is a function', function test( t ) {
	t.ok( true, __filename );
	t.equal( typeof runWandbox, 'function', 'main export is a function' );
	t.end();
});

tape( 'file_v2 export is a function', function test( t ) {
	t.ok( true, __filename );
	t.equal( typeof file_v2, 'function', 'main export is a function' );
	t.end();
});

tape( 'the function throws an error if provided arguments of the wrong type', function test( t ) {
	var values;
	var i;

	values = [
		[5,'boop.cpp',{},noop],
		['beep.json',NaN,{},noop],
		['beep.json','boop.cpp',null,noop],
		['beep.json','boop.cpp',{},true],
		[undefined,'boop.cpp',noop],
		['beep.json',-2,noop],
		['beep.json','boop.cpp',[]],
		[{},{},noop],
		['boop.cpp',noop,noop],
		['boop.cpp',{},'woot'],
		[[],noop],
		['boop.cpp',{}]
	];

	for ( i = 0; i < values.length; i++ ) {
		t.throws( badValue( values[i] ), Error, 'throws an error when provided ' + values[i].join(',') );
	}
	t.end();
	function badValue( args ) {
		return function badValue() {
			runWandbox.apply( null, args );
		};
	}
});

tape( 'the function throws an error if provided an invalid option', function test( t ) {
	t.throws( badValue, TypeError, 'throws a type error' );
	t.end();
	function badValue() {
		runWandbox( 'beep.json', 'beep.cpp', {
			'save': null
		}, noop );
	}
});

tape( 'the function runs a source code file on Wandbox and saves results to file', function test( t ) {
	var outFile;
	var outDir;

	outDir = path.resolve( __dirname, '..', 'build/'+(new Date()).getTime() );
	outFile = path.join( outDir, 'output.json' );

	mkdirp.sync( outDir );
	runWandbox( outFile, './test/fixtures/gamma.cpp', done );

	function done( error, res ) {
		var bool;
		if ( error ) {
			t.ok( false, error.message );
			return t.end();
		}
		bool = exists.sync( outFile );
		t.ok( bool, 'converted file exists' );

		assert.deepEqual( JSON.parse(res), gammaExpected );

		t.end();
	}
});

tape( 'the function runs a source code file on Wandbox and saves results to file (options)', function test( t ) {
	var outFile;
	var outDir;

	outDir = path.resolve( __dirname, '..', 'build/'+(new Date()).getTime() );
	outFile = path.join( outDir, 'output.json' );

	mkdirp.sync( outDir );
	runWandbox( outFile, './test/fixtures/sample.cpp', {
		'options': 'warning,gnu++1y',
		'compiler': 'gcc-head',
		'compiler-option-raw': '-Dx=hogefuga\n-O3'
	}, done );

	function done( error, res ) {
		var bool;
		if ( error ) {
			t.ok( false, error.message );
			return t.end();
		}
		bool = exists.sync( outFile );
		t.ok( bool, 'output file exists' );

		assert.deepEqual( JSON.parse(res), sampleExpected );

		t.end();
	}
});

tape( 'the function runs a source code file on Wandbox', function test( t ) {
	runWandbox( './test/fixtures/gamma.cpp', done );

	function done( error, res ) {
		if ( error ) {
			t.ok( false, error.message );
			return t.end();
		}
		t.equal( typeof res, 'object', 'returns an object' );

		t.end();
	}
});

tape( 'the function runs a source code file on Wandbox (v2)', function test( t ) {
	//runWandbox( './test/fixtures/gamma.cpp', done );
	var opts = copy ( require('../lib/defaults.json') );
	file_v2( './test/fixtures/gamma.cpp', opts, done );

	function done( error, res ) {
		if ( error ) {
			t.ok( false, error.message );
			return t.end();
		}
		t.equal( typeof res, 'object', 'returns an object' );

		t.end();
	}
});

tape( 'the function runs a source code file on Wandbox (options)', function test( t ) {
	runWandbox( './test/fixtures/gamma.cpp', {'save':true}, done );

	function done( error, res ) {
		if ( error ) {
			t.ok( false, error.message );
			return t.end();
		}
		t.equal( typeof res, 'object', 'returns an object' );


		// Result object has `permlink` and `url` keys since `save=true`...
		t.equal( typeof res.permlink, 'string', 'object has `permlink` key' );
		t.equal( typeof res.url, 'string', 'object has `url` key' );

		t.end();
	}
});

tape( 'the function calls callback with an error if file is non-existant', function test( t ) {
	runWandbox( './test/fixtures/notthere.cpp', done );

	function done( error ) {
		t.equal( error instanceof Error, true, 'returns an error object' );
		t.end();
	}
});
