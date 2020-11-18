const qs = require('qs');

(() => {
    let seriesUri = null;

    const getSubtitleRedirectListener = () => {
        console.log(seriesUri);
        const seriesSplit = seriesUri.split('/');
        const query = {
            lang: 'en',
            title: seriesSplit[4].replace('-', ' '),
            season: seriesSplit[6],
            episode: seriesSplit[8],
        };
        // // console.log('http://localhost:3000/http://localhost:3001/?' + qs.stringify(query));

        return {
            redirectUrl: 'http://localhost:3000/http://localhost:3001/?' + qs.stringify(query),
        }
    };

    chrome.tabs.query({
        url: '*://tv.nrk.no/*',
    }, tabs => {
        seriesUri = tabs[0].url;
        chrome.webRequest.onBeforeRequest.addListener(
            getSubtitleRedirectListener,
            {
                urls: ['*://undertekst.nrk.no/*']
            },
            ['blocking']
        );

        chrome.tabs.onUpdated.addListener((tabId, {url}) =>  {
            if (tabs[0].id === tabId && url) {
                chrome.webRequest.onBeforeRequest.removeListener(getSubtitleRedirectListener);

                seriesUri = url;
                chrome.webRequest.onBeforeRequest.addListener(
                    getSubtitleRedirectListener,
                    {
                        urls: ['*://undertekst.nrk.no/*']
                    },
                    ['blocking']
                )
            }
        });
    });

    chrome.webRequest.onBeforeSendHeaders.addListener(
        details => {
            if (details.requestHeaders !== undefined) {
                details.requestHeaders['X-Requested-With'] = 'https://tv.nrk.no';
                return {
                    requestHeaders: details.requestHeaders
                };
            }
        },
        {
            urls: ['*://undertekst.nrk.no/*'],
        },
        ['blocking']
    );

    console.log('Started')
})();