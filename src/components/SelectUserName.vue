<template>
  <div class="select-username">
    <form @submit.prevent="onSubmit">
      <input v-model="username" placeholder="Enter your name..." />
      <button :disabled="!isValid">Start</button>
    </form>
  </div>
</template>
  
<script>
export default {
    name: "SelectUserName",
    data () {
      return {
        username: ''
      }
    },
    computed: {
      isValid() {
        return this.username.length > 2
      }
    },
    methods: {
      onSubmit() {
        this.$emit('formClose', this.username)
      }
    }
};
</script>
  
<style>
.select-username {
  width: 300px;
  margin: 200px auto 0;
}
</style>