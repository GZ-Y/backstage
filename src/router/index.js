import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
//以懒加载的方式引入
const Login = ()=> import('@/views/Login')
const Detail = ()=> import('@/views/Detail')
const Main = ()=> import('@/views/Main')
const Users = ()=> import('@/components/Users')
const Rights = ()=> import('@/components/jurisdiction/Rights')
const Roles = ()=> import('@/components/jurisdiction/Roles')
const Cate = ()=> import('@/components/commodity/Cate')
const Params = ()=> import('@/components/commodity/Params')
const Goods = ()=> import('@/components/commodity/Goods')
const GoodsAdd = ()=> import('@/components/commodity/GoodsAdd')
const Orders = ()=> import('@/components/commodity/Orders')
const Reports = ()=> import('@/components/commodity/Reports')

const routes = [
  {path:'/',redirect:'/login'},
  {path:'/login',component:Login},
  {path:'/detail',component:Detail,redirect:'/main',
  children:[
    {path:'/main',component:Main},
    {path:'/users',component:Users},
    {path:'/rights',component:Rights},
    {path:'/roles',component:Roles},
    {path:'/categories',component:Cate},
    {path:'/params',component:Params},
    {path:'/goods',component:Goods},
    {path:'/goods/add',component:GoodsAdd},
    {path:'/orders',component:Orders},
    {path:'/reports',component:Reports},
  ]},
]

const router = new VueRouter({
  routes,
  mode:'history'
})

//这个导航守卫要写在router实例的下面
router.beforeEach((to,from,next)=>{
  if(to.path === '/login') return next();
  const valiToken = window.sessionStorage.getItem('token');
  if(!valiToken) return next('/login');
  next()

})

//重复点击路由报错解决
const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}


export default router
