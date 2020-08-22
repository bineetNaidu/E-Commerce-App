const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
const scrypt = util.promisify(crypto.scrypt);
const Repository = require("./repository");

class UserRepository extends Repository {
    async create(attrs) {
        // load the file first
        attrs.id = this.randomId();

        const salt = crypto.randomBytes(8).toString("hex");
        const hashed = await scrypt(attrs.password, salt, 64);

        const records = await this.getAll();
        const record = {
            ...attrs,
            password: `${hashed.toString("hex")}.${salt}`,
        };
        records.push(record);
        // write the updated arrays
        await this.writeAll(records);
        return record;
    }

    async comparePassword(savedPWD, givenPWD) {
        const [hashed, salt] = savedPWD.split(".");
        const hashedgivenPWD = await scrypt(givenPWD, salt, 64); //this always return buffer

        return hashed === hashedgivenPWD.toString("hex");
    }
}
module.exports = new UserRepository("users.json");
