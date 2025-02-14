<template>
    <div>
        <button @click="createTodo">
          <i class="material-icons">add</i>
        </button>
        <input
            :value="title"
            :placeholder="placeholder"
            type="text"
            @input="title = $event.target.value"
            @keypress.enter="createTodo"
        />
    </div>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      placeholder: '할 일을 추가하세요!'
    }
  },
  methods: {
    createTodo () {
      // 유효성 검사
      const validatedTitle = this.title && this.title.trim()
      if (!validatedTitle) {
        alert('유효하지않은 제목입니다!')
        this.title = this.title.trim()
        return
      }

      // this.$emit('create-todo', this.title)
      this.$store.dispatch('todoApp/createTodo', this.title)
      this.title = ''

      // 화면이 렌더링 되는 것을 기다리고 행동한다.
      this.$nextTick(() => {
        window.scrollTo(0, document.body.scrollHeight)
      })
    }
  }
}
</script>
