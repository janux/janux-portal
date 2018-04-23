/* eslint-disable */
import Vue from 'vue';
import Router from 'vue-router';
import ExampleComponent from 'app/example-component/example-component';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'FistComponent',
      component: ExampleComponent
    }
  ]
});
