const runWandbox = require('../lib/index');

let res = runWandbox.fromStringV2(
	{
		compiler: "lua-5.4.0",
		codes: [],
		options: "",
		save: true,
		timeout: 30000,
		code: "print(\"Hello\")"
	},
	function done(error, res) {
		console.log(error);
		console.log(res);
	}
);
