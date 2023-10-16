const express = require('express')
var morgan = require('morgan')
var fs = require('fs')
const app = express()
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'})
// setup the logger
app.use(morgan('combined', {stream: accessLogStream}))
const port = 5000;
app.get('/', (req,res)=>{
    res.json({
        "greet": 'hi thee'
    })
})
app.get('/get-data',(req,res)=>{
    res.json({
        "data":"hello data"
    })
})
app.listen(port, ()=>{
    console.log("server is running at port "+ port)
})