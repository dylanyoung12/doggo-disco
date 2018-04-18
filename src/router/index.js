import Vue from 'vue'
import Router from 'vue-router'
import Store from '@/store'
import HomePage from '@/components/HomePage'
import Favorites from '@/components/Favorites'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/favorites',
      name: 'Favorites',
      component: Favorites
    }
  ]
})
