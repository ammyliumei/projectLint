import { createApp } from "vue";
import "./style.css";
import "ant-design-vue/dist/antd.css"; // or 'ant-design-vue/dist/antd.less'
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { Button, Menu } from "ant-design-vue";
let app = createApp(App);
app.use(Button).use(Menu).use(router).use(store).mount("#app");
