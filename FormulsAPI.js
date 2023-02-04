var AccessServerCPP = {
	port: 17490,
	host: 'localhost'
};

var config = {
	host: "localhost",
	port: 8080
};

var express = require('express');
var fs = require('fs');


var Agent = require("./sub/agent.js");
Agent = Agent.getAgent(AccessServerCPP);



var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/src', express.static('src'));

var body = fs.readFileSync('src/index.html', 'utf8');

app.get('/', (req, res) => {
	res.send(body);
});


app.post('/api', (req, res) => {
	var body = req.body;
	//var data = body.data;
	//console.log(body);
	var text = body.text;
	//text = JSON.stringify(text);
	//console.log(text);
	Agent(text,(text)=>{
		if(typeof(text)!="string")text = JSON.stringify(text,null,4);
		//console.log(text);
		res.send(text);
		});

});


app.listen(config.port, () => {
	console.log(`Example app listening at http://${config.host}:${config.port}`);
});


