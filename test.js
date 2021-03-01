require("dotenv").config();

const moment = require("moment");

const AirtableClass = require("./src/airtable");

const MongoDB = require("./mongoDB/index");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

const updateCookie = async (client, cookie) => {
    try {
        const user = await MongoDB.getUser(client);
        await MongoDB.updateUserField(client, { cookie });
        await MongoDB.updateUserField(client, { cookieStatus: true });
        await AirtableClass.updateRecord(user.airtableRecordID, { "Cookie Status": "Active" });
        await AirtableClass.updateRecord(user.airtableRecordID, { Cookie: cookie });
    } catch (error) {
        console.log("ERROR UPDATING COOKIE ---", error);
    }
};

const newUser = {
    client: "Nick Peret",
    lastRun: "10/16/2020",
    cookie: "",
    cookieStatus: false,
    proxyUsername: "",
    proxyPassword: "",
    scriptMode: "Initial",
    httpRequestCount: 0,
    airtableRecordID: "recRzr2hFD9AqOTNs",
};

(async () => {
    try {
        // -------------- ADD NEW USER --------------
        await MongoDB.createUser(newUser);
        console.log("Done");
    } catch (error) {
        console.log(`UPDATE MONGO ERROR --- ${error}`);
    }
})();

const newConnections = [
    {
        name: "New Connection 1",
        profileUrl: "https://www.linkedin.com/",
    },
    {
        name: "New Connection 2",
        profileUrl: "https://www.linkedin.com/",
    },
];
