const runWandbox = require('../lib/index');

let res = runWandbox.fromStringv2(
	{
		compiler: "lua-5.4.0",
		codes: [],
		options: "",
		code: "print 'Hello, Wandbox!'",
		save: false,
		timeout: 30000
	},
	function done(error, res) {
		console.log(error);
		console.log(res);
	}
);
