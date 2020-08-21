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
}

const test = async () => {
    const repo = new UserRepository("users.json");
    const data = await repo.getAll();
    console.log(data);
};
test();