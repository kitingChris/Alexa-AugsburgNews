'use strict';

const LaunchRequestHandler = function() {
    console.log('LaunchRequestHandler');
    this.emit('GetNewsListIntent');
};

module.exports = LaunchRequestHandler;