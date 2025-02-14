export default {
  namespaced: true,
  // Data
  state: () => ({
    a: 123,
    b: []
  }),
  // Computed
  getters: {
    someGetter1 (state, getters) {
      return state.a + 1
    },
    someGetter2 (state, getters) {
      return state.a + getters.someGetter1
    }
  },
  mutations: {
    // payload - mutation이 실행될 때 전달 받은 특정한 값
    someMutation (state, payload) {
      state.a = 789
      state.b.push(payload)
    }
  },
  actions: {
    // context에 포함된 항목 {state, getters, commit, dispatch}
    someAction1 ({ state, getters, commit, dispatch }, payload) {
      state.a = 789 // Error
      state.b.push(payload) // Error
      commit('someMutation', payload)
    },
    someAction2 (context, payload) {
      context.commit('someMutation')
      context.dispatch('someAction1', payload)
    }
  }
}
