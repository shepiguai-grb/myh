import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'
Vue.use(Router)

//解决冗余导航问题，即有时多次点击某个路由跳转会报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

//路由独享守卫(权限)
function havePower(url) {
  // console.log(store.state.login.user.menus_url)
  //判断用户登录后的权限有哪些
  return store.state.login.user.menus_url.some((i) => { return i == url })
}

const router = new Router({
  routes: [
    {
      path: '/login',
      component: () => import('../pages/login/login'),
    },
    {
      path: '/',
      component: () => import('../pages/index/index'),
      children: [

        {
          path: 'home',
          component: () => import('../pages/home/home'),
        },
        //系统设置
        {
          path: 'caidan',
          component: () => import('../pages/caidan/caidan'),
          beforeEnter(to, from, next) {
            havePower('/caidan') ? next() : next('/home')
          }
        },
        {
          path: 'juese',
          component: () => import('../pages/juese/juese'),
          beforeEnter(to, from, next) {
            havePower('/juese') ? next() : next('/home')
          }
        },
        {
          path: 'guanli',
          component: () => import('../pages/guanli/guanli'),
          beforeEnter(to, from, next) {
            havePower('/guanli') ? next() : next('/home')
          }
        },
        //商城管理
        {
          path: 'spfl',
          component: () => import('../pages/sp_spfl/spfl'),
          beforeEnter(to, from, next) {
            havePower('/spfl') ? next() : next('/home')
          }
        },
        {
          path: 'spgg',
          component: () => import('../pages/sp_spgg/spgg'),
          beforeEnter(to, from, next) {
            havePower('/spgg') ? next() : next('/home')
          }
        },
        {
          path: 'spgl',
          component: () => import('../pages/sp_spgl/spgl'),
          beforeEnter(to, from, next) {
            havePower('/spgl') ? next() : next('/home')
          }
        },
        {
          path: 'hygl',
          component: () => import('../pages/sp_hygl/hygl'),
          beforeEnter(to, from, next) {
            havePower('/hygl') ? next() : next('/home')
          }
        },
        {
          path: 'lbtgl',
          component: () => import('../pages/sp_lbtgl/lbtgl'),
          beforeEnter(to, from, next) {
            havePower('/lbtgl') ? next() : next('/home')
          }
        },
        {
          path: 'mshd',
          component: () => import('../pages/sp_mshd/mshd'),
          beforeEnter(to, from, next) {
            havePower('/mshd') ? next() : next('/home')
          }
        },
        {
          path: "",
          redirect: "home"
        }
      ]
    },
  ]
})

//登陆拦截，即没登录就只能进入登录页面
router.beforeEach((to, form, next) => {
  //如果没登录，前往登录页面就不拦截，直接next()
  if (to.path == '/login') {
    next()
    return
  }
  //如果没登录，去的不是登录页面就要判断，中间层store.user是否有值，有值就代表登陆过了，没值就没登陆过
  if (store.state.login.user) {
    next()
    return
  }
  next('/login')
})

export default router