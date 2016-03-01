'use strict';

// MODULES //

var tape = require( 'tape' );
var runWandbox = require( './../lib' );


// TESTS //

tape( 'main export is a function', function test( t ) {
	t.ok( true, __filename );
	t.equal( typeof runWandbox, 'function', 'main export is a function' );
	t.end();
});


tape( 'exports a function for sending a source code string to Wandbox', function test( t ) {
	t.equal( typeof runWandbox.fromString, 'function', 'export is a function' );
	t.end();
});
