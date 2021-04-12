module.exports = async (page, linkedinAccount) => {
    try {
        const { proxyUsername, proxyPassword, cookie } = linkedinAccount;

        await page.authenticate({
            username: "lum-customer-c_97c7611f-zone-static_res-ip-154.17.60.190",
            password: "syaj3svugg2e",
        });

        await page.setViewport({ width: 1366, height: 768 });

        await page.setRequestInterception(true);

        // robot detection incognito - console.log(navigator.userAgent);
        page.setUserAgent(
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36"
        );

        page.on("request", (request) => {
            if (request.resourceType() === "image") {
                request.abort();
            } else {
                request.continue();
            }
        });

        // authenticate user
        await page.setCookie({ name: "li_at", value: cookie, domain: "www.linkedin.com" });
    } catch (error) {
        console.log(`BROWSER CONFIGURATION ERROR --- ${error}`);
    }
};
