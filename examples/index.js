'use strict';

var runWandbox = require( './../lib' );

// String:

var code = '#include <iostream>\nint main() {\n\tstd::cout << "All is well" << std::endl;}';
runWandbox.fromString( code, clbk );

// File:

// Pass result to callback function...
runWandbox( './examples/fixtures/code.cpp', clbk );

// Save output to file...
runWandbox( './examples/fixtures/output.json', './examples/fixtures/code.cpp' );

function clbk( error, results ) {
	if ( error ) {
		throw new Error( error.message );
	}
	console.log( results );
}
