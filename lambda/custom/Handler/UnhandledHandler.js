'use strict';

const UnhandledHandler = function() {
    console.log('UnhandledHandler');
    this.response.speak(this.t('UNHANDLED_MESSAGE'));
    this.emit(':responseReady');
};

module.exports = UnhandledHandler;