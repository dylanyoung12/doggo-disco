<template>
  <div id="app">
    <app-header/>
    <router-view/>
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
button {
  min-width: 100px;
  line-height: 1em;
  border: none;
  border-radius: 5px;
  padding: 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1.2rem;
  margin: 4px 2px;
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
input {
  height: 50px;
  margin-bottom: 5px;
  padding: 10px;
}

</style>
