import Dep from './dep'
import {arrayMethods } from './array'
import {def,isArray,isPlainObject,hasProto,hasOwn} from './util/index'

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

/**
+ * By default, when a reactive property is set, the new value is
+ * also converted to become reactive. However in certain cases, e.g.
+ * v-for scope alias and props, we don't want to force conversion
+ * because the value may be a nested value under a frozen data structure.
+ *
+ * So whenever we want to set a reactive property without forcing
+ * conversion on the new value, we wrap that call inside this function.
+ */

let shouldonvert = true;
export function withoutConversion(fn){
	shouldConver = false;
	fn();
	shouldConver = true;
}

/**
+ * Observer class that are attached to each observed
+ * object. Once attached, the observer converts target
+ * object's property keys into getter/setters that
+ * collect dependencies and dispatches updates.
+ *
+ * @param {Array|Object} value
+ * @constructor
+ */
export function Observer(value){
	this.value = value;
	this.dep = new Dep();
	def(value,'__ob__',this);
	if(isArray(value)){
		var augment = hasProto?protoAugment:copyAugment;
		augment(value,arrayMethods,arrayKeys);
		this.observeArray(value);
	}else{
		this.walk(value);
	}
}
Observer.prototype.walk = function(obj){
	var keys = Object.keys(obj);
}











