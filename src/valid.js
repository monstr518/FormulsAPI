

var isTable = (data)=>{
	if(data==null)return 0;
	var isNotTable = Array.isArray(data);
	return !(typeof(data)!="object" || isNotTable);
};



var Valid = (text)=>{
	var data;
	try{
		data = JSON.parse(text);
	}catch(e){
		return "MustBeJSON";
	};
	if(!isTable(data))return "MustBeTable";
	var NeedKey = [ "formula", "compare", "optimize", "equality" ];
	var Keys = Object.keys(data);
	var TaskName = NeedKey.filter((it)=>{
		return Keys.includes(it);
		});
	var size = TaskName.length;
	if(!size)TaskName = NeedKey;
	if(size!=1)return [ "NeedOneOfKey", TaskName ];
	TaskName = TaskName[0];
	if(TaskName == "formula"){
		var formula = data["formula"];
		if(typeof(formula)!="string")return ["formula", "MustBeString"];
		if(!Keys.includes("from"))return ["NeedKey", "from"];
		var xfrom = data["from"];
		if(!isTable(xfrom))return ["from", "MustBeTable"];
		Keys = Object.keys(xfrom);
		if(!Keys.length)return ["from", "MustIncludeVars"];
		var Valid1 = Keys.map((it)=>{
			var row = xfrom[it];
			if(!Array.isArray(row))return [it, "MustBeArray"];
			var m = row.filter((i)=>{
				return (typeof(i)!="number");
				});
			if(m.length)return [it, "MustBeArrayNumbers"];
			if(!row.length)return [it, "MustBeNoEmptyArray"];
			return true;
			});
		Valid1 = Valid1.filter((i)=>{
			return !(i===true);
			});
		if(Valid1.length)return Valid1;
		var size = -1;
		var isOK = 1;
		Keys.map((it)=>{
			var s = xfrom[it].length;
			if(size<0)size = s;
			if(size!=s)isOK = 0;
			});
		if(!isOK)return [Keys, "MustBeSameSize"];
		return true;
		}
	if(TaskName == "compare"){
		var compare = data["compare"];
		var isArray = Array.isArray(compare);
		if(!isArray)return ["compare", "MustBeArray"];
		if(compare.length!=3)return ["compare", "MustBeArraySize:3"];
		if(typeof(compare[0])!="string")return ["compare:1", "MustBeString"];
		if(typeof(compare[1])!="string")return ["compare:2", "MustBeString"];
		if(typeof(compare[2])!="string")return ["compare:3", "MustBeString"];
		if(compare[1]!="==")return ["compare:2", "MustBe", "=="];
		return true;
		}
	if(TaskName == "optimize"){
		var optimize = data["optimize"];
		if(typeof(optimize)!="string")return ["optimize", "MustBeString"];
		if(!Keys.includes("from"))return true;
		var xfrom = data["from"];
		if(!isTable(xfrom))return ["from", "MustBeTableOrNotBe"];
		Keys = Object.keys(xfrom);
		var m = Keys.map((it)=>{
			var N = xfrom[it];
			if(typeof(N)!="number")return [it, "MustBeNumber"];
			return true;
			});
		m = m.filter((it)=>{
			return !(it===true);
			});
		if(m.length)return m;
		return true;
		}
	if(TaskName == "equality"){
		var equality = data["equality"];
		var isArray = Array.isArray(equality);
		if(!isArray)return ["equality", "MustBeArray"];
		if(equality.length!=2)return ["equality", "MustBeArraySize:2"];
		if(typeof(equality[0])!="string")return ["equality:1", "MustBeString"];
		if(typeof(equality[1])!="string")return ["equality:2", "MustBeString"];
		if(!Keys.includes("unknown"))return true;
		var unknown = data["unknown"];
		isArray = Array.isArray(unknown);
		if(!isArray)return ["unknown", "MustBeArray"];
		unknown = unknown.filter((it)=>{
			return (typeof(it)!="string");
			});
		if(unknown.length)return ["unknown", "MustBeArrayStrings"];
		return true;
		}
	return false;
};





