import Vue from 'vue'
import VueResource from 'vue-resource'

const API_ROOT = "./static/api/index.php";
// const API_ROOT = "http://maimangyinyue.com/api/index.php";
// const API_ROOT = "http://127.0.0.1/api/index.php";

Vue.use(VueResource);
Vue.http.options.emulateJSON = true;
export const getResource = Vue.resource(API_ROOT);
export const postResource = Vue.resource(API_ROOT);
