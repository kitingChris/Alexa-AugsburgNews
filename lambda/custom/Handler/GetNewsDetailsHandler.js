'use strict';

const AugsburgRemote = require('../Remotes/AugsburgRemote');

const GetNewsDetailsHandler = function () {
    console.log('GetNewsDetailsHandler');
    const self = this;

    const remote = new AugsburgRemote();

    console.log(self.event.request.dialogState);
    console.log(self.event.request.intent.slots);
    console.log(self.attributes);

    if (self.event.request.dialogState === 'STARTED' || typeof self.attributes.news === 'undefined') {

        const newsNumber = resolutionValue(self.event.request.intent.slots.newsNumber.resolutions);
        const newsItem = self.attributes.news[newsNumber-1];

        if(typeof newsItem !== 'undefined') {

            remote.getNewsDetail(
                newsItem.link,
                function (newsDetail) {

                    console.log(newsDetail);

                    self.response.speak(
                        newsDetail.title + ' ' + newsDetail.headline + ' ' + newsDetail.text
                    );

                    if(newsDetail.img)
                    {
                        const imageUrl = newsDetail.img.replace("http://","https://");

                        self.response.cardRenderer(
                            newsDetail.title,
                            newsDetail.headline + '\n\n' + newsDetail.text,
                            {
                                smallImageUrl: imageUrl,
                                largeImageUrl: imageUrl
                            }
                        );
                    } else {
                        self.response.cardRenderer(
                            newsDetail.title,
                            newsDetail.headline + '\n\n' + newsDetail.text
                        );
                    }
                    self.emit(':responseReady');
                },
                function (error) {
                    console.error(error);
                    self.response.speak(self.t('ERROR_MESSAGE'));
                    self.emit(':responseReady');
                });

        } else {
            self.response.speak(self.t('NO_NEWS_DETAIL_MESSAGE'));
            self.emit(':responseReady');
        }

    } else {
        this.emit('GetNewsDetailsIntent');
    }

};

function resolutionValue(slotResolutions) {
    return slotResolutions.resolutionsPerAuthority[0].values[0].value.name || 1;
}

module.exports = GetNewsDetailsHandler;