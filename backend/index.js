require('dotenv').config()
const { response } = require('express')
const express = require('express')
var qs = require('qs')
var axios = require('axios')

const app = express()
const port = 3000

const positionStackApiURL = 'http://api.positionstack.com/v1/forward'
app.get('/get/location', (req, res) => {
  
  res.header("Access-Control-Allow-Origin", "*")
  let query = req.query
  query.access_key = process.env.LOCATION_API_KEY
  let queryString = qs.stringify(query)
  axios.get(`${positionStackApiURL}?${queryString}`).then(response => {
    res.send(response.data)
  })

})


const openWeatherMapApiURL = 'https://api.openweathermap.org/data/2.5/forecast'
app.get('/get/weather', (req, res) => {
  
  res.header("Access-Control-Allow-Origin", "*")
  let query = req.query
  query.appid = process.env.WEATHER_API_KEY
  let queryString = qs.stringify(query)
  axios.get(`${openWeatherMapApiURL}?${queryString}`).then(response => {
    res.send(response.data)
  })

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})