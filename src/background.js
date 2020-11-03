chrome.webRequest.onBeforeRequest.addListener(
    async () => {
        const series = await new Promise(resolve => {
            chrome.tabs.executeScript({
                code: 'document.querySelector(\'.tv-series-episode-list-item--selected\').getAttribute(\'href\')'
            }, results => resolve(results[0]));
        });
        console.log(series)

        return {
            redirectUrl: "http://localhost:3000/http://localhost:3001/ss"
        }
    },
    {urls: ["*://undertekst.nrk.no/*"]},
    ["blocking"]
);

chrome.webRequest.onBeforeSendHeaders.addListener(
    details => ({
        requestHeaders: {
            ...details.requestHeaders,
            'X-Requested-With': 'https://tv.nrk.no',
        }
    }),
    {urls: ["*://undertekst.nrk.no/*"]},
    ["blocking"]
);
