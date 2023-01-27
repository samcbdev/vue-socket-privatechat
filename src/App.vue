<template>
  <div id="app">
        <SelectUserName v-if="!usernameAlreadySelected" @formClose="onUsernameSelection" />
        <div class="container" v-else >
          <ChatWindow />
        </div>
  </div>
</template>

<script>
import SelectUserName from "./components/SelectUserName";
import ChatWindow from "./components/ChatWindow";
import socket from "./socket";

export default {
  name: "App",
  components: {
    SelectUserName,
    ChatWindow
  },
  data() {
    return {
      usernameAlreadySelected: false
    };
  },
  methods: {
    onUsernameSelection(username) {
      this.usernameAlreadySelected = true;
      socket.auth = { username };
      socket.connect();
    }
  },
  created() {
    socket.on("connect_error", err => {
      console.log("err", err);
      if (err.message === "invalid username") {
        this.usernameAlreadySelected = false;
      }
    });
  },
  unmounted() {
    socket.off("connect_error");
  }
};
</script>

<style lang="scss">
@import "./assets/style.scss";
</style>
