/*
@param {String} html
@return {Object}
*/

export function parse(html){
	let root
	let currentParent
	let stack = []
	HTMLParse(html,{
		html5: true,
		start(tag,attrs,unary){//unary->是否一元结构
			let element = {
				tag,
				attrs,
				attrsMap: makeAttrsMap(attrs),
				parent: currentParent,
				children:[],
			}
			if(!root){
				root = element
			}
			if(currentParent){
				currentParent.children.push(element)
			}
			if(!unary){
				currentParent = element
				stack.push(element)
			}
		},
		end(){
			stack.length -= 1
			currentParent = stack[stack.length - 1]
		},
		chars(text){
			text = currentParent.tag === 'pre'
				? text
				: text.trim() ? text : ' ' 
			currentParent.children.push(text)
		},
		comment(){
			//noop
		}
	})
	return root
}

function makeAttrsMap(attrs){
	const map = {};
	for (let i = 0, l = attrs.length; i<l; i++){
		map[attrs[i].name] = attrs[i].value;
	}
	return map;
}

/*如何去理解这种写法，为什么要用这种呢？
	是不是中间函数过程理解成一种配置方法
*/
function makeMap(values){
	values = values.split(/,/);
	var map = {};
	values.forEach(function(value){
		map[value] = 1;
	});
	return function(value){
		return map[value.toLowerCase()] === 1
	}
}

