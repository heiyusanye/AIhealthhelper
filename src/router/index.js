import { createRouter, createWebHistory } from 'vue-router'
import BackendLayout from '@/components/BackendLayout.vue'
import AuthorLayout from '@/components/AuthorLayout.vue'
import FrontendLayout from '@/components/FrontendLayout.vue'


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
    }, {
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
    path: '/author',
    component: AuthorLayout,
    children: [
      {
        path: 'login',
        component: () => import('@/views/Login.vue'),
        meta: {
          title: '登录',
          icon: 'Login'
        },
      },
      {
        path: 'register',
        component: () => import('@/views/Register.vue'),
        meta: {
          title: '注册',
          icon: 'Register'
        },
      }
    ]
  }
]

const frontendRoutes = [
  {
    path: '/',
    component: FrontendLayout,
    children: [{
      path: '',
      component: () => import('@/views/Home.vue')
    }, {
      path: 'consultation',
      component: () => import('@/views/Consultation.vue')
    }, {
      path: 'emotiondiary',
      component: () => import('@/views/EmotionDiary.vue')
    }, {
      path: 'knowledge',
      component: () => import('@/views/Knowledge.vue')
    }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: [...backendRoutes, ...frontendRoutes]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (token) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (userInfo.userType == 2) {
      if (to.path.startsWith('/back')) {
        next()
      } else {
        next('/back/dataanalysis')
      }
    }
    else if (userInfo.userType == 1) {

    }
  } else {
    if (to.path.startsWith('/back')) {
      next('/author/login')
    } else {
      next()
    }
  }
})


export default router
