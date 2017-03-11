export default {
	debug: false,
	silent: false,
	async:true,
	warnExpressionErrors:true,
	devtools:process.env.NODE_ENV !== 'production',
	_delimitersChanged:true,
	_assetTypes:[
		'component',
		'directive',
		'elementDirective',
		'filter',
		'transition',
		'partial'
	]
}