
import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

import BootstrapVue from 'bootstrap-vue'

Vue.use(Vuex);
Vue.use(BootstrapVue);

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

const getAuthHeader = () => {
  return { headers: {'Authorization': localStorage.getItem('token')}};
}

export default new Vuex.Store({
  state: {
    user: {},
    token: '',
    loginError: '',
    registerError: '',
    breeds: {},
    current: '',
    favorites: {},
  },
  getters: {
    user: state => state.user,
    getToken: state => state.token,
    loggedIn: state => {
      if (state.token === '') return false;
      return true;
    },
    loginError: state => state.loginError,
    registerError: state => state.registerError,
    breeds: state => state.breeds,
    current: state => state.current,
    favorites: state => state.favorites,
  },
  mutations: {
    setUser (state, user) {
      state.user = user;
    },
    setToken (state, token) {
      state.token = token;
      if (token === '') localStorage.removeItem('token');
      else localStorage.setItem('token', token);
    },
    setLoginError (state, message) {
      state.loginError = message;
    },
    setRegisterError (state, message) {
      state.registerError = message;
    },
    setBreeds (state, breeds) {
      state.breeds = breeds;
    },
    setCurrent (state, url) {
      state.current = url;
    },
    setFavorites (state, favorites) {
      state.favorites = favorites;
    },
  },
  actions: {
    // Initialize //
    initialize(context) {
      let token = localStorage.getItem('token');
      if (token) {
        // see if we can use the token to get my user account
        axios.get("/api/me", getAuthHeader()).then(response => {
          context.commit('setToken', token);
          context.commit('setUser', response.data.user);
        }).catch(err => {
          // remove the token and user from state
          localStorage.removeItem('token');
          context.commit('setUser', {});
          context.commit('setToken', '');
        });
      }
    },
    // Registration, Login //
    register(context,user) {
      axios.post("/api/users", user).then(response => {
        context.commit('setUser', response.data.user);
        context.commit('setToken', response.data.token);
        context.commit('setRegisterError',"");
        context.commit('setLoginError',"");
      }).catch(error => {
        context.commit('setLoginError', "");
        context.commit('setUser', {});
        context.commit('setToken', '');
        if (error.response) {
          if (error.response.status === 409) context.commit('setRegisterError',"That user name is already taken.");
          return;
        }
        context.commit('setRegisterError',"Sorry, your request failed. We will look into it.");
      });
    },
    login(context, user) {
      axios.post("/api/login", user).then(response => {
        context.commit('setUser', response.data.user);
        context.commit('setToken', response.data.token);
        context.commit('setRegisterError', "");
        context.commit('setLoginError', "");
      }).catch(error => {
        context.commit('setUser', {});
        context.commit('setToken', '');
        context.commit('setRegisterError', "");
        if (error.response) {
          if (error.response.status === 403 || error.response.status === 400) context.commit('setLoginError',"Invalid login.");
          context.commit('setRegisterError', "");
          return;
        }
        context.commit('setLoginError',"Sorry, your request failed. We will look into it.");
      });
    },
    logout(context, user) {
      context.commit('setUser', {});
      context.commit('setToken', '');
      context.commit('setCurrent', '');
    },
    // Get list of breeds
    getAllBreeds(context) {
      fetch("https://dog.ceo/api/breeds/list/all").then(response => {
        return response.json();
      }).then(json => {
        context.commit('setBreeds', json.message);
      }).catch(err => {
        console.log('Error retrieving breeds', err);
      });
    },
    // Get selected breed
    getBreed(context, selected) {
      if (!selected.breed) return res.status(400).send();
      let breed = selected.breed;
      if (selected.subBreed !== '') {
        let subBreed = selected.subBreed;
        fetch("https://dog.ceo/api/breed/" + breed + '/' + subBreed + "/images/random").then(response => {
          return response.json();
        }).then(json => {
          context.commit('setCurrent', json.message);
          return;
        }).catch(err => {
          console.log("Error getting image", err);
        });
      }
      else {
        fetch("https://dog.ceo/api/breed/" + breed + "/images/random").then(response => {
          return response.json();
        }).then(json => {
          context.commit('setCurrent', json.message);
          return;
        }).catch(err => {
          console.log("Error getting image", err);
        });
      }
    },
    // Get a random breed
    getRandom(context) {
      fetch("https://dog.ceo/api/breeds/image/random").then(response => {
        return response.json()
      }).then(json => {
        // console.log(json.message);
        context.commit('setCurrent', json.message);
      }).catch(err => {
        console.log('Error getting image', err);
      });
    },
    // Favorites
    getFavorites(context) {
      return axios.get("/api/users/" + context.state.user.id + "/favorites").then(response => {
        context.commit('setFavorites', response.data.favorites);
      }).catch(err => {
        console.log("getFavorites failed:", err);
      });
    },
    addFavorite(context, dog) {
      axios.post("/api/users/" + context.state.user.id + "/favorites", dog, getAuthHeader()).then(response => {
        return context.dispatch('getFavorites');
      }).catch(err => {
        console.log('addFavorite failed:', err);
      });
    },
    removeFavorite(context, dog) {
      return axios.delete("/api/users/" + context.state.user.id + "/favorites/" + dog.id, getAuthHeader()).then(response => {
        context.dispatch('getFavorites');
      }).catch(err => {
        console.log("remove failed:", err);
      });
    },
  }
});
