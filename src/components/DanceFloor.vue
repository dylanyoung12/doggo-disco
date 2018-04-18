<template>
  <div>
    <div id="danceFloor" class="container">
      <img id="doggo" ref="doggo" v-bind:src="current">
    </div>
    <form v-on:submit.prevent="save">
      <div class='form-group'>
        <label>Like this doggo? Give it a name and save it for later!</label>
        <input v-model='dogName' type='text' class='form-control' placeholder="Name"/>
      </div>
      <button type='submit' class='btn'>Save</button>
      <small class='sm' v-if='nameError'>&emsp;Please select a name for your doggo</small>
    </form>
    <br>
    <div>
      <small class='sm'>Need a break from dancing? <button class='btn btn-sm' v-on:click='stop'>Stop the Music</button></small>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DanceFloor',
  data () {
    return {
      dogName: '',
      nameError: false,
      audio: new Audio('../../static/Shake_Shake_Shake.mp3'),
    }
  },
  beforeCreate: function() {
    document.body.className = 'danceTime';
  },
  mounted: function() {
    var doggo = this.$refs.doggo;
    var angle = 0, lastTime = null;
    function animate(time) {
      if (lastTime !== null) {
        angle += (time - lastTime) * 0.001;
      }
      lastTime = time;
      doggo.style.top = (Math.sin(4 * angle) * 25 + 25) + "%";
      doggo.style.left = (Math.cos(angle) * 25 + 30) + "%";
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    document.body.className = 'danceTime';
    this.audio.play();
  },
  computed: {
    current: function() {
      return this.$store.getters.current;
    },
  },
  beforeDestroy () {
    document.body.className = '';
    this.audio.pause();
  },
  methods: {
    save: function () {
      if (this.dogName === '') {
        this.nameError = true;
        return;
      }
      this.nameError = false;
      this.$store.dispatch('addFavorite', {
        name: this.dogName,
        path: this.current,
      }).then(dog => {
        this.dogName = '';
      });
    },
    stop: function () {
      this.$store.commit('setCurrent', '');
    }
  },
}
</script>

<style>
#doggo {
  display: block;
  position: relative;
  width: 40%;
  border-radius: 5px;
  box-shadow: 5px 5px 15px black;
  animation-name: rock;
  animation-duration: 1.0714s;
  animation-iteration-count: infinite;
}
@keyframes rock {
  0% {transform: rotate(7deg);}
  50% {transform: rotate(-7deg);}
  100% {transform: rotate(7deg);}
}
body.danceTime {
  animation-name: colorchange;
  animation-duration: 5s;
  animation-iteration-count: infinite;
}
.danceTime {
  color: black !important;
}
.danceTime nav.navbar {
  background-color: lightgray;
  border-radius: .25rem;
}
@keyframes colorchange {
  0%   {background-color: rgb(87, 245, 54);}
  25%  {background-color: rgb(43, 176, 255);}
  50%  {background-color: rgb(87, 245, 54);}
  75%  {background-color: rgb(255, 60, 46);}
  100% {background-color: rgb(87, 245, 54);}
}
#danceFloor {
  height: 500px;
  margin-top: 5vw;
  margin-bottom: 15vw;
  text-align: center;
}
</style>
