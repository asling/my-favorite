/******
工具函数：
_toString,
toNumber,
makeMap,
remove$1,
isPrimitive,
cached,
bind$1,
toArray,
extend,
isObject,
isPlainObject,
toObject,
noop,
no,
genSataicKeys,
looseEqual,
looseIndexOf,

object config 里的函数:
isReserved,
def,
parsePath,
isNative,
nextTick,
proxyHandlers,
initProxy,
Dep,
resetSchedulerState,
flushSchedulerState,
queueWatcher,
Watcher,
traverse,
Observer,
protoAugment,
copyAugment,
observe,
defineReactive$$1,
set,
del,
dependArray,
initState,
initProps,
initData,
initComputed,
initMethods,
initWatch,
makeComputedGetter,
createWatcher,
stateMixin,
proxy

Object VNode的函数
emptyVNode
cloneVNode
cloneVNodes
mergeVNodeHook
updateListeners
arrInvoker
fnInvoker
normalizeChildren
createTextVNode
applyNs
getFirstComponentChild
initLifecycle

lifecycleMixin
	Object Vue 的函数
		_mount
		_update
		_updateFromParent
		$forceUpdate
		$destory
		callHook

createComponent
createFunctionalComponent
createComponentInstanceForVnode
init
prepatch
insert
destory$1
resolveAsyncComponent
extractProps
checkProp
mergeHooks
mergeHook$1
createElement
_createElement
initRender

rendrMixin
	Vue Object：
		_render
		_h = createElement
		_s = toString
		_n = toNumber
		_e = emptyVNode
		_q = looseEqual
		_i = looseIndexOf
		_m = renderStatic
		_f = resolveFilter
		_l = renderList
		_t = callback_function
		_b = bindProps
		_k = getKeyCodes

resolveSlots
initEvents
eventsMixin
	Vue Object:
		$on
		$once
		$off
		$emit

initMixin
	Vue Object:
		_init
	initInternalComponent
	resolveConstructorOptions

Vue$2
---- 调用
initMixin(Vue$2);
stateMixin(Vue$2);
eventsMixin(Vue$2);
lifecycleMixin(Vue$2);
renderMixin(Vue$2);
-----

warn
formatComponentName
formatLocation

mergeData

strats's function
	data
	watch
	props=methods=computed=af

mergeHook
mergeAssets
defaultStrat
normalizeComponents
normalizeProps
normalizeDirectives
mergeOptions
resolveAssets
validateProp
getPropDefaultValue
assertProp
assertType
getType
isBooleanType

util freeze

initUse
	Vue Object:
		use

initMixin$1
initExtend
	Vue Object:
		extend

initAssetRegisters

keepAlive object's function 
	created
	render
	destoryed

initGlobalAPI

isXlink
getXlinkProp
isFalsyAttrValue
getclassForVnode
mergeclassData
genClassFromData
concat
stringifyClass
isReservedTag
getTagNamespace
isUnknowElement
query
createElement$1
createElementNS
createTextNode
createComment
insertBefore
removeChild
appendChild
parentNode
nextSibling
tagName
setTextContene
childNodes
setAttribute

ref object's function
	create
	update
	destory

registerRef

VNode
	isUndef
	isDef
	sameVnode
	createKeyToOldIdx
	createPatchFunction
	emptyNodeAt
	createRmCb
	removeElement
	createElm
	createChildren
	isPatchable
	invokeCreateHooks
	initComponent
	setScope
	addVnodes
	invokeDestoryHook
	removeVnodes
	removeAndInvokeRemoveHook
	updateChildren
	patchVnode
	invokeInsertHook
	hydrate
	assertNodeMatch
	patch

directives object's function
	update = updateDirectives
	create = updateDirectives
	destory = unbindDirectives

normalizeDirectives$1
getRawDirName
callHook$1
updateAttrs
setAttr
updateClass
updateDOMListeners

events object's function
	create = update = updateDOMListeners

updateDOMProps

domProps object's function
	create = update = updateDOMProps

updateStyle

style object's function
	create = update = updateStyle

addClass
removeClass

nextFrame
addTransitionClass
removeTransitionClass
whenTransitionEnds
getTransitionInfo
getTimeout
toMs
enter
leave
performLeave
resolveTransition
once

transition object's function
	create
	remove

createPatchFunction

model object's function
	insert
	componentUpdated

setSelected
hasNoMatchingOption
getValue
onCompositionStart
onCompositionEnd
trigger
locateNode

show object's function
	bind
	update

platformDirectives object
	model = model
	show = show

getRealChild
extractTransitionData
placeholder
hasParentTransition

Transition object's function
	render

callPendingCbs
recordPosition
applyTranslation


******/