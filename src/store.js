
import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

import BootstrapVue from 'bootstrap-vue'

Vue.use(Vuex);
Vue.use(BootstrapVue);

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

export default new Vuex.Store({
  state: {
    user: {},
    loggedIn: false,
    loginError: '',
    registerError: '',
    breeds: {},
    current: '',

  },
  getters: {
    user: state => state.user,
    loggedIn: state => state.loggedIn,
    loginError: state => state.loginError,
    registerError: state => state.registerError,
    breeds: state => state.breeds,
    current: state => state.current,
    danceTime: state => {
      if (state.current === '') return false;
      else return true;
    },
  },
  mutations: {
    setUser (state, user) {
      state.user = user;
    },
    setLogin (state, status) {
      state.loggedIn = status;
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
  },
  actions: {
    // Registration, Login //
    register(context,user) {
      axios.post("/api/users", user).then(response => {
        context.commit('setUser', response.data.user);
        context.commit('setLogin',true);
        context.commit('setRegisterError',"");
        context.commit('setLoginError',"");
      }).catch(error => {
        context.commit('setLoginError', "");
        context.commit('setLogin', false);
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
        context.commit('setLogin', true);
        context.commit('setRegisterError', "");
        context.commit('setLoginError', "");
      }).catch(error => {
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
      context.commit('setLogin', false);
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
  }
});
