/* eslint-disable promise/always-return */
const functions = require('firebase-functions')
const { Nuxt } = require('nuxt')
const express = require('express')

const app = express()

const config = {
  dev: false
}

const nuxt = new Nuxt(config)

let isReady = false
const readyPromise = nuxt
  .ready()
  .then(() => {
    isReady = true
  })
  .catch(() => {
    process.exit(1)
  })

async function handleRequest (req, res) {
  if (!isReady) {
    await readyPromise
  }
  res.set('Cache-Control', 'public, max-age=86400, s-maxage=86400')
  await nuxt.render(req, res)
}
async function mypageHandleRequest (req, res) {
  if (!isReady) {
    await readyPromise
  }
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600')
  await nuxt.render(req, res)
}

app.get('/mypage', mypageHandleRequest)
app.get('*', handleRequest)
app.use(handleRequest)
exports.nuxtssr = functions.https.onRequest(app)
