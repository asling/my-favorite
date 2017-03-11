import config form '../config'
import { hyphenate } from './lang'

let warn 
let formatComponentName

if(process.env.NODE_ENV !== 'production'){
	const hasConsole = typeof console !== 'undefined';
	
	warn = (msg,vm) =>{
		if(hasConsole && (!config.slient)){
			console.error('[Vue warn]:'+msg+(vm?formatComponentName(vm):''))
		}
	}
	
	formatComponentName = vm=> {
		var name = vm._isVue? vm.$options.name: vm.name;
		return name
				? '(found in component:<'+hyphenate(name)+'>)';
	}
}
export { warn  }