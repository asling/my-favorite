import config from '../config'
import {warn,nextTick,devtools} from '../util/index'

var queueIndex;
var queue = [];
var userQueue = [];
var has = {};
var circular = {};
var waiting = false;
var internalQueueDepleted = false;

function resetBatcherState(){
	queue = [];
	userQueue = [];
	has = {};
	circular = {};
	waiting = internalQueueDepleted = false;
}

function flushBatcherQueue(){
	runBatcherQueue(queue);
	internalQueueDepleted = true;
	runBatcherQueue(userQueue);
	resetBatcherState();
}

function runBatcherQueue(queue){
	for(queueIndex=0;queueIndex<queue.length;queueIndex++){
		var watcher = queue[queueIndex];
		var id = watcher.id;
		has[id] = null;
		watcher.run();
		if(process.env.NODE_ENV !== 'production' && has[id] != null){
			circular[id]= (circular[id] || 0) +1;
			if(circular[id] > config._maxUpdateCount){
				warn('balabalabala',watcher.vm);
				break;
			}
		}
	}
}


/**
+ * Push a watcher into the watcher queue.
+ * Jobs with duplicate IDs will be skipped unless it's
+ * pushed when the queue is being flushed.
+ *
+ * @param {Watcher} watcher
+ *   properties:
+ *   - {Number} id
+ *   - {Function} run
+ */
export function pushWatcher(watcher){
	var id = watcher.id;
	if(has[id] == null){
		if(internalQueueDepleted && !watcher.user){
			userQueue.splice(queueIndex+1,0,watcher);
		}
	}else{
		var q =watcher.user?userQueue:queue;
		has[id] = q.length;
		q.push(watcher);
		if(!waiting){
			waiting = true;
			nextTick(flushBatcherQueue);
		}
	}
}















