import VNode from './vnode'
import * as dom from './dom'
import { isPrimitive } from '../util/index'

const emptyNode = VNode('',{},[],undefined,undefined);
const hooks = ['create','update','remove','destory','per','post'];

function inUndef(s){
	return s === undefined;
}

function isDef(s){
	return s !== undefined;
}

function sameVnode(vnode1,vnode2){
	return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}

function createKeyToOldIdx(children,beginIdx,endIdx){
	var i,map = {},key;
	for(i = beginIdx;i<=endIdx;++i){
		key = children[i].key;
		if(isDef(key)) map[key] = i;
	}
	return map;
}

export default function createPatchFucntion(modules,api){
	var i ,j,cbs = {};
	if(isUndef(api)) api = dom;
	for(i=0;i<hooks.length;++i){
		cbs[hooks[i]] = [];
		for(j =0;j<modules.length;++j){
			if(modules[j][hooks[i]] !== undefined){
				cbs[hooks[i]].push(modules[j][hooks[i]]);
			}
		}
	}
}

function emptyNodeAt(){
	return VNode(api.tagName(elm).toLowerCase(),{},[],undefined,elm);
}

function createElm(vnode,insertedVnodeQueue){
	var i, thunk, data = vnode.data;
	if(isDef(data)){
		if(isDef(i=data.hook) && isDef(i = i.init)) i(vnode);
		if(isDef(i=data.vnode)){
			thunk = vnode;
			vnode = i;
		}
	}
	var elm,children = vnode.children,tag=vnode.sel;
	if(isDef(tag)){
		elm = vnode.elm = isDef(data) && isDef(i=data.ns)? api.createElementNs(i,tag):api.createElement(tag);
		if(Array.isArray(children)){
			for(i=0;i<children.length;++i){
				api.appendChild(elm,createElm(children[i],insertedVnodeQueue))
			}
		}else if(isPrimitive(vnode.text)){
			api.appendChild(elm,api.creatTextNode(vnode.text));
		}
		for(var i = 0;i<cbs.create.length;++i){
			cbs.create[i](emptyNode,vnode);
		}
		i = vnode.data.hook;
		if(isDef(i)){
			if(i.create) i.create(emptyNode,vnode);
			if(i.insert) insertedVnodeQueue.push(vnode);
		}
	}else{
		elm = vnode.elm = api.createTextNode(vnode.text);
	}
	if(isDef(thunk)) thunk.elm = vnode.elm;
	return vnode.elm;
}

function createRmCb(childElm,listeners){
	return function(){
		if(--listeners === 0){
			var parent = api.parentNode(childElm);
			api.removeChild(parent,childElm);
		}
	}
}

function invokeDestoryHook(vnode){
	var i, j, data = vnode.data;
	if(isDef(data)){
		if(isDef(i = data.hook) && isDef(i=i.destory)) i(vnode);
		for(i=0;i<cbs.destory.length;++i) cbs.destory[i](vnode);
		if(isDef(i = vnode.children)){
			for(j=0;j<vnode.children.length;++j){
				invokeDestoryHook(vnode.children[j]);
			}
		}
		if(isDef(i=data.vnode)) invokeDestoryHook(i);
	}
}

function removeVnodes(parentElm,vnodes,startIdx,endIdx){
	for(;startIdx<endIdx;++startIdx){
		var i,listeners,rm,ch=vnodes[startIdx];
		if(isDef(ch)){
			if(isDef(ch.sel)){
				invokeDestoryHook(ch);
				listeners = cbs.remove.length+1;
				rm = createRmCb(ch.elm,listeners);
				for(i=0;i<cbs.remove.length;++i){
					cbs.remove[i](ch,rm);
				}
				if(isDef(i=ch.data) && isDef(i=i.hook) && isDef(i=i.remove)){
					i(ch,rm);
				}else{
					rm();
				}
			}else{
				api.removeChild(parentElm,ch.elm);
			}
		}
	}
}

function updateChildren(parentElm,oldCh,newCh,insertedVnodeQueue){
	var oldStartIdx = 0,newStartIdx = 0;
	var oldEndIdx = oldCh.length - 1;
	var oldStartVnode = oldCh[0];
	var oldEndVnode = oldCh[oldEndIdx];
	var newEndIdx = newCh.length-1;
	var newStartVnode = newCh[0];
	var newEndVnode = newCh[newEndIdx];
	var oldKeyToIdx,idxInOld,elmToMove,before;
	while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx){
		if(isUndef(oldStartVnode)){
			oldStartVnode = oldCh[++oldStartIdx];
		}else if(isUndef(oldEndVnode)){
			oldEndVnode = oldCh[--oldEndIdx];
		}else if(sameVnode(oldStartVnode,newStartVnode)){
			patchVnode(oldStartVnode,newStartVnode,insertedVnodeQueue);
			oldStartVnode = oldCh[++oldStartIdx];
			newStartVnode = newCh[++newStartIdx];
		}else if(sameVnode(oldEndVnode,newEndVnode)){
			patchVnode(oldEndVnode,newEndVnode,insertedVnodeQueue);
			oldEndVnode = oldCh[--oldEndIdx];
			newEndVnode = newCh[++newEndIdx];
		}
	}
}





















