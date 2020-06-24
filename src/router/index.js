import Vue from 'vue'
import VueRouter from 'vue-router'

const VideoList = () => import('views/VideoList')
const Login = () => import('views/Login')
const VideoDetail = () => import('views/VideoDetail')
const Actor = () => import('views/Actor')
const videoPlay = () => import('components/Video')
const Layout = () => import('@/layout')

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/video'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/video',
    redirect: '/video/list',
    component: Layout,
    children: [
      {
        path: 'list',
        name: 'VideoList',
        component: VideoList
      },
      {
        path: 'detail/:id',
        name: 'video-detail',
        component: VideoDetail
      }
    ]
  },
  {
    path: '/actor',
    redirect: '/actor/list',
    component: Layout,
    children: [
      {
        path: 'list',
        name: 'ActorList',
        component: Actor
      }
    ]
  },
  {
    path: '/video1',
    name: 'videoPlayer',
    component: videoPlay
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

export default router
