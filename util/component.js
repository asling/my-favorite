import { warn } from './debug'
import { resolveAsset } from './options'
import { getAttr, getBindAttr } from './dom'

export const commonTagRe = /^(div|p|span|img|a|b|i|br|ul|ol|li|h1|h2|h3|h4|h5|h6|code|pre|table|th|td|tr|form|label|input|select|option|nav|article|section|header|footer)$/i

export const reservedTagRE = /^(slot|partial|component)$/i

let isUnknownElement
if(process.env.NODE_ENV !== 'production'){
	isUnknownElement = function(el,tag){
		if(tag.indexOf('-') > -1){
			return (
				el.constructor === window.HTMLUnknownElement || el.constructor === window.HTMLElement
			)
		}else{
			return (
				/HTMLUnknownElement/.test(el.toString()) && !/^(data|time|rtc|rb)$/.test(tag)
			)
		}
	}
}

export function checkComponentAttr(el,options){
	var tag = el.tagName.toLowerCase();
	var hasAttrs = el.hasAttributes();
	if(!componentTagRE.test(tag) && !reservedTagRE.test(tag)){
		if(resolveAsset(options,'component',tag)){
			return {id:tag}
		}else{
			var is = hasAttrs && getIsBinding(el);
			if(is){
				return is;
			}else if (process.env.NODE_ENV !== 'production'){
				expectedTag = options._componentNameMap && options._componentNameMap[tag];
				if(expectedTag){
					warn( 'Unknow custom element :.....' );
				}else if(isUnknownElement(el,tag)){
					warn('dfsdfsdfs');
				}
			}
		}
	}else if (hasAttrs){
		return getIsBinding(el);
	}
}

function getIsBinding(el){
	var exp = getAttr(el,'is');
	if(exp != null){
		return {id :exp};
	}else{
		exp = getBindAttr(el,'is');
		if(exp != null){
			return {id:exp,dynamic:true}
		}
	}
}



























