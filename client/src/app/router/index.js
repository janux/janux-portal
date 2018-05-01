/* eslint-disable */
import Vue from 'vue';
import Router from 'vue-router';
// import ExampleComponent from 'app/example-component/example-component';
import StaffList from 'app/staff/list.vue'
// import StaffCreate from 'app/staff/create'
import StaffEdit from 'app/staff/staff-edit.vue'
import StaffCreate from 'app/staff/staff-create.vue'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'FistComponent',
      component: StaffList
    },
    {
        path: '/staff',
        name: 'staffList',
        component: StaffList
    },
    {
      path: '/staff/create',
      name: 'staffCreate',
      component: StaffCreate
    },
    {
      path: '/staff/edit:id',
      name: 'staffEdit',
      component: StaffEdit,
      props: true
    }
  ]
});
