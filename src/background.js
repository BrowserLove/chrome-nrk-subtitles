const qs = require('qs');

chrome.webRequest.onBeforeRequest.addListener(
    async () => {
        const seriesUri = await new Promise((resolve, reject) => {
            chrome.tabs.executeScript({
                code: 'document.querySelector(\'.tv-series-episode-list-item--selected\').getAttribute(\'href\');'
            }, results => results !== undefined ? resolve(results[0]) : reject('Failed to fetch series URI.'));
        });
        const seriesSplit = seriesUri.split('/');
        const query = {
            title: seriesSplit[2].replace('-', ' '),
            season: seriesSplit[4],
            episode: seriesSplit[6],
        };
        // console.log('http://localhost:3000/http://localhost:3001/?' + qs.stringify(query));

        return {
            redirectUrl: 'http://localhost:3000/http://localhost:3001/?' + qs.stringify(query),
        }
    },
    {
        urls: ['*://undertekst.nrk.no/*']
    },
    ['blocking']
);

chrome.webRequest.onBeforeSendHeaders.addListener(
    details => {
        details.requestHeaders['X-Requested-With'] = 'https://tv.nrk.no';
        return {
            requestHeaders: details.requestHeaders
        };
    },
    {
        urls: ['*://undertekst.nrk.no/*']
    },
    ['blocking', 'requestHeaders', 'extraHeaders']
);
