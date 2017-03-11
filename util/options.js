import Vue from '../instacne/index'
import config from '../config'
import {
	extend,set,isObject,isArray,isPlainObject,hasOwn,camelize,hypenate
} from './lang'
import { warn } from './debug'
import { commonTagRE, reservedTagRE } from './component'

var strats = config.optionMergeStrategies = Object.create(null);

function mergeData(to,from){
	var key,toVal,fromVal;
	for(key in from){
		toVal = to[key];
		fromVal = from[key];
		if(!hasOwn(to,key)){
			set(to,key,fromVal);
		}else if(isObject(toVal) && isObject(fromVal)){
			mergeData(toVal,fromVal);
		}
	}
	return to;
}
strats.data = function(parentVal,childVal,vm){
	if(!vm){
		if(!childVal){
			return parentVal;
		}
		if(typeof childVal !== 'function'){
			process.env.NODE_ENV !== 'production' && warn('The dta option shoud be a function this .....');
			return parentVal;
		}
		if(!parentVal){
			return childVal;
		}
		return function mergeDataFn(){
			return mergeData(
				childVal.call(this),
				parentVal.call(this),
			);
		}
	}else if(parentVal || childVal){
		return function mergedInstanceDataFn(){
			var instanceData = typeof childVal ==='function' ? childVal.call(vm): childVal;
			var defaultData = typeof parentVal === 'function' ? parentVal.call(vm):undefined;
			if(instanceData){
				return mergeData(instanceData,defaultData);
			}else{
				return defaultData;
			}
		}
	}
}

strats.el = function(parentVal,childVal,vm){
	if(!vm && childVal && typeof childVal !== 'function'){
		process.env.NODE_ENV !== 'production' && warn( 'The "el" option should be a function '+'that returns a per-instance value in component ' + 'definitions .',vm);
		return;
	}
	var ret = childVal || parentVal;
	return vm && typeof ret === 'function'?ret.call(vm):ret;
}

strats.init = 
strats.created = 
strats.ready = 
strats.attached = 
strats.detached = 
strats.beforeCompile = 
strats.compiled = 
strats.beforeDestory = 
strats.destoryed = 
strats.activate = function(parentVal,childVal){
	return childVal
		? parentVal
			?parentVal.concat(childVal)
			:isArray(childVal)
				?childVal
				:[childVal]
		:parentVal;
}

function mergeAssets(parentVal,childVal){
	var res = Object.create(parentVal);
	return childVal
		? extend(res,guardArrayAssets(childVal))
		: res;
}

config._assetTypes.forEach(function(type){
	strats[type+'s'] = mergeAssets;
});

strats.watch = 
strats.events = function(parentVal,childVal){
	if(!childVal) return parentVal;
	if(!parentVal) return childVal;
	var ret = {};
	extend(ret,parentVal);
	for(var key in childVal){
		var parent = ret[key];
		var child = childVal[key];
		if(parent && isArray(parent)){
			parent = [parent];
		}
		ret[key] = parent ? parent.concat(child):[child];
	}
	return ret;
}

strats.props = 
strats.methods = 
strats.computed = function(parentVal,childVal){
	if(!childVal) return parentVal;
	if(!parentVal) return childVal;
	var ret = Object.create(null);
	extend(ret,parentVal);
	extend(ret,childVal);
	return ret;
}

var defaultStrat = function(parentVal,childVal){
	return childVal === undefined
		? parentVal
		: childVal;
}

function guardComponents(options){
	if(options.components){
		var components = options.components = 
			guardArrayAssets(options.components);
		var ids = Object.keys(components);
		var def;
		if(process.env.NODE_ENV !== 'production'){
			var map = options._componentNameMap = {};
		}
		for(var i = 0;l = ids.length;i<l;i++){
			var key = ids[i];
			if(commonTagRE.test(key) || reservedTagRE.test(key)){
				process.env.NODE_ENV !== 'production' && warn( '..... ' );
				continue;
			}
			if(process.env.NODE_ENV !== 'production'){
				map[key.replace(/-/g,'').toLowerCase()] = hypenate(key);
			}
			def = components[key];
			if(isPlainObject(def)){
				components[key] = Vue.extend(def);
			}
		}
	}
}

function guardProps(options){
	var props = options.props;
	var i,val;
	if(isArray(props)){
		options.props = {};
		i = props.length;
		while(i--){
			val = props[i];
			if(typeof val === 'string'){
				options.props[val] = null;
			}else if(val.name){
				options.props[val.name] = val;
			}
		}
	}else if(isPlainObject(props)){
		var keys = Object.keys(props);
		i = keys.length;
		while(i--){
			val = props[keys[i]];
			if(typeof val === 'function' ){
				props[keys[i]] = {type:val};
			}
		}
	}
}

function guardArrayAssets(assets){
	if(isArray(assets)){
		var res = {};
		var i = assets.length;
		var asset;
		while(i--){
			asset = assets[i];
			var id = typeof asset === 'function'
				? ((asset.options && asset.options.name || asset.id )
				: (asset.name || asset.id)
			if(!id){
				process.env.NODE_ENV !== 'production' && warn ( 'Array-synax assets must provide a "name" or "id" field.');
			}else{
				res[id] = asset;
			}
		}
		return res;
	}
	return assets;
}

export function mergeOptions(parent,child,vm){
	guardComponents(child);
	guardProps(child);
	var options = {};
	var key;
	if(child.mixins){
		for(var i = 0,l = child.mixins.length;i<l;i++){
			parent = mergeOptions(parent,child.mixins[i],vm);
		}
	}
	for(key in parent){
		mergeField(key);
	}
	for(key in child){
		if(!hasOwn(parent,key)){
			mergeField(key);
		}
	}
	function mergeField(key){
		var strat = strats[key] || defaultStrat;
		options[key] = strat(parent[key],child[key],vm,key);
	}
	return options;
}

export function resloveAssets(options,type,id,warnMissing){
	if(typeof id !== 'string'){
		return;
	}
	var assets = options[type];
	var camelizedId;
	var res = assets[id] ||
		assets[camelizedId = camelize(id)] ||
		assets[camelizedId.charAt(0).toUpperCase()+camelizedId.slice(1)]
	if(process.env.NODE_ENV !== 'production' && warnMissing && !res){
		warn('Failed to resolve ' + type.slice(0,-1)+':'+id,options);
	}
	return res;
}



























