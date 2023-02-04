var Valide = require("./valid.js");
//{ Valid, ValidComment, getTestsList, RunTestOfList };
var Manager = require("./manager.js").Manager;



var Data = [

{
	"optimize": "-1-(c*2)-10+c*nn-3*nn"
},
{
	"optimize": "-1-(c*2)-10+c*nn-3*nn"
},

{
	"equality": [ "a*a+2*a+25/0", "0" ],
	"unknown": [ "a" ]
},


{
	"equality": [ "a*a-25+a*2", "0" ],
	"unknown": [ "a" ]
},


{
	"optimize": "-1-(c*2)-10"
},

{
	"optimize": "a*2 + pow(n,1+1)",
	"from": {"a":5}
},

{
	"compare": ["n+1+x", "==", "(1+n*1)+(x-0)"]
},

{
	"formula": "(a/b)",
	"from": {
		"a":[1,2,4,20],
		"b":[5,8,1,10]
		}
}
];





var getAgent = (AccessServerCPP)=>{
	Manager = Manager(AccessServerCPP);
	var ServerNotFoundControl = (text,cb)=>{
		if(text=="ServerNotFound"){
			text += "\n";
			text += "Математический сервер недоступен.";
			cb(text);
			return 1;
			}
		return 0;
		};
	var NotFormulControl = (text,formul,cb)=>{
		if(text=="false"){
			text = 'Выражение "' + formul + '" содержит ошибку, либо не является формулой вообще.';
			cb(text);
			return 1;
			}
		return 0;
		};
	var Agent = (Message,cb)=>{
		var R = Valide.Valid(Message);
		var ok = (R===true);
		if(!ok){
			cb(R);
			return;
			}
		var sostav = JSON.parse(Message);
		var keys = Object.keys(sostav);
		if(keys.includes("formula")){
			var handler = (text)=>{
				if(ServerNotFoundControl(text,cb))return;
				if(NotFormulControl(text,sostav["formula"],cb))return;
				var data = {
					"formula": sostav["formula"],
					"from": sostav["from"]
					};
				Message = JSON.stringify(data);
				Manager.Question(Message,cb);
				};
			var data = {"isGoodFormula":sostav["formula"]};
			Message = JSON.stringify(data);
			Manager.Question(Message,handler);
			return;
			}
		if(keys.includes("compare")){
			var handler = (text)=>{
				if(ServerNotFoundControl(text,cb))return;
				if(NotFormulControl(text,sostav["compare"][0],cb))return;
				var handler = (text)=>{
					if(ServerNotFoundControl(text,cb))return;
					if(NotFormulControl(text,sostav["compare"][2],cb))return;
					var handler = (text)=>{
						if(ServerNotFoundControl(text,cb))return;
						var isRavno = (text=="true");
						text += "\n";
						text += (isRavno?"Формулы по сути равны.":"Формулы разные.");
						cb(text);
						};
					var data = {
						"compare": sostav["compare"],
						};
					Message = JSON.stringify(data);
					Manager.Question(Message,handler);
					};
				var data = {"isGoodFormula":sostav["compare"][2]};
				Message = JSON.stringify(data);
				Manager.Question(Message,handler);
				};
			var data = {"isGoodFormula":sostav["compare"][0]};
			Message = JSON.stringify(data);
			Manager.Question(Message,handler);
			return;
			}
		if(keys.includes("optimize")){
			var handler = (text)=>{
				if(ServerNotFoundControl(text,cb))return;
				if(NotFormulControl(text,sostav["optimize"],cb))return;
				var handler = (text)=>{
					if(ServerNotFoundControl(text,cb))return;
					cb(text);
					};
				var data = {
					"optimize": sostav["optimize"],
					"from": sostav["from"],
					};
				Message = JSON.stringify(data);
				Manager.Question(Message,handler);
				};
			var data = {"isGoodFormula":sostav["optimize"]};
			Message = JSON.stringify(data);
			Manager.Question(Message,handler);
			return;
			}
		if(keys.includes("equality")){
			var handler = (text)=>{
				if(ServerNotFoundControl(text,cb))return;
				if(NotFormulControl(text,sostav["equality"][0],cb))return;
				var handler = (text)=>{
					if(ServerNotFoundControl(text,cb))return;
					if(NotFormulControl(text,sostav["equality"][1],cb))return;
					var handler = (text)=>{
						if(ServerNotFoundControl(text,cb))return;
						var isE = (text=="UnknounNameMastBeInNamesInFormuls");
						if(isE){
							text += "\n";
							text += "Список неизвесных переменных содержит имя переменной, которой нет в уравнении.";
							cb(text);
							return;
							}
						cb(text);
						};
					var data = {
						"equality": sostav["equality"],
						};
					if(keys.includes("unknown")){
						var unknown = sostav["unknown"];
						if(unknown.length)data["unknown"] = unknown;
						}
					Message = JSON.stringify(data);
					Manager.Question(Message,handler);
					};
				var data = {"isGoodFormula":sostav["equality"][1]};
				Message = JSON.stringify(data);
				Manager.Question(Message,handler);
				};			
			var data = {"isGoodFormula":sostav["equality"][0]};
			Message = JSON.stringify(data);
			Manager.Question(Message,handler);
			return;
			}
		cb("NeverBe");
	};
	return Agent;
};






var ftest = (i)=>{
	if(Data.length<=i){
		console.log("Done");
		return;
		}
	var Message = JSON.stringify(Data[i]);
	var meHandler = (text)=>{
		console.log(Message);
		console.log(text);
		console.log();
		ftest(i+1);
		};
	Manager.Question(Message,meHandler);
};



module.exports = { getAgent, Data };
