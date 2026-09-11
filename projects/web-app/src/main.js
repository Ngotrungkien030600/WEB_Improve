import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import { initAuth } from './utils/auth-store.js';
import './utils/chunk-reload.js';
import './styles/main.css';

initAuth();

const app = createApp(App);
app.use(router);
app.mount('#app');
