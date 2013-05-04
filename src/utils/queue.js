var ticks = [];
var queues = []
var doneCallback = [];

module.exports = {
    add: function(name, callback){
        queues[name]++ || (queues[name] = 1);

        return function(){
            ticks[name]++ || (ticks[name] = 1);
            callback.apply(this, arguments);

            if (ticks[name] == queues[name]) {
                doneCallback[name].call(this);
            }
        }
    },
    done: function(name, callback){
        doneCallback[name] = callback;
    }
}