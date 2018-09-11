require('dotenv').config()

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

mongoose.connect(process.env.DBURI, { useNewUrlParser: true })

const Url = mongoose.model('Url', {
  url: String,
  shorturl: String,
  iscustom: Boolean,
  clicks: { type: Number, default: 0 },
  date: {
    type: Date,
    default: Date.now
  }
})

app.set('view engine', 'ejs')
app.use(express.static('web/dist'))
app.use(bodyParser.json())

app.post('/short', async (req, res) => {
  let shorturl = false
  let iscustom = false
  if (!req.body.url) return res.json({ sucess: false, err: 'No url provided' })
  if (!/http:\/\/|https:\/\//g.test(req.body.url)) return res.json({ sucess: false, err: 'Invalid url' })
  if (req.body.custom) {
    if (/[^a-zA-Z0-9]/g.test(req.body.custom)) return res.json({ sucess: false, err: 'Invalid custom url' })
    let existing = await Url.findOne({ shorturl: req.body.custom })
    if (existing) return res.json({ sucess: false, err: 'Custom url already taken' })
    shorturl = req.body.custom
    iscustom = true
  } else {
    shorturl = await generateURL()
  }
  const data = { url: req.body.url, shorturl, iscustom }
  new Url(data).save().then(() => { res.json({ sucess: true, data }) }).catch(() => { res.json({ sucess: false, err: 'Error saving to database.' }) })
})

function generateURL () {
  return new Promise(async (resolve, reject) => {
    let shorturl = Math.random().toString(36).substring(7)
    let existing = await Url.findOne({ shorturl })
    resolve(existing ? await generateURL() : shorturl)
  })
}

app.post('/status', async (req, res) => {
  if (req.body.list) {
    let list = req.body.list
    let result = await Promise.all(list.map(async item => {
      let dbentry = await Url.findOne({ shorturl: item.short })
      item['clicks'] = dbentry ? dbentry.clicks : 0
      return item
    }))
    res.json(result)
  }
})

app.get('/:shorturl', async (req, res) => {
  let url = await Url.findOneAndUpdate({ shorturl: req.params.shorturl }, { $inc: { clicks: 1 } })
  res.redirect(url ? url.url : '/')
})

app.listen(process.env.PORT, () => { console.log(`Listening on port ${process.env.PORT}`) })
