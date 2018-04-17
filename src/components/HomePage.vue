<template>
  <div>
    <div v-if="loggedIn">
      <doggo-select/>
    </div>
    <div v-else>
      <welcome-page/>
    </div>
    <div v-if="danceTime">
      <dance-floor/>
    </div>
  </div>
</template>

<script>
import WelcomePage from './WelcomePage';
import DoggoSelect from './DoggoSelect';
import DanceFloor from './DanceFloor';
export default {
  name: 'HomePage',
  components: {WelcomePage, DoggoSelect, DanceFloor },
  computed: {
    loggedIn: function() {
      return this.$store.getters.loggedIn;
    },
    danceTime: function() {
      return this.$store.getters.danceTime;
    }
  },
}
</script>

<style scoped>
</style>
