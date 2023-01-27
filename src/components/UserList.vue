<template>
  <div class="friend-drawer friend-drawer--onhover" @click="onClick">
    <img
      class="profile-image"
      src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/robocop.jpg"
      alt
    />
    <div class="text">
      <h6>{{ user.username }} {{ user.self ? " (yourself)" : "" }}</h6>
      <p class="text-muted"><StatusIcon :connected="user.connected" /> {{ status }}</p>
    </div>
    <span class="new-messages" v-if="user.hasNewMessages">!</span>
  </div>
</template>

<script>
import StatusIcon from "@/components/StatusIcon";

export default {
  name: "UserList",
  props: {
    user: Object,
    selected: Boolean
  },
  components: {
    StatusIcon
  },
  methods: {
    onClick() {
      this.$emit("select");
    }
  },
  computed: {
    status() {
      return this.user.connected ? "online" : "offline";
    }
  }
};
</script>

<style>
.new-messages {
  color: white;
  background-color: red;
  width: 20px;
  border-radius: 5px;
  text-align: center;
  float: right;
  margin-top: 10px;
}
</style>