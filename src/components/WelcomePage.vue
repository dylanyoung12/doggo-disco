<template>
  <div class="">
    <h1>Are You Ready to Disco?</h1>
    <h2>Get signed up to join the party!</h2>
    <form v-on:submit.prevent="register">
      <div class='form-group'>
        <p>1. Choose a user name (this is how you will log in).</p>
        <input class="narrow form-control" v-model="username" placeholder="User Name">
      </div>
      <div class='form-group'>
        <p>2. Create an account.</p>
        <input class="wide form-control" v-model="name" placeholder="First and Last Name"><br/>
        <input class="narrow form-control" type="password" v-model="password" placeholder="Password">
        <button class="btn btn-lg" type="submit">Register</button>
      </div>
    </form>
    <p class="error">{{registerError}}</p>
  </div>
</template>

<script>
export default {
  name: 'WelcomePage',
  data () {
    return {
      username: '',
      password: '',
      name: '',
    }
  },
  computed: {
    registerError: function() {
      return this.$store.getters.registerError;
    },
  },
  methods: {
    register: function() {
      this.$store.dispatch('register',{
        username: this.username,
        password: this.password,
        name: this.name,
      });
    }
  }
}
</script>

<style scoped>
h1 {
  margin-bottom: 0px;
}
h2 {
  margin-top: 0px;
  font-size: 1.2em;
  font-weight: normal;
  margin-bottom: 50px;
}
.narrow {
  width: 200px;
}
.wide {
  width: 400px;
}
</style>
