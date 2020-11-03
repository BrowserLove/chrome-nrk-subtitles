chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        return {redirectUrl: "http://localhost:3000/http://localhost:3001/ss"};
    },
    {urls: ["*://undertekst.nrk.no/*"]},
    ["blocking"]
);

chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        return {
            requestHeaders: {
                ...details.requestHeaders,
                'X-Requested-With': 'https://tv.nrk.no',
            }
        };
    },
    {urls: ["*://undertekst.nrk.no/*"]},
    ["blocking"]
);
