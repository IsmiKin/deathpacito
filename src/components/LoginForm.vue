<template>
  <div class="max-w-md mx-auto p-6">
    <Card class="w-full">
      <CardHeader class="text-center">
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <Alert v-if="authStore.error" variant="destructive">
            <AlertDescription>{{ authStore.error }}</AlertDescription>
          </Alert>

          <Button type="submit" class="w-full" :disabled="authStore.isLoading">
            {{ authStore.isLoading ? 'Signing in...' : 'Sign In' }}
          </Button>
        </form>

        <div class="mt-4 text-center">
          <a href="#" class="text-sm text-blue-600 hover:underline"> Forgot your password? </a>
        </div>
      </CardContent>
    </Card>

    <div class="mt-4 text-center">
      <p class="text-sm text-gray-600">
        Don't have an account?
        <router-link to="/signup" class="text-blue-600 hover:underline"> Sign up </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  authStore.clearError()

  if (!email.value || !password.value) {
    authStore.error = 'Please fill in all fields'
    return
  }

  try {
    await authStore.signIn(email.value, password.value)
    router.push('/dashboard')
  } catch (error) {
    console.error('Login error:', error)
  }
}
</script>
