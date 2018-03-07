'use strict';

const HelpHandler = function() {
    console.log('HelpHandler');
    this.response.speak(this.t('Help Message'));
    this.emit(':responseReady');
};

module.exports = HelpHandler;