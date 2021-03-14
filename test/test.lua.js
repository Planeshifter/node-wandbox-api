let src = 'print(("warbo"):rep(9999))';
var runWandbox = require('../lib/index');

runWandbox.fromString(`os=nil; io=nil; debug=nil;\n\n` + src, {'compiler': 'lua-5.3.0'}, function clbk( error, results) {
    console.log('--------START--------')
    console.log(results);
});