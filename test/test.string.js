'use strict';

// MODULES //

var tape = require( 'tape' );
var assert = require( 'chai' ).assert;
var path = require( 'path' );
var mkdirp = require( 'mkdirp' );
var exists = require( 'utils-fs-exists' );
var noop = require( '@kgryte/noop' );
var proxyquire = require( 'proxyquire' );
var readFile = require( 'utils-fs-read-file' ).sync;
var runWandbox = require( './../lib/string.js' );


// FIXTURES //

var gamma = readFile( path.resolve( __dirname, './fixtures/gamma.cpp' ), {'encoding':'utf8'} );
var gammaExpected = require( './fixtures/gamma_expected.json' );

var sample = readFile( path.resolve( __dirname, './fixtures/sample.cpp' ), {'encoding':'utf8'} );
var sampleExpected = require( './fixtures/sample_expected.json' );


// TESTS //

tape( 'main export is a function', function test( t ) {
	t.ok( true, __filename );
	t.equal( typeof runWandbox, 'function', 'main export is a function' );
	t.end();
});

tape( 'the function throws an error if provided arguments of the wrong type', function test( t ) {
	var values;
	var i;

	values = [
		[5,'code',{},noop],
		['beep.json',NaN,{},noop],
		['beep.json','code',null,noop],
		['beep.json','code',{},true],
		[undefined,'code',noop],
		['beep.json',-2,noop],
		['beep.json','code',[]],
		[{},{},noop],
		['code',noop,noop],
		['code',{},'woot'],
		[[],noop],
		['code',{}]
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
		runWandbox( 'beep.json', gamma, {
			'save': null
		}, noop );
	}
});

tape( 'the function runs a source code string on Wandbox and saves results to file', function test( t ) {
	var outFile;
	var outDir;

	outDir = path.resolve( __dirname, '..', 'build/'+(new Date()).getTime() );
	outFile = path.join( outDir, 'output.json' );

	mkdirp.sync( outDir );
	runWandbox( outFile, gamma, done );

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

tape( 'the function runs a source code string on Wandbox and saves results to file (options)', function test( t ) {
	var outFile;
	var outDir;

	outDir = path.resolve( __dirname, '..', 'build/'+(new Date()).getTime() );
	outFile = path.join( outDir, 'output.json' );

	mkdirp.sync( outDir );
	runWandbox( outFile, sample, {
		'options': 'warning,gnu++14',
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

tape( 'the function runs a source code string on Wandbox', function test( t ) {
	runWandbox( gamma, done );

	function done( error, res ) {
		if ( error ) {
			t.ok( false, error.message );
			return t.end();
		}
		t.equal( typeof res, 'object', 'returns an object' );

		t.end();
	}
});

tape( 'the function runs a source code string on Wandbox (options)', function test( t ) {
	runWandbox( gamma, {'save':true}, done );

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

tape( 'the function calls callback with an error if Wandbox API does not respond to request', function test( t ) {
	runWandbox( gamma, {'timeout': 0}, done);

	function done( error ) {
		t.equal( error instanceof Error, true, 'returns an error object' );
		t.end();
	}
});
