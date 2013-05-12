'use strict';

var queue = require('../src/utils/queue.js');

exports.testSimpleQueue = function(test) {
    test.expect(1);

    queue.add('test1', function(){})();

    // test normal queue
    queue.done('test1', function(){
        test.ok(true);
        test.done();
    });
};

exports.testComplexeQueue = function(test) {
    var random = Math.random().toString(16).substring(2), timer;

    test.expect(3);

    queue.add('test2', function(){ return true; })();
    queue.add('test2', function(){ return 'test'; })();
    timer = queue.add('test2', function(){ return random; });

    //simulate long callback
    setTimeout(function(){
        timer();
    }, 5);

    // test queue with multiple elements
    queue.done('test2', function(firstElement, secondElement, thirdElement){
        test.ok(firstElement);
        test.equal(secondElement, 'test');
        test.equal(thirdElement, random);

        test.done();
    });
};

exports.testErrorQueue = function(test) {
    test.expect(1);

    queue.error('test3', function(){
        test.ok(true);
        test.done();
    });

    queue.add('test3', function(){ return false; })();
};