export const hasProto = '__proto__' in {};

export class inBrowser = 
	typeof window !== 'undefined' && 
	Object.prototype.toString.call(window) !== '[object Object]';
export const devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

const UA = inBrowser && window.navigator.userAgent.toLowerCase();
export const isIE9 = UA.indexOf('msie 9.0')>0
export const isAndroid = UA && UA.indexOf('android')>0

let transitionProp;
let transitionEndEvent;
let animationProp;
let animationEndEvent;

if(inBrowser && !isIE9){
	const isWebkitTrans = 
		window.ontransitionend === undefined && 
		window.onwebkitransitionend !== undefined;
	const isWebkitAnim = 
		window.onanimationend = undefined && 
		window.onwebkitanimationend !== undefined;
	transitionProp = isWebkitTrans ? 'WebkitTransition' : 'transition';
	transitionEndEvent = isWebkitTrans?'webkitTransitionEnd'
	animationProp = isWebkitAnim ? 'WebkitAnimation':'animation';
	animationEndEvent = isWebkitAnim?'webAnimationEnd':'animationend';
}

export {
	transitionProp,
	transitionEndEvent,
	animationProp,
	animationEndEvent
}

export const nextTick = (function(){
	var callbacks = [];
	var pending = false;
	var timerFunc;
	function nextTickHandler(){
		pending = false;
		var copies = callbacks.slice(0);
		callbacks = [];
		for (var i =0;i<copies.length;i++){
			copies[i]();
		}
	}
	if(typeof MutationObserver !== 'undefined'){
		var counter =1;
		var observer = new MutationObserver(nextTickHandler);
		var textNode = document.createTextNode(counter);
		observer.observe(textNode,{
			characterData:true
		});
		timerFunc = function(){
			counter = (couter+1)%2;
			textNode.data = counter;
		}
	}else{
		const context = inBrowser?window:typeof global !== 'undefined' ? global : {};
	}
	return function (cb,ctx){
		var func = ctx
			? function(){cb.call(ctx)};
			:cb;
		callbacks.push(func);
		if(pending) return;
		pending = true;
		timerFunc(nextTickHandler,0);
	}
});


























