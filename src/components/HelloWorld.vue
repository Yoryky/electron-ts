<template>
  <div class="hello">
    <div>
      <h1>{{ msg }}</h1>
      <p>
        For a guide and recipes on how to configure / customize this project,<br />
        check out the
        <a href="https://cli.vuejs.org" target="_blank" rel="noopener"
        >vue-cli documentation</a
        >.
      </p>
      <h3>Installed CLI Plugins</h3>
      <ul>
        <li>
          <a
              href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel"
              target="_blank"
              rel="noopener"
          >babel</a
          >
        </li>
        <li>
          <a
              href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-router"
              target="_blank"
              rel="noopener"
          >router</a
          >
        </li>
        <li>
          <a
              href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-vuex"
              target="_blank"
              rel="noopener"
          >vuex</a
          >
        </li>
        <li>
          <a
              href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint"
              target="_blank"
              rel="noopener"
          >eslint</a
          >
        </li>
        <li>
          <a
              href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-typescript"
              target="_blank"
              rel="noopener"
          >typescript</a
          >
        </li>
      </ul>
      <h3>Essential Links</h3>
      <ul>
        <li>
          <a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a>
        </li>
        <li>
          <a href="https://forum.vuejs.org" target="_blank" rel="noopener"
          >Forum</a
          >
        </li>
        <li>
          <a href="https://chat.vuejs.org" target="_blank" rel="noopener"
          >Community Chat</a
          >
        </li>
        <li>
          <a href="https://twitter.com/vuejs" target="_blank" rel="noopener"
          >Twitter</a
          >
        </li>
        <li>
          <a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a>
        </li>
      </ul>
      <h3>Ecosystem</h3>
      <ul>
        <li>
          <a href="https://router.vuejs.org" target="_blank" rel="noopener"
          >vue-router</a
          >
        </li>
        <li>
          <a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a>
        </li>
        <li>
          <a
              href="https://github.com/vuejs/vue-devtools#vue-devtools"
              target="_blank"
              rel="noopener"
          >vue-devtools</a
          >
        </li>
        <li>
          <a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener"
          >vue-loader</a
          >
        </li>
        <li>
          <a
              href="https://github.com/vuejs/awesome-vue"
              target="_blank"
              rel="noopener"
          >awesome-vue</a
          >
        </li>
      </ul>
      <button style="margin:20px" v-on:click="connectxmpp">connect xmpp</button>
      <button style="margin:20px" v-on:click="sendmessage">send message</button>
    </div>

    <div v-if="false">
      <quill-editor ref="myTextEditor" v-model="content" :options="editorOption" @change="onEditorChange" style="height:600px;"></quill-editor>
    </div>

    <div>
      <button @click="onAddPara">添加标签</button>
      <chat-input ref="chatInput" v-model="testContent"/>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as XMPP from "stanza";
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import QuillEditor from "@/components/editor.vue";
import ChatInput from "@/components/ChatInput.vue";
let client: any;
export default defineComponent({
  
  name: "HelloWorld",
  components: {ChatInput, QuillEditor},
  data(){
    return{
      content: '',
      testContent: 'dreamsqin',
      editorOption: {
        placeholder: '编辑文章内容'
      },
    }
  },
  props: {
    msg: String,
  },
  methods: {
    onAddPara() {
      const p = document.createElement("p")
      p.innerHTML = "hello"
      p.style.display = 'inline'
      this.testContent = "hello"
      this.$refs.chatInput.insertHtmlAtCaret(p)
    },
    onEditorChange({ editor, html, text }) {
      this.content = html;
      console.log(`onEditorChange html ==> ${html} text ==> ${text}`)
    },
    connectxmpp: function (event: any) {
      alert("sendmessage");
      client = XMPP.createClient({
        jid: "maodi@mxt.westone.com",
        password: "4697932dc27e660cc4f2c1db419b9559",
        resource: "sim",
        // If you have a .well-known/host-meta.json file for your
        // domain, the connection transport config can be skipped.
        transports: {
          websocket: "ws://10.13.6.55:5290",
        },
      });

      client.on("session:started", () => {
        client.getRoster().then((result: any) => {
          console.log("roster result = " + result);
        });
        client.sendPresence();
        // client.sendMessage({
        //   to: "maodi@coap.30san.com",
        //   body: "You sent: from maodi",
        // });
      });

      client.on("connected", () => {
        console.log("connected");
      });

      client.on("disconnected", () => {
        console.log("disconnected");
      });

      client.on("chat", (msg: any) => {
        console.log("chat msg = " + msg);
        client.sendMessage({
          to: msg.from,
          body: "You sent: " + msg.body,
          type: "chat",
        });
      });

      client.on("message:error", (msg: any) => {
        console.log("message error msg = " + msg);
      });

      client.connect();
    },

    sendmessage: function (event: any) {
      client.sendMessage({
        to: "yangjing@mxt.westone.com/sim",
        body: "You sent: from yjing",
        type: "chat",
      });
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
