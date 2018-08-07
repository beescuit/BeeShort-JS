const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('./config.json')
const mongoose = require('mongoose')
const async = require('async')

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
    if (req.body.url && /http:\/\/|https:\/\//g.test(req.body.url)) {
        if (!req.body.custom) {
            shorturl = await generateURL()
        } else {
            if (!/[^a-zA-Z0-9]/g.test(req.body.custom)) {
                var existing = await Url.findOne( { shorturl: req.body.custom })
                if (!existing) {
                    shorturl = req.body.custom
                    iscustom = true
                } else {
                    res.json({sucess: false, err: "Custom url already taken"})
                }
            } else {
                res.json({sucess: false, err: "Invalid custom url"})
            }
        }
        if (shorturl) {
            const data = { url: req.body.url, shorturl, iscustom }
            new Url(data).save().then(() => {res.json({sucess: true, data})}).catch(() => {res.json({sucess: false, err: "Error saving to database."})})
        }
    } else {
        res.json({sucess: false, err: "Invalid url"})
    }
})

async function generateURL() {
    return new Promise((resolve, reject) => {
        async.retry(async () => {
            var shorturl = Math.random().toString(36).substring(7)
            var existing = await Url.findOne( { shorturl })
            return existing ? false : shorturl
        }, (err, res) => {
            err ? reject(err) : resolve(err)
        })
    })
}

app.post('/status', (req, res) => {
    if (req.body.list) {
        var list = JSON.parse(req.body.list)
        async.map(list, (item, cback) => {
            Url.findOne( { shorturl: item.shorturl }, (err, dbentry) => {
                item['clicks'] = dbentry ? dbentry.clicks : 0
                cback(null, item)
            })
        }, (err, result) => {
            if (err) throw err
            res.json(result)
        })
    }
})

app.get('/:shorturl', (req, res) => {
    Url.findOneAndUpdate( { shorturl: req.params.shorturl }, {$inc: {clicks:1}}, (err, url) => {
        if (err) throw err
        res.redirect(url ? url.url : '/')
    });
})

app.listen(config.port, () => { console.log(`Listening on port ${config.port}`) })