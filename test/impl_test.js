const runWandbox = require('../lib/index');

// let res = runWandbox.fromStringV2(
// 	{
// 		compiler: "lua-5.4.1",
// 		codes: [],
// 		options: "",
// 		save: true,
// 		timeout: 30000,
// 		code: "print(\"Hello\")"
// 	},
// 	function done(error, res) {
// 		console.log(error);
// 		console.log(res);
// 	}
// );


// console.log("Looking for compilers for language: Cringe");
// let list = runWandbox.getCompilers("Cringe");

// list.then(console.log).catch(console.error);

// console.log("Looking for compilers for language: Lua");
// list = runWandbox.getCompilers("Lua");

// list.then(console.log).catch(console.error);

console.log("Promise StringV3");
let res = runWandbox.fromStringV3(
	{
		compiler: "lua-5.4.0",
		codes: [],
		options: "",
		save: true,
		timeout: 30000,
		code: "print(\"Hello\")"
	},
);

res.then(console.log).catch(console.error);
