import * as Vue from "vue";

// COMPONENTS
import App from "./App.vue";
import router from "./router";

// STYLES
import "./assets/scss/index.scss";

const app = Vue.createApp(App);

app.use(router);
app.mount("#app");
