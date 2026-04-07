import { createRouter, createWebHistory } from 'vue-router'
import BackendLayout from '@/components/BackendLayout.vue'
import AuthorLayout from '@/components/AuthorLayout.vue'

const backendRoutes = [
  {
    path: '/back',
    redirect: '/back/dataanalysis',
    component: BackendLayout,
    children: [{
      path: 'dataanalysis',
      component: () => import('@/views/Dataanalysis.vue'),
      meta: {
        title: '数据分析',
        icon: 'PieChart'
      }
    },
    {
      path: 'knowledgearticle',
      component: () => import('@/views/Knowledgearticle.vue'),
      meta: {
        title: '知识文章',
        icon: 'ChatLineSquare'
      }
    },
    {
      path: 'consultationrecord',
      component: () => import('@/views/Consultationrecord.vue'),
      meta: {
        title: '咨询记录',
        icon: 'Message'
      }
    },{
      path: 'moodjournal',
      component: () => import('@/views/Moodjournal.vue'),
      meta: {
        title: '情绪日志',
        icon: 'User'
      }
    }
    ]
  }, 
  {
    path:'/author',
    component:AuthorLayout,
    children: [
      {
        path: 'login',
        component: () => import('@/views/Login.vue'),
        meta: {
          title: '登录',
          // icon: 'Login'
        },
      },
      {
        path: 'register',
        component: () => import('@/views/Register.vue'),
        meta: {
          title: '注册',
          // icon: 'Register'
        },
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: backendRoutes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (token) {
    const userInfo = localStorage.getItem('userInfo')
      if(userInfo.usertype===2){
        if(to.path.startsWith('/back')){
          next()
        }else{
          next('/back/dataanalysis')
        }
      }
  } else {
    if(to.path.startsWith('/back')){
      next('/author/login')
    }else{
      next('/author/login')
    }
  }
})