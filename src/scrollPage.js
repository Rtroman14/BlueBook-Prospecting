const MongoDB = require("../mongoDB/index");

const { getAllContacts, scroll, checkForScrapedContact } = require("./helpers");

module.exports = async (page, user) => {
    try {
        const { client, scriptMode } = user;

        if (scriptMode === "Initial") {
            const newConnections = await page.evaluate(getAllContacts);

            // add 10 most recent connections
            for (let newConnection of newConnections.slice(-10)) {
                await MongoDB.addConnection(client, newConnection);
            }

            for (let contact of lastContacts.slice(-2)) {
                await MongoDB.addLastConnections(client, contact);
            }

            await MongoDB.updateUserField(client, { scriptMode: "Update" });

            return;
        }

        let previousHeight = 0;
        let currentHeight = await page.evaluate("document.scrollingElement.scrollHeight");
        let total = 0;

        let lastConnections = await MongoDB.getLastTwoConnections(client);

        while (previousHeight < currentHeight) {
            previousHeight = await page.evaluate("document.scrollingElement.scrollHeight");
            console.log("Scrolling...");
            total++;

            await scroll(page, previousHeight);

            // scroll step up to load contacts list
            if (total === 2) {
                await scroll(page, -850);
                await scroll(page, 850);
                await scroll(page, -250);
            }

            const newConnections = await checkForScrapedContact(page, lastConnections);

            if (newConnections) {
                console.log(`ADDING ${newConnections.length} NEW CONNECTIONS TO MONGODB`);

                for (let connection of newConnections.reverse()) {
                    await MongoDB.addConnection(client, connection);
                }

                for (let contact of newConnections.slice(-2)) {
                    await MongoDB.addLastConnections(client, contact);
                }

                return;
            }

            currentHeight = await page.evaluate("document.scrollingElement.scrollHeight");
        }
    } catch (error) {
        console.log(`SCROLLING ERROR --- ${error}`);
    }
};
