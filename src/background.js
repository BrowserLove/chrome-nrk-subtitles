const qs = require('qs');

chrome.tabs.query({}, tabs => {
    const seriesUri = tabs.filter(tab => tab.active)[0].url;

    chrome.webRequest.onBeforeRequest.addListener(
        () => {
            const seriesSplit = seriesUri.split('/');
            const query = {
                title: seriesSplit[4].replace('-', ' '),
                season: seriesSplit[6],
                episode: seriesSplit[8],
            };
            // // console.log('http://localhost:3000/http://localhost:3001/?' + qs.stringify(query));

            return {
                redirectUrl: 'http://localhost:3000/http://localhost:3001/?' + qs.stringify(query),
            }
        },
        {
            urls: ['*://undertekst.nrk.no/*']
        },
        ['blocking']
    );
});

chrome.webRequest.onBeforeSendHeaders.addListener(
    details => {
        details.requestHeaders['X-Requested-With'] = 'https://tv.nrk.no';
        return {
            requestHeaders: details.requestHeaders
        };
    },
    {
        urls: ['*://undertekst.nrk.no/*'],
    },
    ['blocking']
);
