


var DataTable = {
	"id-e-1": {
		"formula": "a*b+100",
		"from": {
			"a":[1,2,4,20],
			"b":[5,8,1,10]
			}
		},
	"id-e-2": {
		"formula": "pi*2",
		"from": {
			"pi":[3.1,3.14,3.1415]
			},
		},
	"id-e-3": {
		"formula": "pow(x,1/2)",
		"from": {
			"x": [100,25,9,4,1.327]
			}
		},
	"id-e-10": {
		"optimize": "-1-(c*2)-10+c*nn-3*nn+(c-nn)*2+35"
		},
	"id-e-11": {
		"optimize": "((a+b+100)/(b+a))*(11/a)"
		},
	"id-e-12": {
		"optimize": "pow(a,2)*pow(a,3)+5"
		},
	"id-e-20": {
		"equality": [ "5*a*a-7*a-16", "0" ],
		"unknown": [ "a" ]
		},
	"id-e-21": {
		"equality": [ "a*a+2*a-300", "n+x+100*(n-x)" ],
		"unknown": [ "a", "n" ]
		},
	"id-e-30": {
		"compare": ["n+1+x", "==", "(1+n*1)+(x-0)"]
		}
};



$(document).ready(()=>{
	var isNeedWait = 0;
	$("#id-key-send").click(()=>{
		var text = $("#id-vopros").val();
		$("#id-otvet").text("Ждите...");
		var handler = (text)=>{
			isNeedWait = 0;
			var code;
			try{
				code = JSON.parse(text);
				if(typeof(code)=="string")text = code;
				}catch(e){}
			text = text.split("\n").join("<br/>");
			$("#id-otvet").html(text);
			};
		var handlerE = (text)=>{
			isNeedWait = 0;
			$("#id-otvet").text("Повторите попытку.");
			};
		var result = Valid(text);
		if(typeof(result)=="object")result = JSON.stringify(result);
		var isValide = (result===true);
		if(!isNeedWait){
			if(isValide){
				isNeedWait = 1;
				$.ajax({
					type: 'POST',
					url: "./api",
					data: { text },
					success: handler,
					error: handlerE
					});
				}else{
				result += "\n";
				result += ValidComment(text);
				handler(result);
				}
			}
		});
	$(".c-ex").click((event)=>{
		var id = event.currentTarget.id;
		//console.log(id);
		var task = DataTable[id];
		task = JSON.stringify(task,null,2);
		if(id=="id-e-1"){
			var t = $("#id-container>#id-d1").html();
			task = t;
			}
		$("#id-vopros").val(task);
		});
});


