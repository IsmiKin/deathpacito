<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Verifying access...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <Card class="max-w-md">
        <CardHeader>
          <CardTitle class="text-red-600">Access Denied</CardTitle>
          <CardDescription>{{ error }}</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <Alert variant="destructive">
              <AlertDescription> You don't have permission to access this page. </AlertDescription>
            </Alert>
            <div class="flex space-x-2">
              <Button @click="$router.push('/')" variant="outline" class="flex-1"> Go Home </Button>
              <Button @click="$router.push('/login')" class="flex-1"> Sign In </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Success state - render the protected content -->
    <slot v-else-if="hasAccess" />

    <!-- Fallback state -->
    <div v-else class="min-h-screen flex items-center justify-center">
      <Card class="max-w-md">
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>Please sign in to access this page</CardDescription>
        </CardHeader>
        <CardContent>
          <Button @click="$router.push('/login')" class="w-full"> Sign In </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Props {
  requiresEmailVerification?: boolean
  requiresProfileComplete?: boolean
  allowedRoles?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  requiresEmailVerification: false,
  requiresProfileComplete: false,
  allowedRoles: () => [],
})

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const isLoading = ref(true)
const error = ref<string | null>(null)

const hasAccess = computed(() => {
  if (!authStore.isAuthenticated) {
    return false
  }

  // Check email verification requirement
  if (props.requiresEmailVerification && !authStore.user?.email_confirmed_at) {
    error.value = 'Email verification required'
    return false
  }

  // Check profile completion requirement
  if (props.requiresProfileComplete) {
    const hasCompletedProfile = authStore.user?.user_metadata?.profile_completed
    if (!hasCompletedProfile) {
      error.value = 'Profile completion required'
      return false
    }
  }

  // Check role-based access
  if (props.allowedRoles.length > 0) {
    const userRole = authStore.user?.user_metadata?.role || 'user'
    if (!props.allowedRoles.includes(userRole)) {
      error.value = 'Insufficient permissions'
      return false
    }
  }

  // Check if token is expired
  if (authStore.isTokenExpired(0)) {
    error.value = 'Session expired'
    return false
  }

  return true
})

const checkAccess = async () => {
  isLoading.value = true
  error.value = null

  try {
    // Wait a bit to ensure auth store is initialized
    await new Promise((resolve) => setTimeout(resolve, 100))

    // If not authenticated, redirect to login
    if (!authStore.isAuthenticated) {
      router.push({
        name: 'login',
        query: { redirect: route.fullPath },
      })
      return
    }

    // Additional checks are handled by the computed property
    if (!hasAccess.value && error.value) {
      // Handle specific errors
      if (error.value === 'Email verification required') {
        // Could redirect to email verification page
        console.warn('Email verification required')
      } else if (error.value === 'Profile completion required') {
        // Could redirect to profile completion
        router.push({
          name: 'signup',
          query: { step: '2' },
        })
        return
      } else if (error.value === 'Session expired') {
        // Try to refresh the token
        try {
          await authStore.refreshToken()
          error.value = null
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError)
          router.push({
            name: 'login',
            query: { redirect: route.fullPath },
          })
          return
        }
      }
    }
  } catch (err: any) {
    console.error('Access check error:', err)
    error.value = 'Failed to verify access permissions'
  } finally {
    isLoading.value = false
  }
}

// Watch for authentication state changes
watch(
  () => authStore.isAuthenticated,
  (newVal) => {
    if (!newVal) {
      router.push({
        name: 'login',
        query: { redirect: route.fullPath },
      })
    }
  },
  { immediate: false },
)

// Watch for token expiration
watch(
  () => authStore.isTokenExpired(5),
  (isExpiring) => {
    if (isExpiring && authStore.isAuthenticated) {
      console.warn('Token is expiring soon, attempting refresh...')
      authStore.refreshToken().catch(() => {
        console.error('Failed to refresh token')
      })
    }
  },
)

onMounted(() => {
  checkAccess()
})
</script>
