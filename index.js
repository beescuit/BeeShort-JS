const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const config = require('./config.json')

mongoose.connect(config.db, { useNewUrlParser: true })

const Url = mongoose.model('Url', {
    url: String,
    shorturl: String,
    iscustom: Boolean,
    clicks: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
})

app.set('view engine', 'ejs')
app.use(express.static('static'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('index', config)
})

app.post('/short', async (req, res) => {
    var shorturl = false
    var iscustom = false
    if (!req.body.url) return res.json({sucess: false, err: "No url provided"})
    if (!/http:\/\/|https:\/\//g.test(req.body.url)) return res.json({sucess: false, err: "Invalid url"})
    if (req.body.custom) {
        if (/[^a-zA-Z0-9]/g.test(req.body.custom)) return res.json({sucess: false, err: "Invalid custom url"})
        var existing = await Url.findOne( { shorturl: req.body.custom })
        if (existing) return res.json({sucess: false, err: "Custom url already taken"})
        shorturl = req.body.custom
        iscustom = true
    } else {
        shorturl = await generateURL()
    }
    const data = { url: req.body.url, shorturl, iscustom }
    new Url(data).save().then(() => {res.json({sucess: true, data})}).catch(() => {res.json({sucess: false, err: "Error saving to database."})})
})

function generateURL() {
    return new Promise(async (resolve, reject) => {
        var shorturl = Math.random().toString(36).substring(7)
        var existing = await Url.findOne( { shorturl })
        resolve(existing ? await generateURL() : shorturl)
    })
}

app.post('/status', async (req, res) => {
    if (req.body.list) {
        var list = JSON.parse(req.body.list)
        var result = await Promise.all(list.map(async item => {
            var dbentry = await Url.findOne({ shorturl: item.shorturl })
            item['clicks'] = dbentry ? dbentry.clicks : 0
            return item
        }))
        res.json(result)
    }
})

app.get('/:shorturl', async (req, res) => {
    var url = await Url.findOneAndUpdate( { shorturl: req.params.shorturl }, {$inc: { clicks:1 } } )
    res.redirect(url ? url.url : '/')
})

app.listen(config.port, () => { console.log(`Listening on port ${config.port}`) })