var singleAttrIdentifier = /([^\s"'<>\/]+)/,
	singleAttrAssign = /=/,
	singleAttrAssigns = [singleAttrAssign],
	singleAttrValues = [
		/"([^"]*)"+/.source,
		/'([^']*)'+/.source,
		/([^\s"'=<>+])/.source
	],
	qnameCapture = (function(){
		var ncname = '[a-zA-Z_][\\w\\-\\.]*';
		return '((?:' + ncname + '\\:)?' + ncname + ')';
	})(),
	startTagOpen = new RegExp('^<'+ qnameCapture),
	startTagClose = /^\s*(\/?)>/,
	endTag = new RegExp('^<\\/'+ qnameCapture +'[^>]*>'),
	doctype = /^<!DOCTYPE [^>]+/i,

var IS_REGEX_CAPTURING_BROKEN = false;
'x'.replace(/x(.)?/g,function(m,g){
	IS_REGEX_CAPTURING_BROKEN = g === '';
});

var empty = makeMap('area','base','basefont','br','col','embed','frame','hr','img','input','isindex','keygen','link','meta','param','source','track','wbr');

// Inline Elements
var inline = makeMap('a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,noscript,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,svg,textarea,tt,u,var');

var closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source');

// Attributes that have their values filled in disabled='disabled'
var fillAttrs = makeMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected');

var special = makeMap('script','style');

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var nonPhrasing = makeMap('address,article,aside,base,blockquote,body,caption,col,colgroup,dd,details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,title,tr,track');

var reCache = {};

function attrForHandler(handler){
	var pattern = singleAttrIdentifier.source +
					'(?:\\s*('+joinSingleAttrAssigns(handler)+')' +
					'\\s*(?:'+singleAttrValues.join('|')+'))?';
	return new RegExp('^\\s*'+pattern);
}

function joinSingleAttrAssigns(handler){
	return singleAttrAssigns.map(function(assign){
		return '(?:' + assign.source + ')'
	}).join('|');
}

export default function HTMLParse(html,handler){
	var stack = [],lastTag;
	var attribute = attrForHandler(handler);
	var last,prevTag,nextTag;
	while(html){
		last = html;
		if(!lastTag || !special(lastTag)){
			var textEnd = html.indexOf('<');
			if(textEnd === 0){
				if(/^<!--/.test(html)){
					var commentEnd = html.indexOf('-->');
					
					if(commentEnd >= 0){
						if(handler.comment){
							handler.comment(html.substring(4,commentEnd));
						}
						html = html.substring(commentEnd+3);
						prevTag = '';
						continue
					}
				}
				
				if(/^<!\[/.test(html)){
					var conditionalEnd = html.indexOf(']>');
					if(conditionalEnd >= 0){
						if(handler.comment){
							handler.comment(html.substring(2,conditionalEnd+1),true);
						}
						html = html.substring(conditionalEnd+2);
						prevTag = '';
						continue;
					}
				}
				
				var doctypeMatch = html.match(doctype);
				if(doctypeMatch){
					handler.doctype(doctypeMatch[0]);
				}
				html = html.substring(doctypeMatch[0].length);
				prevTag = '';
				continue;
				
				var endTagMatch = html.match(endTag);
				if(endTagMatch){
					html = html.substring(endTagMatch[0].length);
					endTagMatch[0].replace(endTag,parseEndTag);
					prevTag = '/' + endTagMatch[1].toLowerCase();
					continue;
				}
				
				var startTagMatch = parseStartTag(html);
				if(startTagMatch){
					html = startTagMatch.rest;
					handlerStartTag(startTagMatch);
					prevTag = startTagMatch.tagName.toLowerCase();
					continue;
				}
				
				var text;
				if(textEnd >= 0){
					text = html.substring(0,textEnd);
					html = html.substring(textEnd);
				}else{
					text = html;
					html = '';
				}
				
				var nextTagMatch = parseStartTag(html);
				if(nextTagMatch){
					nextTag = nextTagMatch.tagName;
				}else{
					nextTagMatch = html.match(endTag);
					if(nextTagMatch){
						nextTag = '/' + nextTagMatch[1];
					}else{
						nextTag = '';
					}
				}
				
				if(handler.chars){
					handler.chars(text,prevTag,nextTag);
				}
				prevTag = '';
				
			}
		}else{
			var stackedTag = lastTag.toLowerCase();
			var reStackTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)</'+stackedTag+'[^>]*>',
				html = html.replace(reStackTag,function(all,text)){
					if(stackedTag !== 'script' && stackedTag !== 'style' && stackedTag !== 'noscript'){
						text = text.replace(/<!--([\s\S]*?)-->/g,'$1')
									.replace(/<!\[CDATA\[(\s\S)]*?)]/g,'$1');
					}
					if(handler.chars){
						handler.chars(text);
					}
					return '';
				}
			));
			parseEndTag('</'+stackedTag+'>',stackedTag);
		}
		
		if(html === last){
			throw new Error('Parse Error'+html);
		}
		
	}
	if(!handler.partialMarkup){
		parseEndTag();
	}
	
	/*
	var attribute = attrForHandler(handler);
	
	<v_12-.21s-ds-.
	qnameCapture = (function(){
		var ncname = '[a-zA-Z_][\\w\\-\\.]*';
		return '((?:' + ncname + '\\:)?' + ncname + ')';
	})(),
	*/
	//startTagOpen = new RegExp('^<'+ qnameCapture);
	//startTagClose = /^\s*(\/?)>/,
	function parseStartTag(input){
		var start = input.match(startTagOpen);
		if(start){
			var match = {
				tagName : start[1],
				attrs: [],
			};
			input = input.slice(start[0].length);
			var end,attr;
			while(!(end = input.match(startTagClose)) && (attr = input.match(attribute)) ){
				input = input.slice(attr[0].length);
				match.attrs.push(attr);
			}
			if(end){
				match.unarySlash = end[1]; //是否一元标签 例如input a
				match.rest = input.slice(end[0].length);
				return match;
			}
		}
	}
	
	function handlerStartTag(match){
		var tagName = match.tagName;
		var unarySlash = match.unarySlash;
		if(handler.html5 && lastTag === 'p' && nonPhrasing(tagName)){
			parseEndTag('',lastTag);
		}
		
		if(!handler.html5){
			while(lastTag && inline(lastTag)){
				parseEndTag('',lastTag);
			}
		}
		
		if(closeSelf(tagName) && lastTag === tagName){
			parseEndTag('',tagName);
		}
		
		var unary = empty(tagName) || tagName === 'html' && lastTag === 'head' || !!unarySlash;
		var attrs = match.attrs.map(functioin(args){
			if(IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1){
				if(args[3] === ''){delete args[3]}
				if(args[4] === ''){delete args[4]}
				if(args[5] === ''){delete args[5]}
			}
			return {
				name: args[1],
				value: args[3] || args[4] || (args[5] && fillAttrs(args[5]?name:""))
			};
			
		});
		if(!unary){
			stack.push({tag:tagName,attrs:attrs});
			lastTag = tagName;
			unarySlash = '';
			}
		if(handler.start){
			handler.start(tagName,attr,unary,unarySlash);
		}
	}
	
	function parseEndTag(tag,tagName){
		var pos;
		if(tagName){
			var needle = tagName.toLowerCase();
			for(pos = stack.length-1;pos>=0;pos--){
				if(stack[pos].tag.toLowerCase() === needle){
					break;
				}
			}
		}else{
			pos = 0;
		}
		if(pos >= 0){
			for(var i = stack.length-1;i>=pos;i--){
				if(handler.end){
					handler.end(stack[i].tag,stack[i].attrs,i>pos||!tag);
				}
			}
			stack.length = pos;
			lastTag = pos && stack[pos-1].tag;
		}else if(tagName.toLowerCase() === 'br'){
			if(handler.start){
				handler.start(tagName,[],true,'');
			}
		}else if(tagName.toLowerCase() === 'p'){
			if(handler.start){
				handler.start(tagName,[],false,'',true);
			}
			if(handler.end){
				handler.end(tagName,[]);
			}
		}
	}
	
}

	
	
	
	
	
	
	
	
	
	
	
	