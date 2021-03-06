'use strict';

describe('createTaskWithTimeout', function() {
    it('resolves when promise resolves', function() {
        var task = function() {
            return Promise.resolve('hi!');
        };
        var taskWithTimeout = textsecure.createTaskWithTimeout(task);

        return taskWithTimeout().then(function(result) {
            assert.strictEqual(result, 'hi!')
        });
    });
    it('flows error from promise back', function() {
        var error = new Error('original');
        var task = function() {
            return Promise.reject(error);
        };
        var taskWithTimeout = textsecure.createTaskWithTimeout(task);

        return taskWithTimeout().catch(function(flowedError) {
            assert.strictEqual(error, flowedError);
        });
    });
    it('rejects if promise takes too long', function() {
        var error = new Error('original');
        var complete = false;
        var task = function() {
            return new Promise(function(resolve) {
                setTimeout(function() {
                    completed = true;
                    resolve();
                }, 3000);
            });
        };
        var taskWithTimeout = textsecure.createTaskWithTimeout(task, this.name, {
            timeout: 10
        });

        return taskWithTimeout().then(function() {
            throw new Error('it was not supposed to resolve!');
        }, function() {
            assert.strictEqual(complete, false);
        });
    });
    it('resolves if task returns something falsey', function() {
        var task = function() {};
        var taskWithTimeout = textsecure.createTaskWithTimeout(task);
        return taskWithTimeout();
    });
    it('resolves if task returns a non-promise', function() {
        var task = function() {
            return 'hi!';
        };
        var taskWithTimeout = textsecure.createTaskWithTimeout(task);
        return taskWithTimeout().then(function(result) {
            assert.strictEqual(result, 'hi!')
        });
    });
});
