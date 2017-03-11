var raf = (typeof window !== 'undefined' && window.requestAnimationFrame) || setTimeout;

var nextFrame = function(fn){
	raf(function(){
		raf(fn);
	})
}

function setNextFrame(obj,prop,val){
	nextFrame(function(){
		obj[prop] = val;
	})
}

function updateStyle(oldVnode,vnode){
	var cur,name,elm = vnode.elm;
	var oldStyle = oldVnode.data.style || {};
	var style = vnode.data.style || {};
	var oldHasDel = 'delayed' in oldStyle;
	for(name in oldStyle){
		if(!style[name]){
			elm.style[name] = '';
		}
	}
	for(name in style){
		cur = style[name];
		if(name === 'delayed'){
			for(name in style.delayed){
				cur = style.delayed[name];
				if(!oldHasDel || cur !== oldStyle.delayed[name]){
					setNextFrame(elm.style,name,cur);
				}
			}
		}else if(name !== 'remove' && cur !== oldStyle[name]){
			elm.style[name] = cur;
		}
	}
}

function applyDestoryStyle(vnode){
	var style,name,elm = vnode.elm,s = vnode.data.style;
	if(!s || !(style = s.destory)) return ;
	for(name in style){
		elm.style[name] = style[name];
	}
}

function applyRemoveStyle(vnode,rm){
	var s = vnode.data.style;
	if(!s || !s.remove){
		rm();
		return;
	}
	var name,elm = vnode.elm,idx,i = 0,maxDur = 0;
	var compStyle,style = s.remove,amount = 0, applied = [];
	for(name in style){
		applied.push(name);
		elm.style[name] = style[name];
	}
	comStyle = getComputedStyle(elm);
	var props = compStyle['transition-property'].split(', ');
	for(;i<props.length;++i){
		if(applied.indexOf(props[i]) !== -1) amount++;
	}
	elm.addEventListener('transitionend',function(ev){
		if(ev.target === elm) --amount;
		if(amount === ) rm();
	});
}

export default{
	create:updateStyle,
	update:updateStyle,
	destory:applyDestoryStyle,
	remove:applyRemoveStyle
}



























