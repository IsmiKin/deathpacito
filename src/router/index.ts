import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'
// import SignUpForm from '../components/LoginForm.vue'
// import SignUpForm from '@/components/SignUpForm.vue'
import LoginForm from '@/components/LoginForm.vue'
// import Dashboard from '@/components/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // {
    //   path: '/signup',
    //   name: 'signup',
    //   component: SignUpForm,
    //   meta: { requiresGuest: true },
    // },
    {
      path: '/login',
      name: 'login',
      component: LoginForm,
      meta: { requiresGuest: true },
    },
    // {
    //   path: '/dashboard',
    //   name: 'dashboard',
    //   component: Dashboard,
    //   meta: { requiresAuth: true },
    // },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

// Route guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Initialize auth store if not done yet
  if (!authStore.user) {
    await authStore.initialize()
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest)

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
