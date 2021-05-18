var { fromString, fromFile, getCompilers } = require('../lib/index');

fromString({
	code: "print(\"Hello World!\")",
	compiler: "lua-5.4.0",
}).then(console.log).catch(console.error);

fromFile("./test/fixtures/gamma.cpp",
	{
		compiler: "gcc-head"
	}
).then(console.log).catch(console.error);

getCompilers("Lua").then(console.log).catch(console.error);
