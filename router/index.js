import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '~/views/Home'
import About from '~/views/About'
import TodoApp from '~/views/TodoApp'

Vue.use(VueRouter)

const routes = [
  // config
  {
    name: 'index',
    path: '/',
    component: Home
  },
  {
    name: 'about',
    path: '/about',
    component: About
  },
  {
    name: 'todos',
    path: '/todos',
    redirect: '/todos/all',
    component: TodoApp,
    // 또 다른 라우트 객체
    children: [
      {
        name: 'filter-todos',
        path: ':id' // path를 id라는 파라미터로 받겠다는 의미
      }
    ]
  }
]

export default new VueRouter({
  mode: 'history',
  routes
})
