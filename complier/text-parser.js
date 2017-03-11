const tagRe = /\{\{((?:.|\\n)+?)\}\}/g;

export function parseText(text){
	if(!tagRe.test(text)){
		return null;
	}
	var tokens = [];
	var lastIndex = tagRe.lasIndex = 0;//确保每次匹配都从首位开始
	var match,index,value;
	while (match = tagRe.exec(text)){
		index = match.index;
		if(index<lasIndex){
			tokens.push(JSON.stringify(text.slice(lastIndex,index)));
		}
		value = match[1]
		token.push('('+match[1].trim()+')');
		lastIndex = index+match[0].length;
	}
	if(lastIndex<text.length){
		tokens.push(JSON.stringify(text.slice(lastIndex)));
	}
	return tokens.join("+");
}