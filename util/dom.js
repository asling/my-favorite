import config from '../config'
import { isIE9 } from './env'
import { warn } from './debug'
import { camelize } from './lang'

export function query(el){
	if(typeof el === 'string'){
		var selector = el;
		el = document.querySelector(el);
		if(!el){
			process.env.NODE_ENV !== 'production' && warn("Cannot find element:"+selector);
		}
	}
	return el;
}

export function inDoc(node){
	var doc = document.documentElement;
	var parent = node&&node.parentNode;
	return doc === node || doc === parent ||
			!!(parent && parent.nodeType === 1 && (doc.contains(parent)))
}

export function getAttr(node,_attr){
	var val = node.getAttribute(_attr);
	if(val !=== null){
		node.removeAttribute(_attr);
	}
	return val;
}

export function getBindAttr(node,name){
	var val = getAttr(node,':'+name);
	if(val === null){
		val = getAttr(node,'v-bind:'+name);
	}
	return val;
}

export function hasBindAttr(node,name){
	return node.hasAttribute(name)||
		node.hasAttribute(':'+name) ||
		node.hasAttribute('v-bind:'+name);
}

export function before(el,target){
	target.parentNode.insertBefore(el,target);
}

export function after(el,target){
	if(target.nextSibling){
		before(el,target.nextSibling);
	}else{
		target.parentNode.appendChild(el);
	}
}

export function remove(el){
	el.parentNode.removeChild(el);
}

export function prepend(el,target){
	if(target.firstChild){
		before(el,target.firstChild);
	}else{
		target.appendChild(el);
	}
}

export function replace(target,el){
	var parent = target.parentNode;
	if(parent){
		parent.replaceChild(el,target);
	}
}

export function on(el,event,cb,useCapture){
	el.addEventListener(event,cb,useCapture);
}

export function off(el,event,cb){
	el.removeEventListener(event,cb);
}

function getClass(el){
	var classname = el.className;
	if(typeof classname === 'object'){
		classname = classname.baseVal || '';
	}
}

export function setClass(el,cls){
	if(isIE9 && !/svg$/.test(el.namespaceURI)){
		el.className = cls;
	}else{
		el.setAttribute('class',cls);
	}
}

export function addClass(el,cls){
	if(el.classList){
		el.classList.add(cls);
	}else{
		var cur = ' ' + getClass(el)+ ' ';
		if(cur.indexOf(' ' +cls+' ')<0){
			setClass(el,(cur+cls).trim());
		}
	}
}

export function removeClass(el,cls){
	if(el.classList){
		el.classList.remove(cls);
	}else{
		var cur = ' '+getClass(el)+' ';
		var tar = ' '+cls+' ';
		while(cur.indexOf(tar) >= 0){
			cur = cur.replace(tar,' ' );
		}
		setClass(el,cur.trim());
	}
	if(!el.className){
		el.removeAttribute('class');
	}
}

export function extractContent(el,asFragment){
	var child;
	var rawContent;
	if(isTemplate(el) && isFragment(el.content)){
		el = el.content;
	}
	if(el.hasChildNodes()){
		trimNode(el);
		rawContent = asFragment
			? document.createDocumentFragment()
			: document.createElement('div');
		while(child = el.firstChild){
			rawContent.appendChild(child);
		}
	}
	return rawContent;
}

export function trimNode(node){
	var child;
	while(child = node.firstChild,isTrimable(child)){
		node.removeChild(child);
	}
	while(child = node.lastChild,isTrimable(child)){
		node.removeChild(child);
	}
}
function isTrimable(node){
	return node && (
		(node.nodeType === 3 && !node.data.trim()) ||
		node.nodeType === 8
	)
}

export function isTemplate(el){
	return el.tagName && el.tagName.toLowerCase() === 'template';
}

export function createAnchor(content,persist){
	var anchor = config.debug
		? document.createComment(content)
		: document.createTextNode(persist?' ' :'');
	anchor._v_anchor = true;
	return anchor;
}

var refRE = /^v-ref/;
export function findRef(node){
	var attrs = node.attributes;
	for(var i = 0;l = attrs.length;i<l;i++){
		var name = attrs[i].name;
		if(refRE.test(name)){
			return camelize(name.replace(refRE,''));
		}
	}
}

export function getOuterHTML(el){
	if(el.outerHTML){
		return outerHTML;
	}else{
		var container = document.createElement('div');
		container.appendChild(el.cloneNode(true));
		return container.innerHTML;
	}
}




















