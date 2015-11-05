var fs = require('fs');

fs.readFile(__dirname+'/src/puff-raw.js', function(err, body){
    if(err instanceof Error){	
	console.log('Error reading file ', __dirname+'/src/puff-raw.js :: ', err);
	throw err;
    } else {
	fs.writeFile(__dirname+'/build/puff-node.js', body.toString() +"\nmodule.exports = puff;\n", 
		    function(err){
			if(err instanceof Error){
			    console.log(err);
			    throw err;
			} else {
			    console.log('created node version of puff at ', __dirname+'/build/puff-node.js');
			}
		    });
	fs.writeFile(__dirname+'/build/puff-browser.js', "(function(global){\n" + body.toString() 
		     +"if(typeof global !== \"undefined\"){ global.puff = puff; };\n"
		     +"return puff;\n"+
		     "})(window);\n", 
		    function(err){
			if(err instanceof Error){
			    console.log(err);
			    throw err;
			} else {
			    console.log('created node version of puff at ', __dirname+'/build/puff-browser.js');
			}
		    })
    }
});
