const list = require("../lib/getCompilerList");

function getList(lang) {
	return list(lang);
}

getList("lua").then(console.log).catch(console.error);
