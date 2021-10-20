import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
//Add unimported components to ignore list to prevent warnings.
Vue.config.ignoredElements = ['field','block','category','xml','mutation','value','sep']

import LoadScript from 'vue-plugin-load-script';
Vue.use(LoadScript);
new Vue({
  render: h => h(App),
}).$mount('#app')
