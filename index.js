import dotenv from 'dotenv'
import express from 'express'
import Urls from './Url.js'
import connect from './db.js'
import compression from 'compression'
import helmet from 'helmet'
import path from 'path'
import { fileURLToPath } from 'url'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
connect()

app.use(compression())
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'ssl.gstatic.com'],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
)

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 3000
app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
  const urls = await Urls.find({})
  res.render('index', { urls })
})

app.get('/:shortenedLink', async (req, res) => {
  const { shortenedLink } = req.params
  const shortUrl = await Urls.findOne({ shortenedLink })

  if (shortUrl === null) return res.redirect('/')

  res.redirect(shortUrl.fullUrl)
})

app.post('/url/new', async (req, res) => {
  try {
    const { fullUrl } = req.body
    const createdUrl = await Urls.create({ fullUrl })

    res.render('showLink', { link: createdUrl.shortenedLink })
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`)
})
