<template>
  <div id="app">
    <nav class="bg-secondary shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center">
              <img alt="Vue logo" class="h-8 w-8" src="@/assets/images/logo_circular.svg" />
              <span class="ml-2 text-xl font-semibold text-gray-900">DeathPacito</span>
            </router-link>
          </div>

          <div class="flex items-center space-x-4">
            <template v-if="authStore.isAuthenticated">
              <router-link
                to="/dashboard"
                class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </router-link>
              <Button @click="handleSignOut" variant="outline" size="sm"> Sign Out </Button>
            </template>
            <template v-else>
              <router-link
                to="/login"
                class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </router-link>
              <router-link to="/signup">
                <Button size="sm">Sign Up</Button>
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <main class="min-h-screen bg-gray-50">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'

const authStore = useAuthStore()
const router = useRouter()

const handleSignOut = async () => {
  try {
    await authStore.signOut()
    router.push('/')
  } catch (error) {
    console.error('Sign out error:', error)
  }
}

onMounted(async () => {
  await authStore.initialize()
})
</script>

<style scoped>
.router-link-active {
  color: #3b82f6;
  font-weight: 600;
}
</style>
