const MongoClient = require('mongodb').MongoClient
const http = require('http')

const url = process.env['MONGODB_URL'] || `mongodb://mongo:27017/test`
const client = new MongoClient(url)

class Controller {
    constructor(db) {
        this.db = db
    }

    async handleRequest(req, res) {
        res.setHeader("Content-Type", "application/json; utf-8")
        
        const users = await this.findUsers()
        const body = JSON.stringify(users)

        res.write(body)
        res.end();
    }

    findUsers() {
        return this.db.collection('users').find({}).toArray()
    }
}

function startServer(db) {
    const controller = new Controller(db)
    http.createServer((req, res) => controller.handleRequest(req, res)).listen(8080); 
}

async function main() {
    await client.connect()
    const db = client.db()
    startServer(db)
}

main()


