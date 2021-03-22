'use strict';

// MODULES //

var debug = require( 'debug' )( 'wandbox-api:file' );
var copy = require( 'utils-copy' );
var cwd = require( 'utils-cwd' );
var readFile = require( 'utils-fs-read-file' );
var writeFile = require( 'fs' ).writeFile;
var https = require( 'https' );
var resolve = require( 'path' ).resolve;
var typeName = require( 'type-name' );
var defaults = require( './defaults.json' );
var validate = require( './validate.js' );


// VARIABLES //

var interfaces = {
	'string,string,Object,function': [ 0, 1, 2, 3 ],
	'string,string,function': [ 0, 1, -1, 2 ],
	'string,Object,function': [ -1, 0, 1, 2 ],
	'string,function': [ -1, 0, -1, 1 ]
};


// FILE //

/**
* FUNCTION: file( [dest,] src[, opts], clbk )
*	Execute source file on Wandbox and fetch results.
*
* @param {String} [dest] - output file path
* @param {String} src - file to run on Wandbox
* @param {Object} [opts] - function options
* @param {String} [opts.compiler="gcc-head"] - name of used compiler
* @param {Array} [opts.codes=[]] - additional codes, objects with `file` and `code` keys
* @param {String} [opts.options="boost-1.60,warning,gnu++1y"] - used options for a compiler joined by comma.
* @param {String} [opts.stdin=""] - standard input
* @param {String} [opts.compiler-option-raw=""] - additional compile-time options joined by line-break
* @param {String} [opts.runtime-option-raw=""] - additional run-time options joined by line-break
* @param {Boolean} [opts.save=false] - boolean indicating whether permanent link should be generated
* @param {Function} clbk - callback to invoke after receiving results from Wandbox
* @returns {Void}
*/
function file() {
	var outFile;
	var options;
	var inputFile;
	var types;
	var dest;
	var opts;
	var clbk;
	var src;
	var err;
	var dir;
	var idx;
	var len;
	var i;

	len = arguments.length;
	types = new Array( len );
	for ( i = 0; i < len; i++ ) {
		types[ i ] = typeName( arguments[ i ] );
	}
	types = types.join( ',' );
	idx = interfaces[ types ];
	if ( idx === void 0 ) {
		throw new Error( 'invalid input argument(s). No implementation matching `f('+types+')`.' );
	}
	if ( idx[ 0 ] >= 0 ) {
		dest = arguments[ idx[0] ];
	}
	src = arguments[ idx[1] ];
	if ( idx[ 2 ] >= 0 ) {
		options = arguments[ idx[2] ];
	}
	clbk = arguments[ idx[3] ];

	opts = copy( defaults );
	if ( options ) {
		err = validate( opts, options );
		if ( err ) {
			throw err;
		}
	}
	dir = cwd();
	debug( 'Current working directory: %s', dir );

	inputFile = resolve( dir, src );
	debug( 'Input file: %s', inputFile );

	readFile( inputFile, {'encoding':'utf8'}, onFile );
	/**
	* FUNCTION: onFile( error, file )
	*	Callback invoked upon reading a file.
	*
	* @private
	* @param {Error|Null} error - error object
	* @param {String} data - file contents
	* @returns {Void}
	*/
	function onFile( error, data ) {
		if ( error ) {
			debug( 'Error encountered while attempting to read a input file %s: %s', inputFile, error.message );
			return done( error );
		}
		debug( 'Successfully read input file: %s', inputFile );

		// Add `code` key to options holding the source code to run on Wandbox...
		opts.code = data;

		const post_data = JSON.stringify(opts);

		const params = {
			hostname: 'wandbox.org',
			port: 443,
			path: '/api/compile.json',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(post_data)
			}
		}

		let e = null;

		let resdata = "";

		const req = https.request(params, (res) => {
			res.setEncoding('utf8')
			console.log(`statusCode: ${res.statusCode}`);
			res.on('data', function(chunk) {
				resdata += chunk;
			})

			res.on('close', function() {
				done(e, res, resdata);
			});
		}, done)

		req.on('error', error => {
			e = error;
		})

		req.write(post_data);
		req.end();
	}
	/**
	* FUNCTION: done( error, message, body )
	*	Callback invoked after resolving POST request to Wandbox.
	*
	* @private
	* @param {Error|Null} error - error object
	* @param {Object} message - an http.IncomingMessage
	* @param {Object} body - response body
	* @returns {Void}
	*/
	function done( error, message, body ) {
		error = error || null;
		body = body || null;

		// Save response body if `dest` is supplied:
		if ( dest !== void 0 ) {
			outFile = resolve( dir, dest );
			writeFile( outFile, JSON.stringify( body ), function( err ) {
				clbk( err, body );
			});
		} else {
			clbk( error, body );
		}
	} // end FUNCTION done()
} // end FUNCTION file()


// EXPORTS //

module.exports = file;
