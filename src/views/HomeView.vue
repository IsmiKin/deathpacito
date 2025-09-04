<template>
  <div class="max-w-4xl mx-auto px-4 py-16">
    <!-- Authenticated User Welcome -->
    <div v-if="authStore.isAuthenticated" class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome back, {{ userName }}!</h1>
      <p class="text-xl text-gray-600 mb-8">Ready to continue your journey with DeathPacito?</p>

      <div class="flex justify-center space-x-4">
        <router-link to="/dashboard">
          <Button size="lg">Go to Dashboard</Button>
        </router-link>
        <router-link to="/account">
          <Button variant="outline" size="lg">My Account</Button>
        </router-link>
      </div>
    </div>

    <!-- Guest User Welcome -->
    <div v-else class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome to DeathPacito</h1>
      <p class="text-xl text-gray-600 mb-8">
        A modern Vue.js application with multi-step registration and Supabase authentication.
      </p>

      <div class="flex justify-center space-x-4">
        <router-link to="/signup">
          <Button size="lg">Sign Up</Button>
        </router-link>
        <router-link to="/login">
          <Button variant="outline" size="lg">Sign In</Button>
        </router-link>
      </div>
    </div>

    <!-- Features for authenticated users -->
    <div v-if="authStore.isAuthenticated" class="bg-blue-50 rounded-lg p-8 mb-16">
      <h2 class="text-2xl font-semibold mb-6 text-center">Your Account Features</h2>
      <div class="grid md:grid-cols-2 gap-6">
        <div class="flex items-start space-x-3">
          <div
            class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0"
          >
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <div>
            <h4 class="font-medium">Secure Dashboard</h4>
            <p class="text-sm text-gray-600">
              Access your personalized dashboard with account insights
            </p>
          </div>
        </div>
        <div class="flex items-start space-x-3">
          <div
            class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0"
          >
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <div>
            <h4 class="font-medium">Profile Management</h4>
            <p class="text-sm text-gray-600">Update your personal and professional information</p>
          </div>
        </div>
        <div class="flex items-start space-x-3">
          <div
            class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0"
          >
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <div>
            <h4 class="font-medium">Security Settings</h4>
            <p class="text-sm text-gray-600">Manage your account security and authentication</p>
          </div>
        </div>
        <div class="flex items-start space-x-3">
          <div
            class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0"
          >
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <div>
            <h4 class="font-medium">Activity Monitoring</h4>
            <p class="text-sm text-gray-600">Track your account activity and session history</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Call to action for guest users -->
    <div v-else class="text-center">
      <p class="text-gray-600 mb-6">
        Create your account in just a few simple steps with enterprise-grade security.
      </p>
      <router-link to="/signup">
        <Button size="lg" class="px-8"> Create Account </Button>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'

const authStore = useAuthStore()

const userName = computed(() => {
  if (authStore.user?.user_metadata?.first_name) {
    return authStore.user.user_metadata.first_name
  }
  return authStore.user?.email?.split('@')[0] || 'there'
})
</script>
