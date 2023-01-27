<template>
  <div class="row no-gutters" style="height:100vh">
    <div class="col-md-4 border-right">
      <div class="settings-tray">
        <img
          class="profile-image"
          src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/filip.jpg"
          alt="Profile img"
        />
        <span class="settings-tray--right">
          <i class="material-icons">cached</i>
          <i class="material-icons">message</i>
          <i class="material-icons">menu</i>
        </span>
      </div>
      <div class="search-box">
        <div class="input-wrapper">
          <i class="material-icons">search</i>
          <input placeholder="Search here" type="text" />
        </div>
      </div>

      <userList
        v-for="user in users"
        :key="user.userId"
        :user="user"
        :selected="selectedUser === user"
        @select="onSelectUser(user)"
      />
      <hr />
    </div>

    <MessagePanel v-if="selectedUser" :user="selectedUser" @onSend="onMessage" />
  </div>
</template>

<script>
import socket from "../socket";
import userList from "@/components/UserList";
import MessagePanel from "@/components/MessagePanel";

export default {
  name: "ChatWindow",
  data() {
    return {
      selectedUser: null,
      users: []
    };
  },
  components: {
    userList,
    MessagePanel
  },
  methods: {
    onSelectUser(user) {
      this.selectedUser = user;
      user.hasNewMessages = false;
    },
    onMessage(message) {
      console.log(message);
      if (this.selectedUser) {
        socket.emit("private message", {
          message,
          to: this.selectedUser.userId
        });

        this.selectedUser.messages.push({
          message,
          fromSelf: true
        });
      }
    }
  },
  created() {
    socket.on("connect", () => {
      this.users.forEach(user => {
        if (user.self) {
          user.connected = true;
        }
      });
    });

    socket.on("disconnect", () => {
      this.users.forEach(user => {
        if (user.self) {
          user.connected = false;
        }
      });
    });

    const initReactiveProperties = user => {
      user.connected = true;
      user.messages = [];
      user.hasNewMessages = false;
    };

    socket.on("users", users => {
      users.forEach(user => {
        user.self = user.userId == socket.id;
        initReactiveProperties(user);
      });

      this.users = users.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
    });

    socket.on("user connected", user => {
      initReactiveProperties(user);
      this.users.push(user);
    });

    socket.on("user disconnected", id => {
      for (let i = 0; i < this.users.length; i++) {
        const user = this.users[i];
        if (user.userId == id) {
          user.connected = false;
          break;
        }
      }
    });

    socket.on("private message", ({ message, from }) => {
      for (let i = 0; i < this.users.length; i++) {
        const user = this.users[i];
        if (user.userId == from) {
          user.messages.push({
            message,
            fromSelf: false
          });

          if (user != this.selectedUser) {
            user.hasNewMessages = true;
          }
          break;
        }
      }
    });
  },
  unmounted() {
    socket.off("connect");
    socket.off("disconnect");
    socket.off("users");
    socket.off("user connected");
    socket.off("user disconnected");
    socket.off("private message");
  }
};
</script>

<style scoped>

</style>