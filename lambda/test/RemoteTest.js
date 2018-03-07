'use strict';

const AugsburgRemote = require('../custom/Remotes/AugsburgRemote');

const remote = new AugsburgRemote();

remote.getLatestNews(
    function (result) {
        console.log(result);

        remote.getNewsDetail(result[0].link,
            function (result) {
                console.log(result);
            },
            function (error) {
                console.error(error);
            }
        );
    },
    function (error) {
        console.error(error);
    }
);
