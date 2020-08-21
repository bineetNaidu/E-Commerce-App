const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
const scrypt = util.promisify(crypto.scrypt);

class UserRepository {
    constructor(filename) {
        if (!filename)
            throw new Error("Creating a repository requires a filename");
        this.filename = filename;
        try {
            fs.accessSync(this.filename);
        } catch (error) {
            fs.writeFileSync(this.filename, "[]");
        }
    }

    async getAll() {
        // open the file call this.filename
        const contents = await fs.promises.readFile(this.filename, {
            encoding: "utf-8",
        });
        // // Read its contents
        // parse the contents
        const data = JSON.parse(contents);
        // Return the parsed data
        return data;
    }

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

    async writeAll(records) {
        await fs.promises.writeFile(
            this.filename,
            JSON.stringify(records, null, 2)
        );
    }

    randomId() {
        return crypto.randomBytes(4).toString("hex");
    }

    async getOne(id) {
        const records = await this.getAll();
        return records.find((record) => record.id === id);
    }

    async delete(id) {
        const records = await this.getAll();
        const filterRecords = records.filter((record) => record.id !== id);
        await this.writeAll(filterRecords);
    }

    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find((record) => record.id === id);
        if (!record) throw new Error(`Record with id ${id} not found`);
        // record === { email: "tes@mail.com" }
        // attrs === { password: "mypassword" }
        Object.assign(record, attrs);
        // record === { email: "tes@mail.com", password: "mypassword" }
        await this.writeAll(records);
    }

    async getOneBy(filters) {
        const records = await this.getAll();

        for (const record of records) {
            let found = true;
            for (const key in filters) {
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }
            if (found) return record;
        }
    }
}
module.exports = new UserRepository("users.json");
