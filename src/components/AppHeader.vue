<template>
  <div>
    <nav class='navbar navbar-expand-lg navbar-light' id="menu">
      <a class='nav-item nav-link' @click="toHome">Home</a>
      <a class='nav-item nav-link mr-auto' v-if='loggedIn' @click="toFavorites">Favorites</a>
      <span class="nav-item navbar-text" v-if="loggedIn">{{user.username}}&emsp;</span>
      <a class='nav-item nav-link' v-if="loggedIn" @click="logout" href="#">Logout</a>
      <div class='nav-item ml-auto' v-else>
        <form class='navbar-form' v-on:submit.prevent="login">
          <input v-model="username" placeholder="Username">
          <input type="password" v-model="password" placeholder="Password">
          <button class="primary" type="submit">Login</button>
        </form>
      </div>
    </nav>
    <div class="flexWrapper errorPlace">
      <p v-if="loginError" class="flexRight error">{{loginError}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppHeader',
  data () {
    return {
      username: '',
      password: '',
    }
  },
  computed: {
    user: function() {
      return this.$store.getters.user;
    },
    loggedIn: function() {
      return this.$store.getters.loggedIn;
    },
    loginError: function() {
      return this.$store.getters.loginError;
    },
  },
  methods: {
    login: function() {
      this.$store.dispatch('login', {
        username: this.username,
        password: this.password,
      }).then(user => {
        this.email = '';
        this.password = '';
      });
    },
    logout: function() {
      document.body.className = '';
      this.$store.dispatch('logout');
      this.$router.push({ path: '/' });
    },
    toFavorites: function() {
      this.$router.push({ path: '/favorites' });
    },
    toHome: function() {
      this.$router.push({ path: '/' });
    },
  }
}
</script>

<style scoped>
.nav {
  width: 100%;
}

a.nav-link {
  color: #007bff;
  cursor: pointer;
}

.errorPlace {
  height: 20px;
}
img {
  width: 50px;
}
</style>
