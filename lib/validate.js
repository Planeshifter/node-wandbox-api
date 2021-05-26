'use strict';

// MODULES //

var isBoolean = require( 'validate.io-boolean-primitive' );
var isObject = require( 'validate.io-object' );
var isObjectArray = require( 'validate.io-object-array' );
var isString = require( 'validate.io-string-primitive' );


// VALIDATE //

/**
* FUNCTION: validate( opts, options )
*	Validates function options.
*
* @param {Object} opts - destination object
* @param {Object} options - options to validate
* @param {String} [options.compiler] - name of used compiler
* @param {Array} [options.codes] - additional codes, objects with `file` and `code` keys
* @param {String} [options.options] - used options for a compiler joined by comma.
* @param {String} [options.stdin] - standard input
* @param {String} [options.compiler-option-raw] - additional compile-time options joined by line-break
* @param {String} [options.runtime-option-raw] - additional run-time options joined by line-break
* @param {Boolean} [options.save] - boolean indicating whether permanent link should be generated
* @returns {Error|Null} error or null
*/
function validate( opts, options ) {
	if ( !isObject( options ) ) {
		return new TypeError( 'invalid input argument. Options argument must be an object. Value: `' + options + '`.' );
	}
	if ( options.hasOwnProperty( 'compiler' ) ) {
		opts.compiler = options.compiler;
		if ( !isString( opts.compiler ) ) {
			return new TypeError( 'invalid option. Compiler option must be a string primitive. Option: `' + opts.compiler + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'codes' ) ) {
		opts.codes = options.codes;
		if ( !isObjectArray( opts.codes ) ) {
			return new TypeError( 'invalid option. Codes option must be an object array. Option: `' + opts.codes + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'options' ) ) {
		opts.options = options.options;
		if ( !isString( opts.options ) ) {
			return new TypeError( 'invalid option. Options option must be a string primitive. Option: `' + opts.options + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'stdin' ) ) {
		opts.stdin = options.stdin;
		if ( !isString( opts.stdin ) ) {
			return new TypeError( 'invalid option. Stdin option must be a string primitive. Option: `' + opts.stdin + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'compiler-option-raw' ) ) {
		opts[ 'compiler-option-raw' ] = options[ 'compiler-option-raw' ];
		if ( !isString( opts[ 'compiler-option-raw' ] ) ) {
			return new TypeError( 'invalid option. compiler-option-raw option must be a string primitive. Option: `' + opts[ 'compiler-option-raw' ] + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'runtime-option-raw' ) ) {
		opts[ 'runtime-option-raw' ] = options[ 'runtime-option-raw' ];
		if ( !isString( opts[ 'runtime-option-raw' ] ) ) {
			return new TypeError( 'invalid option. runtime-option-raw option must be a string primitive. Option: `' + opts[ 'runtime-option-raw' ] + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'save' ) ) {
		opts.save = options.save;
		if ( !isBoolean( opts.save ) ) {
			return new TypeError( 'invalid option. Save option must be a boolean primitive. Option: `' + opts.save + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'timeout' ) ) {
		opts.timeout = options.timeout;
		if ( isNaN( opts.timeout ) ) {
			return new TypeError( 'invalid option. Timeout option must be a number primitive. Option: `' + opts.timeout + '`.');
		}
	}
	return null;
} // end FUNCTION validate()


// EXPORTS //

module.exports = validate;
