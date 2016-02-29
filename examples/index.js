'use strict';

var runWandbox = require( './../lib' );

// String:
var code = '#include <iostream>\nint main() {\n\tstd::cout << "All is well" << std::endl;}';
runWandbox.fromString( code, clbk );

// File:
runWandbox( './examples/fixtures/output.json', './examples/fixtures/code.cpp', clbk );

function clbk( error, results, info ) {
	if ( info ) {
		console.error( info );
	}
	if ( error ) {
		throw new Error( error.message );
	}
	console.log( results );
}
