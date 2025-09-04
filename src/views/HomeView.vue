<template>
  <div class="max-w-4xl mx-auto px-4 py-16">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome to DeathPacito</h1>
      <p class="text-xl text-gray-600 mb-8">
        A modern Vue.js application with multi-step registration and Supabase authentication.
      </p>

      <div class="flex justify-center space-x-4">
        <template v-if="authStore.isAuthenticated">
          <router-link to="/dashboard">
            <Button size="lg">Go to Dashboard</Button>
          </router-link>
        </template>
        <template v-else>
          <router-link to="/signup">
            <Button size="lg">Get Started</Button>
          </router-link>
          <router-link to="/login">
            <Button variant="outline" size="lg">Sign In</Button>
          </router-link>
        </template>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-8 mb-16">
      <div class="text-center p-6">
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            ></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold mb-2">Multi-Step Registration</h3>
        <p class="text-gray-600">Easy 3-step registration process with Supabase authentication.</p>
      </div>

      <div class="text-center p-6">
        <div
          class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4"
        >
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            ></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold mb-2">Secure Authentication</h3>
        <p class="text-gray-600">
          Built with Supabase for secure user authentication and management.
        </p>
      </div>

      <div class="text-center p-6">
        <div
          class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4"
        >
          <svg
            class="w-6 h-6 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            ></path>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold mb-2">Modern UI</h3>
        <p class="text-gray-600">
          Beautiful interface built with Vue 3, TypeScript, and Shadcn UI.
        </p>
      </div>
    </div>

    <div v-if="!authStore.isAuthenticated" class="text-center">
      <h2 class="text-2xl font-semibold mb-4">Ready to get started?</h2>
      <p class="text-gray-600 mb-6">Create your account in just a few simple steps.</p>
      <router-link to="/signup">
        <Button size="lg" class="px-8"> Create Account </Button>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'

const authStore = useAuthStore()
</script>
