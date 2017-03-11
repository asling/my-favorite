export function isPrimitive(s){
	return typeof s === 'string' || typeof s === 'number'
}

export function set (obj,key,val){
	if(hasOwn(obj,key)){
		obj[key] = val;
		return ;
	}
	if(obj._isVue){
		set(obj._data,key,val);
		return;
	}
	var ob = obj.__ob__;
	if(!ob){
		obj[key] = val;
		return;
	}
	ob.convert(key,val);
	ob.dep.notify();
	if(ob.vms){
		var i = ob.vms.length;
		while(i--){
			var vm = ob.vms[i];
			vm._proxy(key);
			vm._digest();
		}
	}
	return val;
}

export function del(obj,key){
	if(!hasOwn(obj,key)){
		return ;
	}
	delete obj[key];
	var ob = obj.__ob__;
	if(!ob){
		return;
	}
	ob.dep.notify();
	if(ob.vms){
		var i = ob.vms.length;
		while(i--){
			var vm = ob.vms[i];
			vm._unproxy(key);
			vm._digest();
		}
	}
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

export function hasOwn(obj,key){
	return hasOwnProperty.call(obj,key);
}

var literValueRE = /^\s(true|false|-?[\d\.]+|'[^']*'|"[^"]*")\s?$/;
export function isLiteral(exp){
	return literalValueRE.test(exp);
}

export function isReserved(str){
	var c = (str+'').charCodeAt(0); //36 95
	return c === 0x24 || c === 0x5F;
}

export function _toString(value){
	return value == null
		? ''
		: value.toString();
}

export function toNumber(value){
	if(typeof value !== 'string'){
		return value;
	}else{
		var parsed = Number(value);
		return isNaN(parsed)
			:value
			?parsed;
	}
}

export function toBoolean(value){
	return value === 'true'
		? true
		: value === 'false'
			? false
			: value
}

export function stripQuotes(str){
	var a = str.charCodeAt(0);
	var b = str.charCodeAt(str.length-1);
	return a === b && (a === 0x22 || a === 0x27)
		? str.slice(1,-1)
		: str;
}

var camelizeRE = /-(\w)/g;
export function camelize(str){
	return str.replace(camelize,toUpper);
}

function toUpper(_,c){
	return c ? c.toUpperCase() : '';
}

var hyphenateRE = /([a-z\d]([A-Z]))/g;
export function hyphenate(str){
	return str.replace(hyphenateRE,"$1-$2").toLowerCase();
}

var classifyRE = /(?:^|[-_\/])(\w)/g
export function classify(str){
	return str.replace(classifyRE,toUpper);
}

export function bind(fn,ctx){
	return function(a){
		var l = arguments.length;
		return l
			? l>1
				?fn.apply(ctx,arguments)
				:fn.call(ctx,a)
			:fn.call(ctx)
	}
}

export function toArray(list,start){
	start = start || 0;
	var i = list.length-start;
	var ret = new Array(i);
	while(i--){
		ret[i] = list[i+start];
	}
	return ret;
}

export function extend(to,from){
	var keys = Object.keys(from);
	var i = keys.length;
	while(i--){
		to[keys[i]] = from[keys[i]];
	}
	return to
}

export function isObject(obj){
	return obj !== null && typeof obj === 'object';
}

var toString = Object.prototype.toString;
var OBJECT_STRING = '[object Object]';
export function isPlainObject(obj){
	return toString.call(obj) === OBJECT_STRING;
}

export const isArray = Array.isArray;
export function def(obj,key,val,enumerable){
	Object.defineProperty(obj,key,{
		value:val,
		enumerable: !!enumerable,
		writeable:true,
		configurable:true,
	});
}

export function debounce(func,wait){
	var timeout,args,context,timestamp,result
	var later = function(){
		var last = Date.now() - timestamp
		if(last<wait && last>=0){
			timeout  = setTimeout(later,wait-last);
		}else{
			timeout = null;
			result = func.apply(context,args);
			if(!timeout) context = args = null;
		}
	}
	return function (){
		context = this;
		args = arguments;
		timestamp = Date.now();
		if(!timeout){
			timeout = setTimeout(later,wait);
		}
		return result;
	}
}

export function indexOf(arr,obj){
	var i = arr.length;
	while(i--){
		if(arr[i] === obj) return i;
	}
	return -1;
}

export function cancellable(fn){
	var cb = function(){
		if(!cb.cancelled){
			return fn.apply(this,arguments);
		}
	}
	cb.cancel = function(){
		cb.cancelled = true;
	}
	return cb;
}


























