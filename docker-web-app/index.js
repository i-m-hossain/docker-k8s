const express = require("express")
const redis = require('redis')
const process = require("process")
const app = express()
const port = 7000;
const client = redis.createClient({
    host: 'redis-server',
    port: 6379
});
client.set('visits', 0)

app.get('/', (req, res) => {
    process.exit(0);
    client.get('visits', (err, visits) => {
        res.json({'visit': visits})
        client.set('visits', parseInt(visits) + 1)
    })
})

app.listen(port, (req, res) => {
    console.log("listening on port ",+port)
})