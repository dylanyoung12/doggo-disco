<template>
  <div>
    <div v-if="loggedIn">
      <h3 v-if="isEmpty(favorites)">Your favorite doggos will appear here</h3>
      <ul class='list-group' v-for="item in favorites">
        <li class='list-group-item'>
          <h3>{{ item.name }}</h3>
          <div class='container'>
            <div class='row align-items-center justify-content-around'>
              <div class='col text-center'>
                <img class='portrait' v-bind:src='item.path'>
              </div>
              <div class='col text-center'>
                <button class='btn' v-on:click="setCurrent(item)">Dance with {{ item.name }}!</button>
                <button class='btn btn-sm' v-on:click="remove(item)">Remove from favorites</button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-else>
      <h2>Please sign in or register for an account</h2>
    </div>
    <div v-if="danceTime">
      <dance-floor/>
    </div>
  </div>
</template>

<script>
import DanceFloor from './DanceFloor';
export default {
  name: 'Favorites',
  components: { DanceFloor },
  computed: {
    favorites: function() {
      return this.$store.getters.favorites;
    },
    loggedIn: function() {
      return this.$store.getters.loggedIn;
    },
    danceTime: function() {
      return this.$store.getters.current !== '';
    }
  },
  methods: {
    setCurrent: function(dog) {
      this.$store.commit('setCurrent', dog.path);
    },
    remove: function(dog) {
      this.$store.dispatch('removeFavorite', dog);
    },
    isEmpty: function(obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) return false;
      }
      return true;
    },
  },
}
</script>

<style scoped>
li {
  min-width: 500px;
  max-width: 700px;
}
img {
  width: 200px;
  border-radius: 5px;
}
h3 {
  text-align: center;
}
button.btn-sm {
  margin-top: 20px;
}
</style>
