'use strict';

const { readFile } = require('fs');
var https = require( 'https' );

/**
 *
 * @param {String} srcFile - file to run on Wandbox
 * @param {Array} opts - function options
 * @returns JSON Result or String
 */
module.exports = function string(srcFile, opts) {
	return new Promise((resolve, reject) => {
		if (!srcFile) {
			reject("No source provided.");
		}

		let dir = cwd();
		let inputFile = resolt( dir, srcFile);

		readFile( inputFile, {'encoding':'utf-8'}, onFile);

		function onFile( error, data ) {
			if ( error ) {
				reject(`[${e.name}]: ${e.message}`);
			}

			opts.code = data;

			require('./getCompilerList')().then(list => {
				let found = false;
				list.forEach(compiler => {
					if (compiler.name.toLowerCase() === opts.compiler.toLowerCase()) {
						found = true;
					}
				});

				if (!found) {
					reject("Invalid compiler supplied.");
				} else {
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
								reject(`[${e.name}]: ${e.message}`)
							} else {
								try {
									resolve(JSON.parse(data))
								} catch (err) {
									reject(`[${err.name}]: ${err.message}`)
								}
							}
						});
					})

					req.on('error', error => {
						e = error;
					})

					req.write(post_data);
					req.end();
				}
			}).catch(e => {
				reject("Failed to gather list of compilers.");
			})
			req.end();
		}
	});
}
