<template>
  <div id="app">
    <app-header/>
    <router-view/>
    <br><br><br><br><br><br>
    <a href='https://github.com/dylanyoung12/doggo-disco'>github repository</a>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader';
export default {
  name: 'App',
  components: { AppHeader },
  created: function() {
    this.$store.dispatch('getAllBreeds');
  },
}
</script>

<style>
/* https://color.adobe.com/CS04-color-theme-1994456/?showPublished=true */
body {
  font-size: 18px;
  padding: 20px 100px 5px 100px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
button:focus {
  outline: none;
}
button:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
}
button:active {
  transform: translateY(4px);
}
input.form-control {
  height: 50px;
  margin-bottom: 5px;
  padding: 10px;
  width: 200px;
  display: inline-block;
}
</style>
