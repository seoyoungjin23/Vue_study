import Vue from 'vue'
import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import cryptoRandomString from 'crypto-random-string'
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import _cloneDeep from 'lodash/cloneDeep'
import _findIndex from 'lodash/findIndex'
import _forEachRight from 'lodash/forEachRight'

export default {
  namespaced: true,
  state: () => ({
    db: null,
    todos: [],
    filter: 'all' // 라우터가 변경되었을 때 이 filter값을 변경하면 된다.
  }),
  getters: {
    filteredTodos (state) {
      switch (state.filter) {
        case 'all':
        default:
          return state.todos
        case 'active': // 해야할 항목
          return state.todos.filter(todo => !todo.done)
        case 'completed': // 완료된 항목
          return state.todos.filter(todo => todo.done)
      }
    },
    total (state) {
      return state.todos.length
    },
    activeCount (state) {
      return state.todos.filter(todo => !todo.done).length
    },
    completedCount (state, getters) {
      return getters.total - getters.activeCount // getter를 통해서 참조 가능
    }
  },
  mutations: {
    assignDB (state, db) { // actions와 다르게 context 없이 state에 접근이 가능하다.
      state.db = db
    },
    createDB (state, newTodo) {
      state.db
        .get('todos')
        .push(newTodo)
        .write()
    },
    updateDB (state, { todo, value }) {
      state.db
        .get('todos')
        .find({ id: todo.id })
        .assign(value)
        .write()
    },
    deleteDB (state, todo) {
      state.db
        .get('todos')
        .remove({ id: todo.id })
        .write()
    },
    assignTodos (state, todos) {
      state.todos = todos
    },
    pushTodo (state, newTodo) {
      state.todos.push(newTodo)
    },
    assignTodo (state, { foundTodo, value }) {
      _assign(foundTodo, value)
    },
    deleteTodo (state, foundIndex) {
      Vue.delete(state.todos, foundIndex)
      // this.$delete(this.todos, foundIndex)
      // _remove(this.todos, { id:todo.id})
    },
    updateTodo (state, { todo, key, value }) {
      todo[key] = value
    },
    updateFilter (state, filter) {
      state.filter = filter
    }
  },
  actions: {
    // TODO initDB
    initDB ({ state, commit }) {
      // context라는 객체에 vuex 정보를 담은 객체가 들어오는데 여기서 state를 꺼내서 활용한다.
      const adapter = new LocalStorage('todo-app') // DB 이름 설정
      commit('assignDB', lowdb(adapter)) // commit을 통해서 mutation을 실행한다.

      console.log(state.db)

      // Todo Read - data 받아오기
      const hasTodos = state.db.has('todos').value()

      if (hasTodos) {
        // state.todos = _cloneDeep(state.db.getState().todos) // DB의 값이 변경되는 문제를 방지
        commit('assignTodos', _cloneDeep((state.db.getState().todos)))
      } else {
        // Local DB 초기화
        state.db.defaults({
          todos: []
        })
          .write()
      }
    },
    // Todo create
    createTodo ({ state, commit }, title) {
      const newTodo = {
        id: cryptoRandomString({ length: 10 }),
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
        done: false
      }

      // Create DB
      commit('createDB', newTodo)

      // Create Client
      commit('pushTodo', newTodo)
    },
    // Todo update
    // 세 번째 인수를 허용하지 않는다.
    updateTodo ({ state, commit }, { todo, value }) {
      // Update DB
      commit('updateDB', { todo, value })

      const foundTodo = _find(state.todos, { id: todo.id })
      commit('assignTodo', { foundTodo, value })
    },
    // Todo delete
    deleteTodo ({ state, commit }, todo) {
      // Delete DB
      commit('deleteDB', todo)

      const foundIndex = _findIndex(this.todos, { id: todo.id })
      // Delete Client
      commit('deleteTodo', foundIndex)
    },
    // Todo completeAll
    completeAll ({ state, commit }, checked) {
      // commit은 반환 값을 만들어낼 수 없기 때문에 전체 이관이 불가능하다.
      const newTodos = state.db
        .get('todos')
        .forEach(todo => {
          // todo.done = checked
          commit('updateTodo', {
            todo,
            key: 'done',
            value: checked
          })
        })
        .write()

      // state.todos = _cloneDeep(newTodos)
        commit('assignTodos', _cloneDeep(newTodos))
    },
    // Todo clearCompleted
    clearCompleted ({ state, dispatch }) {
      _forEachRight(state.todos, todo => {
        if (todo.done) {
          dispatch('deleteTodo', todo)
        }
      })
    }
  }
}
