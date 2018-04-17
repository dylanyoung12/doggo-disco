<template>
  <div class="container" id="search">
    <form v-on:submit.prevent="getDoggo">
      <div class="form-group">
        <label>Select a breed of dog: </label>
        <select v-model="selected">
          <option v-for="breed in breeds" v-bind:value="breed">
            {{ toUpper(breed) }}
          </option>
        </select>
      </div>
      <div class="form-group" v-if="subBreeds.length > 0">
        <label>Select Sub-breed: </label>
        <select v-model="subSelected">
          <option v-for="subBreed in subBreeds" v-bind:value="subBreed">
            {{ toUpper(subBreed) }}
          </option>
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
    <br><br>
    <div class="container">
      <p>Or,&emsp;<button id="randomBreed" class="btn" v-on:click.prevent="getRandom">Choose a Random Dog</button></p>
    </div>
  </div>

</template>

<script>
export default {
  name: 'Search',
  data () {
    return {
      selected: '',
      subSelected: '',
    }
  },
  computed: {
    breeds: function () {
      return Object.keys(this.$store.getters.breeds);
    },
    subBreeds: function () {
      if (this.selected === '') return [];
      else if (this.$store.getters.breeds[this.selected] === []) return [];
      else return this.$store.getters.breeds[this.selected];
    },
  },
  watch: {
    selected: function () {
      this.subSelected = '';
    },
  },
  methods: {
    toUpper: function (string) {
      return string.charAt(0).toUpperCase() + string.substr(1);
    },
    getDoggo: function () {
      this.$store.dispatch('getBreed', {
        breed: this.selected,
        subBreed: this.subSelected,
      });
    },
    getRandom: function () {
      this.$store.dispatch('getRandom');
    },
  }
}

</script>
