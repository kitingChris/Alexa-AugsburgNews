'use strict';
const Alexa = require('alexa-sdk');
const handlers = require('handlers');
const resources = require('resources');


exports.handler = function(event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.appId = event.session.application.applicationId;
    alexa.resources = resources;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
