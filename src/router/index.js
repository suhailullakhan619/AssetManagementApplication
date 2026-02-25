import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/MainHomePages/LoginPage.vue'

const routes = [
  {
    path: '/',
    name: 'LoginPage',
    component: LoginPage,
  },
  {
    path: '/LandingPage',
    name: 'LandingPage',
    component: () => import('../views/MainHomePages/LandingPage.vue'),
    children:[
  {
    path:'/Admin',
    name:'AdminPage',
    component:()=>import('@/views/ChildHomePages/AdminPage.vue')
  },
  {
    path:'/Organization',
    name:'Organization',
    component:()=>import('@/views/ChildHomePages/OrgnizationPage.vue')
  },
  {
    path:'/Users',
    name:'UserPage',
    component:()=>import('@/views/ChildHomePages/UsersPage.vue')
  },
   {
    path:'/Roles',
    name:'RolesPage',
    component:()=>import('@/views/ChildHomePages/RolesPage.vue')
  },{
    path:'/UserProfile',
    name:'userProfile',
    component:()=>import('@/views/ChildHomePages/UserUpdatePage.vue')
  },
  {
path:'/Category',
name:'CategoryPage',
component:()=>import('@/views/ChildHomePages/CategoryPage.vue'),
// children:[
//   {
// path:':parentId',
// name:'CategoryPage-child',
// component:()=>import('@/views/ChildHomePages/CategoryPage.vue'),
// props:true
//   }
// ]
  },{
path:'/Manufacture',
name:'ManufacturePage',
component:()=>import('@/views/ChildHomePages/ManufacturePage.vue')
  },
  {
path:'/Supplier',
name:'SupplierPage',
component:()=>import('@/views/ChildHomePages/SupplierPage.vue')
  },
  {
path:'/Asset',
name:'AssetPage',
component:()=>import('@/views/ChildHomePages/AssetPage.vue')
  },
   {
    path:'/AdminRestapi',
    name:'AdminRestapi',
    component:()=>import('@/views/RestApiPages/AdminRestapiPage.vue')
  },
  {
    path:'/OrganizationRestapi',
    name:'OrganizationRestapi',
    component:()=>import('@/views/RestApiPages/OrganizationRestapiPage.vue')
  },
  {
    path:'/UsersRestapi',
    name:'UsersRestapi',
    component:()=>import('@/views/RestApiPages/UserRestapiPage.vue')
  },
   {
    path:'/RolesRestapi',
    name:'RolesRestapi',
    component:()=>import('@/views/RestApiPages/RolesRestapiPage.vue')
  },{
    path:'/UserProfileRestapi',
    name:'UserProfileRestapi',
    component:()=>import('@/views/RestApiPages/UserprofileRestapiPage.vue')
  },
  {
path:'/CategoryRestapi',
name:'CategoryRestapi',
component:()=>import('@/views/RestApiPages/CategoryRestapiPage.vue')
  }
    ]
  },
  {
    path:'/:pathMatch(.*)*',
    name:'page not found',
    component:()=>import('@/views/ChildHomePages/PageNotFound.vue')

  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