var ValidComment = (text)=>{
	var data;
	try{
		data = JSON.parse(text);
	}catch(e){
		return "Текст запроса нарушает формат <a href='https://habr.com/ru/post/554274/'>JSON</a> либо не является им вообще.";
	};
	if(!isTable(data))return 'Данные должны быть в таблице. Пример: {"key":"value", "key2":0}';
	var NeedKey = [ "formula", "compare", "optimize", "equality" ];
	var Keys = Object.keys(data);
	var TaskName = NeedKey.filter((it)=>{
		return Keys.includes(it);
		});
	var size = TaskName.length;
	if(!size)TaskName = NeedKey;
	if(size!=1)return "Один из указанных ключей обязателен. И только один.";
	TaskName = TaskName[0];
	if(TaskName == "formula"){
		var formula = data["formula"];
		if(typeof(formula)!="string")return 'Значение этого ключа должно быть строкой с формулой. Пример: "a+1".';
		if(!Keys.includes("from"))return "Нужен указанный ключ.";
		var xfrom = data["from"];
		if(!isTable(xfrom))return "from должен быть таблицей. Пример {}.";
		Keys = Object.keys(xfrom);
		if(!Keys.length)return "Таблица должна содержать ключи с именами переменных.";
		var Valid1 = Keys.map((it)=>{
			var row = xfrom[it];
			if(!Array.isArray(row))return "Указанный ключ должен содержать множество чисел. Пример: [-1,777.5]";
			var m = row.filter((i)=>{
				return (typeof(i)!="number");
				});
			if(m.length)return [it, "MustBeArrayNumbers"];
			if(!row.length)return [it, "MustBeNoEmptyArray"];
			return true;
			});
		Valid1 = Valid1.filter((i)=>{
			return !(i===true);
			});
		if(Valid1.length)return "Значения каждой перименной должно быть множеством содержащим только числоа.";
		var size = -1;
		var isOK = 1;
		Keys.map((it)=>{
			var s = xfrom[it].length;
			if(size<0)size = s;
			if(size!=s)isOK = 0;
			});
		if(!isOK)return "Множества всех переменных должны быть одинакового размера.";
		return true;
		}
	if(TaskName == "compare"){
		var compare = data["compare"];
		var isArray = Array.isArray(compare);
		if(!isArray)return "Указанный ключ должен быть множеством. Пример: [].";
		if(compare.length!=3)return "Указанное множество должно состоять из трьох строк текста";
		if(typeof(compare[0])!="string")return 'Указанная позиция в множестве должна быть текстом. Пример: "string".';
		if(typeof(compare[1])!="string")return 'Указанная позиция в множестве должна быть текстом. Пример: "string".';
		if(typeof(compare[2])!="string")return 'Указанная позиция в множестве должна быть текстом. Пример: "string".';
		if(compare[1]!="==")return 'На второй позиции обязан быть текст: "==".';
		return true;
		}
	if(TaskName == "optimize"){
		var optimize = data["optimize"];
		if(typeof(optimize)!="string")return 'Значение этого ключа должно быть строкой с формулой. Пример: "a+1".';
		if(!Keys.includes("from"))return true;
		var xfrom = data["from"];
		if(!isTable(xfrom))return "Указанный ключ должен быть таблицей либо его не должно быть вообще.";
		Keys = Object.keys(xfrom);
		var m = Keys.map((it)=>{
			var N = xfrom[it];
			if(typeof(N)!="number")return [it, "MustBeNumber"];
			return true;
			});
		m = m.filter((it)=>{
			return !(it===true);
			});
		if(m.length)return "Значение всех переменных должны быть числовыми.";
		return true;
		}
	if(TaskName == "equality"){
		var equality = data["equality"];
		var isArray = Array.isArray(equality);
		if(!isArray)return "Указанный ключ должен содержать множество строк текста.";
		if(equality.length!=2)return "Множество должно состоять из двух строк с формулами.";
		if(typeof(equality[0])!="string")return "Множество должно состоять из двух строк с формулами.";
		if(typeof(equality[1])!="string")return "Множество должно состоять из двух строк с формулами.";
		if(!Keys.includes("unknown"))return true;
		var unknown = data["unknown"];
		isArray = Array.isArray(unknown);
		if(!isArray)return "Указанный ключ должен быть множеством, либо не быть вообще.";
		unknown = unknown.filter((it)=>{
			return (typeof(it)!="string");
			});
		if(unknown.length)return "Указанный ключ должен быть множеством строк с именами неизвесных переменных.";
		return true;
		}
	return false;
};


