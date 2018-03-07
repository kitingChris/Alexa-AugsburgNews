'use strict';

const AugsburgRemote = require('../Remotes/AugsburgRemote');

const GetNewsListHandler = function () {
    console.log('GetNewsListHandler');
    const self = this;

    console.log('START GetNewsListHandler');

    const remote = new AugsburgRemote();

    remote.getLatestNews(
        function (newsList) {

            console.log(newsList);

            if (newsList.length > 0) {

                self.attributes['news'] = newsList;

                let speakMessage = self.t('NEWS_INTRO_MESSAGE').replace('%count%', newsList.length);
                let cardMessage = speakMessage;

                let prevDate;
                let num = 1;

                for (let key in newsList) {
                    if (newsList.hasOwnProperty(key)) {
                        const newsItem = newsList[key];

                        speakMessage += self.t('NEWS_ITEM_SPEECH')
                            .replace('%num%', self.t('ORDINAL_'+num))
                            .replace('%date%', newsItem.date !== prevDate ? newsItem.date : '')
                            .replace('%title%', newsItem.title);
                        cardMessage += '\n\n' + self.t('NEWS_ITEM_MESSAGE')
                            .replace('%date%', newsItem.date)
                            .replace('%title%', newsItem.title);

                        prevDate = newsItem.date;
                        num++;
                    }
                }

                speakMessage += self.t('ASK_FOR_DETAILS');

                self.response.speak(speakMessage + self.t(''));
                self.response.listen(self.t('ASK_FOR_DETAILS'));
                self.response.cardRenderer(self.t('NEWS_CARD_TITLE'), cardMessage);
                self.emit(':responseReady');

            } else {
                self.response.speak(self.t('NO_NEWS_MESSAGE'));
                self.response.cardRenderer(self.t('NEWS_CARD_TITLE'), self.t('NO_NEWS_MESSAGE'));
                self.emit(':responseReady');
            }
        },
        function (error) {
            console.error(error);
            self.response.speak(self.t('ERROR_MESSAGE'));
            self.emit(':responseReady');
        }
    );
};

module.exports = GetNewsListHandler;