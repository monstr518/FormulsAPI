const net = require('net');



var SendToServac = (AccessServerCPP,Message,cb)=>{
	var ok = 0;
	var client = new net.Socket();
	client.connect(AccessServerCPP.port, AccessServerCPP.host, () => {
		// callback, when connection successfull
		//var Message = JSON.stringify(Data[parseInt(Math.random()*Data.length)]);
		client.write(Message);
		});
	client.on('data', (data) => {
		//console.log(data.toString());
		ok = 1;
		cb(data.toString());
		});
	client.on('close', (data) => {
		//console.log(data);
		//cb(data);
		});
	client.on('error', (data) => {
		//console.log(data);
		if(!ok)cb('ServerNotFound');
		});
}



module.exports = { SendToServac };
