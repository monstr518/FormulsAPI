var SendToServac = require('./handler.js').SendToServac;



var Manager = (AccessServerCPP)=>{
	var LazyPairs = [];
	var Line = [];
	var isActive = 0;
	var Run = ()=>{
		if(!Line.length){
			isActive = 0;
			//console.log(LazyPairs);
			return;
			}
		var pair = Line.shift();
		var f = (text)=>{
			if(text!="ServerNotFound")LazyPairs.push([pair[0],text]);
			pair[1](text);
			Run();
			};
		SendToServac(AccessServerCPP,pair[0],f);
		};
	var AddLine = (Message,cb)=>{
		Line.push([Message,cb]);
		if(!isActive){
			isActive = 1;
			Run();
			}
		};
	var Question = (Message,cb)=>{
		var pos = -1;
		LazyPairs.forEach((pair,i)=>{
			if(Message==pair[0])pos = i;
			});
		if(pos<0){
			AddLine(Message,cb);
			return;
			}
		cb(LazyPairs[pos][1]);
		};
	return { AddLine, Question };
};



module.exports = { Manager };
