import { parse } from './html-parse'
import { genergate } from './codegen'

const cache = Object.create(null);

export function compile(html){
	html = html.trim();
	const hit = cache[html]
	return hit || (cache[html]) = generate(parse(html));
}