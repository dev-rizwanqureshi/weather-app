<template>

  <div class="container-fluid">
    <h2 class="text-center">The Weather App</h2>
    <div class="search-box">
      <input type="text" class="form-control" placeholder="Search Location" v-model="search" @keyup="onSearch()">
      <ul v-if="this.locations.length > 0" class="list-group" >
        <li v-for="single in this.locations" :key="single" @click="onGetWeather(single)" class="list-group-item">{{ single.name }} From {{ single.region}}</li>
      </ul>
      <ul class="list-group" v-else-if="noLocationFound">
        <li class="list-group-item">No Location Found</li>
      </ul>

    </div>

    <div class="row mt-3">
      <div class="col-12 col-lg-6">

        <div class="bg-danger p-2">
          <h5 class="text-center">Today's Forecast <template v-if="selectedLocation">for {{ selectedLocation.name }}</template></h5>
          <div class="row mt-2">
            <div class="col-12" v-if="Object.keys(todayWeather).length > 0">
              <template v-if="todayWeather.main">
                <span class="d-block"><strong>Now</strong> : {{ todayWeather.main.temp }}°C</span>
                <span class="d-block"><strong>Maximum</strong> : {{ todayWeather.main.temp_max }}°C</span>
                <span class="d-block"><strong>Minimum</strong> : {{ todayWeather.main.temp_min }}°C</span>
              </template>
              <template v-if="todayWeather.weather.length > 0">
                <strong>Weather Conditions</strong>
                <span class="d-block" v-for="single in todayWeather.weather" :key="single">{{ single.description }}</span>
              </template>
            </div>
            <div v-else>
              <h6 class="text-center">No data available</h6>
            </div>
          </div>
        </div>

        <div class="bg-danger mt-2 p-2">
          <h5 class="text-center">Weekly Forecast <template v-if="selectedLocation">for {{ selectedLocation.name }}</template></h5>
          <div class="row mt-2">
            <template v-if="fiveDayForecastArray.length > 0">
              <div class="col-6 col-sm-4 col-lg-3" v-for="single in fiveDayForecastArray" :key="single">
                <div class="weather-card">
                  <template v-if="single.main">
                    <span class="d-block"><strong>Maximum</strong> : {{ single.main.temp_max }}°C</span>
                    <span class="d-block"><strong>Minimum</strong> : {{ single.main.temp_min }}°C</span>
                  </template>
                  <template v-if="single.weather.length > 0">
                    <strong>Weather single</strong>
                    <span class="d-block" v-for="single_w in single.weather" :key="single_w">{{ single_w.description }}</span>
                  </template>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="col-12">
                <h6 class="text-center">No data available</h6>
              </div>
            </template>

          </div>
        </div>

      </div>
      <div class="col-12 col-lg-6 mt-2">

        <div class="row">

          <div class="col-4 text-center">
            <button class="btn btn-warning">Clouds</button>
          </div>
          <div class="col-4 text-center">
            <button class="btn btn-warning">Precipitation</button>
          </div>
          <div class="col-4 text-center">
            <button class="btn btn-warning">Temp.</button>
          </div>
          <div class="col-12">
            <div class="weather-map"></div>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <h5>Temperature Converter</h5>

            <div class="row">
              <div class="col-5">
                <input type="number" placeholder="Celsius" v-model.number="celsius" @keyup="onChangeTemperature(1)">
              </div>

              <div class="col-2">
                <img class="arrow-icon" src="https://www.clipartmax.com/png/full/52-527143_arrow-clipart-transparent-background-right-arrow-icon.png">
              </div>

              <div class="col-5">
                <input type="number" placeholder="Fahrenheit" v-model.number="fahrenheit" @keyup="onChangeTemperature(0)">
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>

import axios from 'axios'
export default {
  name: 'HomeView',
  data () {
    return {
      search: '',
      latitude: '',
      longitude: '',
      locations: [],
      selectedLocation: {},
      noLocationFound: false,
      todayWeather: {},
      weatherArray: [],
      fiveDayForecastArray: [],
      errors: [],
      celsius: 0,
      fahrenheit: 32,
      awaitingTimer: null
    }
  },
  methods: {
    onChangeTemperature (isCelsius = 1) {
      if (isCelsius === 1) {
        this.fahrenheit = ((this.celsius * 9 / 5) + 32).toFixed(2)
      } else {
        this.celsius = ((this.fahrenheit - 32) * 5 / 9).toFixed(2)
      }
    },
    onSearch () {
      if (this.search) {
        if (this.awaitingTimer) {
          clearTimeout(this.awaitingTimer)
          this.awaitingTimer = null
        }
        this.awaitingTimer = setTimeout(() => {
          this.onGetLocation()
        }, 3000)
      } else {
        this.latitude = ''
        this.longitude = ''
        this.locations = []
      }
    },
    onGetLocation () {
      axios.get('http://api.positionstack.com/v1/forward?access_key=6507a9bcf2efe0715e34539c6c7bdb02&query=' + this.search)
        .then(response => {
          console.log(response.data.data)
          if (response.data.data.length > 0) {
            this.locations = response.data.data
            this.noLocationFound = false
          } else {
            this.latitude = ''
            this.longitude = ''
            this.locations = []
            this.noLocationFound = true
          }
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    onGetWeather (obj) {
      this.selectedLocation = obj
      axios.get('https://api.openweathermap.org/data/2.5/forecast?lat=' + this.selectedLocation.latitude + '&lon=' + this.selectedLocation.longitude + '&units=metric&appid=47d45b39828056463f147950bf790b81')
        .then(response => {
          console.log(response.data.list)
          this.search = ''
          this.locations = []
          this.weatherArray = response.data.list
          this.todayWeather = this.weatherArray[0]
          const tempDays = [0, 9, 17, 25, 33]
          for (let i = 0; i < 40; i++) {
            if (tempDays.includes(i)) {
              this.fiveDayForecastArray.push(this.weatherArray[i])
            }
          }
        })
        .catch(e => {
          this.errors.push(e)
        })
    }
  }
}
</script>
