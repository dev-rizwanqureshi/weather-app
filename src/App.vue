<template>
<!--  <nav>-->
<!--    <router-link to="/">Home</router-link> |-->
<!--    <router-link to="/about">About</router-link>-->
<!--  </nav>-->
  <router-view/>
</template>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  .weather-icon {
    height: 100px;
    width: 100px;
    object-fit: cover;
  }

  .weather-card {
    margin: 5px;
    text-align: center;
    border: 1px solid;
  }

  .weather-map {
    margin: 5px;
    border: 1px solid;
    height: 250px;
  }

  .arrow-icon {
    height: 30px;
    width: 100%;
    object-fit: contain;
  }

  .search-box {
    position: relative;
  }

  .search-box .list-group {
    position: absolute;
    width: 100%;
  }

  .search-box .list-group .list-group-item {
    cursor: pointer;
  }

  input {
    max-width: 100%;
  }

</style>
