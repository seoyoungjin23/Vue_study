<template>
  <div class="todo-app">

      <div class="todo-app__actions">
        <div class="filters">
          <router-link
              to="all"
              tag="button">
            모든 항목 ({{ total }})
          </router-link>

          <router-link
              to="active"
              tag="button">
            해야할 항목 ({{ activeCount }})
          </router-link>

          <router-link
              to="completed"
              tag="button">
            완료된 항목 ({{ completedCount }})
          </router-link>
        </div>

        <div class="actions clearfix">
            <label class="float--left">
              <input
                  v-model="allDone"
                  type="checkbox"
              />
              <span class="icon"><i class="material-icons">done_all</i></span>
            </label>
          <div class="float--right clearfix">
            <button
                class="btn float--left"
                @click="scrollToTop"
            >
              <i class="material-icons">expand_less</i>
            </button>
            <button
                class="btn float--left"
                @click="scrollToBottom"
            >
              <i class="material-icons">expand_more</i>
            </button>
            <button
                class="btn btn--danger float--left"
                @click="clearCompleted"
            >
              <i class="material-icons">delete_sweep</i>
            </button>
          </div>
        </div>
      </div>

      <div class="todo-app__list">
        <todo-item
            v-for="todo in filteredTodos"
            :key="todo.id"
            :todo="todo"
        />
      </div>

      <todo-creator
          class="todo-app__creator"
      />
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import scrollTo from 'scroll-to'

import TodoCreator from '~/components/TodoCreator.vue'
import TodoItem from '~/components/TodoItem.vue'

export default {
  components: {
    TodoItem,
    TodoCreator
  },
  computed: {
    ...mapState('todoApp', [
      'todos'
    ]),
    ...mapGetters('todoApp', [
      'filteredTodos',
      'total',
      'activeCount',
      'completedCount'
    ]),
    allDone: {
      get () {
        return this.total === this.completedCount && this.total > 0
      },
      set (checked) {
        this.completeAll(checked)
      }
    }
  },
  watch: {
    $route () {
      // state.filter = this.$route.params.id
      // this.$store.commit('todoApp/updateFilter', this.$route.params.id)
      this.updateFilter(this.$route.params.id)
    }
  },
  // TodoApp 이 생성되고 나서 직후에 라이프 사이클 훅에서 initDB 실행
  created () {
    this.initDB()
  },
  methods: {
    ...mapMutations('todoApp', [
      'updateFilter'
    ]),
    ...mapActions('todoApp', [
      'initDB',
      'completeAll',
      'clearCompleted'
    ]),
    scrollToTop () {
      scrollTo(0, 0, {
        ease: 'linear'
      })
    },
    scrollToBottom () {
      scrollTo(0, document.body.scrollHeight, {
        ease: 'linear'
      })
    }
  }
}
</script>

<style lang="scss">
  @import "scss/style";

  .filters button.router-link-active {
    background: royalblue;
    color: white;
  }
</style>
