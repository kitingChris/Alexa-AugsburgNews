'use strict';

const LaunchRequestHandler = require('Handler/LaunchRequestHandler');
const GetNewsListHandler = require('Handler/GetNewsListHandler');
const GetNewsDetailsHandler = require('Handler/GetNewsDetailsHandler');
const SessionEndHandler = require('Handler/SessionEndHandler');
const UnhandledHandler = require('Handler/UnhandledHandler');
const HelpHandler = require('Handler/HelpHandler');

const handlers = {
    'LaunchRequest': LaunchRequestHandler,
    'GetNewsListIntent': GetNewsListHandler,
    'GetNewsDetailsIntent': GetNewsDetailsHandler,
    'AMAZON.StopIntent': SessionEndHandler,
    'AMAZON.CancelIntent': SessionEndHandler,
    'AMAZON.HelpIntent': HelpHandler,
    'Unhandled': UnhandledHandler,
    'SessionEndedRequest': function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
    }
};
console.log(handlers);

module.exports = handlers;