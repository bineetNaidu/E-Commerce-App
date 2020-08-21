const fs = require("fs");

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
}

const repo = new UserRepository("users.json");
