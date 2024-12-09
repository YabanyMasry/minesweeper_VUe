import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './assets/custom.css'; // Import custom CSS

createApp(App).use(router).mount('#app');