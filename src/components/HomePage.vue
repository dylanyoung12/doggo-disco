<template>
  <div>
    <div v-if="loggedIn">
      <search/>
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
import Search from './Search';
import DanceFloor from './DanceFloor';
export default {
  name: 'HomePage',
  components: {WelcomePage, Search, DanceFloor },
  computed: {
    loggedIn: function() {
      return this.$store.getters.loggedIn;
    },
    danceTime: function() {
      return this.$store.getters.current !== '';
    }
  },
}
</script>

<style scoped>
</style>
