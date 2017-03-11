var booleanAttrs = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "compact", "controls", "declare","default", "defaultchecked", "defaultmuted", "defaultselected", "defer", "disabled", "draggable","enabled", "formnovalidate", "hidden", "indeterminate", "inert", "ismap", "itemscope", "loop", "multiple","muted", "nohref", "noresize", "noshade", "novalidate", "nowrap", "open", "pauseonexit", "readonly","required", "reversed", "scoped", "seamless","selected", "sortable", "spellcheck", "translate","truespeed", "typemustmatch", "visible"];

var booleanAttsDict = {};
for(var i =0,len = booleanAttrs.length;i<len;i++){
	booleanAttsDict[booleanAttrs[i]] = true;
}

function updateAttrs(oldVnode,vnode){
	var key,cur,old,elm = vnode.elm;
	var oldAttrs = oldVnode.data.attrs || {};
	var attrs = vnode.data.attrs || {};
	for(key in attrs){
		cur = attrs[key];
		old = oldAttrs[key];
		if(old !== cur){
			if(!cur && booleanAttsDict[key]){
				elm.removeAttribute(key);
			}else{
				elm.setAttribute(key,cur);
			}
		}
	}
	for(key in oldAttrs){
			
		}
}

