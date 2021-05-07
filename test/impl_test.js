const runWandbox = require('../lib/index');

let res = runWandbox.fromStringV2(
	{
		compiler: "lua-5.4.1",
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

let list = runWandbox.getCompilers("lua");

list.then(console.log).catch(console.error);
