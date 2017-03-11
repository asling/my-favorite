import { compile } from '../compiler/index'
import { observe } from '../observer/index'
import Watcher from '../observer/watcher'
import { h, patch } from '../vdom/index'
import { nextTick, isReserved, getOuterHTML } from '../util/index'

export default class Component{
	constructor(options){
		this.$options = options;
		this._data = options.data;
		const el = this._el = document.querySelector(option.el);
		const render = compile(getOuterHTML(el));
		this._el.innerHTML = '';
		Object.keys(options.data).forEach(key=>this._proxy(key));
		if(option.methods){
			Object.keys(option.methods).forEach(key=>{
				this[key] = option.method[key].bind(this);
			})
		}
		this._ob = observe(option.data);
		this._watcher = [];
		this._watcher = new Watcher(this,render,this_update);
		this._update(this._watcher.value);
	}
	_update(vtree){
		if(!this._tree){
			patch(this._el,vtree);
		}else{
			patch(this._tree,vtree);
		}
		this._tree = vtree;
	}
	
	_renderClass(dynamic,cls){
		dynamic = dynamic 
			? typeof dynamic === 'string'
				? dynamic
				: Object.keys(dynamic).filter(key=>dynamic[key].join(' '))
			:'';
		return cls 
				? cls + (dynamic ? ' ' + dynamic : '' )
				: dynamic;
	}
	
	__flatten_(arr){
		var res = [];
		for(var i =0; l = arr.length; i<l; i++){
			var e = arr[i];
			if(Array.isArray(e)){
				for(var j = 0, k = e.length; j < k; j++){
					if(e[j]){
						res.push(e[j]);
					}
				}
			}else if(e){
				res.push(e);
			}
		}
		return res;
	}
	
	_proxy(key){
		if(!isReserved(key)){
			var self = this;
			Object.defineProperty(self,key,{
				configurable:true,
				enumerable:true,
				get:function proxyGetter(){
					return self._data[key];
				},
				set:function proxySetter(){
					self._data[key] = val;
				}
			})
		}
	}
}

Component.prototype.__h = h;
Component.nextTick = nextTick;

