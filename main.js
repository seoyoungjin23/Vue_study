import Vue from 'vue'
import App from './App' // 최상위 컴포넌트
import router from './router'
import store from './store'

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
  // render (createElement) {
  //   return createElement(App) // 인수로 최상위 컴포넌트를 받아서 요소를 생성한다.
  // }
})
