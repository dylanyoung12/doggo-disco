<template>
  <div id="danceFloor" class="container">
    <img id="doggo" ref="doggo" v-bind:src="current">
  </div>
</template>

<script>
export default {
  name: 'DanceFloor',
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
    let audio = new Audio('../../static/Shake_Shake_Shake.mp3');
    audio.play();
  },
  computed: {
    current: function() {
      return this.$store.getters.current;
    },
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
body {
  animation-name: colorchange;
  animation-duration: 5s;
  animation-iteration-count: infinite;
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
  margin-bottom: 20vw;
  text-align: center;
}
</style>
