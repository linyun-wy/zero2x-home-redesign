import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '../views/home-view/index.vue';
import DataResourceView from '../views/DataResourceView.vue';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/data', name: 'data', component: DataResourceView },
  ],
  scrollBehavior(to, _from, saved) {
    if (saved) return saved;
    if (to.hash) {
      return { selector: to.hash };
    }
    return { x: 0, y: 0 };
  },
});
