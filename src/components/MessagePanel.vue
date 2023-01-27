<template>
  <div class="col-md-8" style="position:relative">
    <div class="settings-tray">
            <div class="friend-drawer no-gutters friend-drawer--grey">
              <img
                class="profile-image"
                src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/robocop.jpg"
                alt
              />
              <div class="text">
                <h6>{{ user.username }}</h6>
                <p class="text-muted"><StatusIcon :connected="user.connected" /> {{ user.connected ? "online" : "offline" }}</p>
              </div>
              <span class="settings-tray--right">
                <i class="material-icons">cached</i>
                <i class="material-icons">message</i>
                <i class="material-icons">menu</i>
              </span>
            </div>
          </div>

          <div class="chat-panel">
            <div 
              v-for="(message, index) in user.messages"
              :key="index"
              class="row no-gutters"
            >
              <div class="col-md-3" :class="message.fromSelf ? 'offset-md-9' : ''">
                <div class="chat-bubble" :class="message.fromSelf ? 'chat-bubble--right' : 'chat-bubble--left'">{{ message.message }}</div>
              </div>
            </div>

            <div class="row" style="position:absolute; bottom:0; width: 104%">
              <div class="col-12">
                <div class="chat-box-tray">
                  <i class="material-icons">sentiment_very_satisfied</i>
                  <input v-model="input" type="text" placeholder="Type your message here..." v-on:keyup.enter="onSubmit" />
                  <i class="material-icons">mic</i>
                  <i class="material-icons" style="cursor:pointer" :disabled="!isValid" @click="onSubmit">send</i>
                </div>
              </div>
            </div>

            </div>
  </div>
</template>

<script>
import StatusIcon from "@/components/StatusIcon";

export default {
    name: "MessagePanel",
    components: {
        StatusIcon
    },
    props: {
        user: Object
    },
    data () {
        return {
            input: ''
        }
    },
    methods: {
        onSubmit() {
            this.$emit("onSend", this.input);
            this.input = ""
        },
        displaySender(message, index) {
            return (
                index === 0 ||
                this.user.messages[index - 1].fromSelf !== this.user.messages[index].fromSelf
            )
        }
    },
    computed: {
        isValid() {
            return this.input.length > 0
        }
    }
}
</script>

<style scoped>

</style>