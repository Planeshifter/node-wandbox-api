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

/**
 *
 * @param {String} srcFile - file to run on Wandbox
 * @param {Array} opts - function options
 * @param {Function} clbk - callback to invoke after receiving results from Wandbox
 * @param {String} [dest] - output file path
 */
function file(srcFile, opts, clbk, dest) {
	let dir = cwd();
	debug( 'Current working directory: %s', dir );

	let inputFile = resolve( dir, srcFile );
	debug( 'Input file: %s', inputFile );

	readFile( inputFile, {'encoding':'utf-8'}, onFile);

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
		let start = Date.now();

		const req = https.request(params, (res) => {
			res.setEncoding('utf8')
			console.log(`statusCode: ${res.statusCode}`);
			res.on('data', function(chunk) {
				if ((Date.now() - start) > opts.timeout) {
					e = new Error('Request Timed out.');
					req.destroy();
				}
				resdata += chunk;
			})

			res.on('close', function() {
				if (e) {
					resdata = '{ "response":"Request timed out." }';
				}
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
			clbk( error, JSON.parse(body) );
		}
	} // end FUNCTION done()
}

module.exports = file
