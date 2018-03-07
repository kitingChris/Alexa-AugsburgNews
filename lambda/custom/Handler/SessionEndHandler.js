'use strict';

const SessionEndHandler = function() {
    console.log('SessionEndHandler');
    this.response.speak(this.t('SESSION_END_MESSAGE'));
    this.emit(':responseReady');
};

module.exports = SessionEndHandler;