'use strict';

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const cheerio = require('cheerio');

const DEFAULT_OPTIONS = {};
const DEFAULT_API_ENDPOINT = "http://www.augsburg.de/";

class AugsburgRemote {
    constructor(apiEndpoint, options) {

        this.apiEndpoint = apiEndpoint || DEFAULT_API_ENDPOINT;

        this.options = Object.assign(DEFAULT_OPTIONS, options || {});
    }

    getLatestNews(successHandler, errorHandler) {
        sendXMLHttpRequest({
            url: this.apiEndpoint,
            successHandler: function (responseHtml) {

                let news = [];

                try {
                    news = parseMainDocument(responseHtml);
                } catch (e) {
                    errorHandler(e);
                }
                successHandler(news);
            },
            errorHandler: errorHandler,
        });
    };

    getNewsDetail(url, successHandler, errorHandler) {
        sendXMLHttpRequest({
            url: this.apiEndpoint + url.replace(/^.*\/\/[^\/]+\//, ''),
            successHandler: function (responseHtml) {

                let details = {};

                try {
                    details = parseDetailDocument(responseHtml);
                } catch (e) {
                    errorHandler(e);
                }

                successHandler(details);
            },
            errorHandler: errorHandler,
        });
    };
}

module.exports = AugsburgRemote;

function sendXMLHttpRequest(options) {
    options.method = options.method || "GET";
    options.withCredentials = options.withCredentials || true;
    options.data = options.data || {};

    if (options.method === "GET" && Object.keys(options.data).length > 0) {
        options.url = options.url + '?' + Querystring.stringify(options.data);
    }

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = options.withCredentials;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 300) {
                options.successHandler(this.responseText);
            } else {
                options.errorHandler(this.responseText || this.statusText || 'Error: ' + this.status);
            }
        }
    });

    xhr.open(options.method, options.url);

    xhr.send();
}

function parseMainDocument(responseHtml) {

    const dom = cheerio.load(responseHtml)('html');

    const base = dom.find('base').attr('href');
    const newsItems = dom.find('.news-latest-container').find('.news-latest-item');

    const news = [];

    newsItems.each(function(i, elem) {
        const newsItem = cheerio(elem);

        const date = newsItem.find('.news-latest-date').text();
        const title = newsItem.find('a', '.news-latest-title').attr('title');
        const link = base + newsItem.find('a', '.news-latest-title').attr('href');

        news.push({
            date: date,
            title: title,
            link: link
        });
    });

    return news;
}

function parseDetailDocument(responseHtml) {

    const dom = cheerio.load(responseHtml)('html');

    const base = dom.find('base').attr('href');
    const newsItem = dom.find('.news-single-item');

    const title = newsItem.find('h1').text();
    const headline = newsItem.find('h2').text();
    const img = base + newsItem.find('img').attr('src') || null;

    let text = '';

    const paragraphs = newsItem.find('p');

    paragraphs.each(function(i, elem) {
        const paragraph = cheerio(elem);
        if (typeof paragraph.attr('class') === 'undefined') {
            text += paragraph.text() || '';
        }
    });

    return {
        title: title,
        headline: headline,
        text: text,
        img: img
    }
}