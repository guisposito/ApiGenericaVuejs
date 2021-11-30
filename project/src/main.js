import Vue from 'vue';
import App from './App.vue';
import router from './routes/router';
import "./plugins/bootstrap-vue";
import './plugins/simple-alert';
import './plugins/v-mask';



Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
