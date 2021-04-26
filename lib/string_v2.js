'use strict';

// MODULES //

var debug = require( 'debug' )( 'wandbox-api-updated:string' );
var copy = require( 'utils-copy' );
var cwd = require( 'utils-cwd' );
var typeName = require( 'type-name' );
var writeFile = require( 'fs' ).writeFile;
var https = require( 'https' );
var resolve = require( 'path' ).resolve;
var defaults = require( './defaults.json' );
var validate = require( './validate.js' );

/**
 *
 * @param {Array} opts - function options
 * @param {Function} clbk - callback to invoke after receiving results from Wandbox
 * @param {String} [dest] - output file path
 */
 function string(opts, clbk, dest) {
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

	let data = "";
	let start = Date.now();

	const req = https.request(params, (res) => {
		res.setEncoding('utf8')
		res.on('data', function(chunk) {
			if ((Date.now() - start) > opts.timeout) {
				e = new Error('Request Timed out.');
				req.destroy();
			}
			data += chunk;
		})

		res.on('close', function() {
			if (e) {
				data = '{ "response":"Request timed out." }';
			}
			done(e, res, data);
		});
	}, done)

	req.write(post_data);
	// req.end();

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

// EXPORTS //

module.exports = string;
