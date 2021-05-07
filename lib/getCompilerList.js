const https = require('https');

module.exports = function getCompilerList(lang) {
	return new Promise((resolve, reject) => {
		https.get("https://wandbox.org/api/list.json", res => {
			let result = "";
			res.on("data", d => {
				result += d;
			});
			res.on("close", () => {
				const list = [];
				const dataList = JSON.parse(result);
				if (lang) {
					const langToCheck = lang.toLowerCase();
					dataList.forEach(compiler => {
						if (compiler.language.toLowerCase() == langToCheck) {
							list.push(compiler);
						}
					});
					resolve(list);
				} else {
					resolve(dataList);
				}
			})
			res.on("error", (e) => { reject(`[${e.name}]: ${e.message}`) })
		});
	})
}
