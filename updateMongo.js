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

(async () => {
    try {
        // -------------- UPDATE COOKIE --------------
        const cookies = await AirtableClass.getCookie();
        for (let user of cookies) {
            const { name, cookie } = user;
            await updateCookie(name, cookie);
            console.log(`Updated ${name}'s cookies`);
        }
    } catch (error) {
        console.log(`UPDATE MONGO ERROR --- ${error}`);
    }
})();
