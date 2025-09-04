<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1>Pika</h1>
    <Card class="w-full">
      <CardHeader>
        <div class="flex justify-between items-center">
          <div>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Welcome to your dashboard</CardDescription>
          </div>
          <Button @click="handleLogout" variant="outline"> Sign Out </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div v-if="authStore.user">
            <h3 class="text-lg font-semibold mb-2">User Information</h3>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p><strong>Email:</strong> {{ authStore.user.email }}</p>
              <p><strong>User ID:</strong> {{ authStore.user.id }}</p>
              <p><strong>Created:</strong> {{ formatDate(authStore.user.created_at) }}</p>
            </div>
          </div>

          <div v-if="userProfile">
            <h3 class="text-lg font-semibold mb-2">Profile Information</h3>
            <div class="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><strong>Name:</strong> {{ userProfile.firstName }} {{ userProfile.lastName }}</p>
              <p><strong>Phone:</strong> {{ userProfile.phone }}</p>
              <p><strong>Company:</strong> {{ userProfile.company }}</p>
              <p><strong>Position:</strong> {{ userProfile.position }}</p>
              <p><strong>Experience:</strong> {{ userProfile.experience }}</p>
            </div>
          </div>

          <Alert v-if="error" variant="destructive">
            <AlertDescription>{{ error }}</AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { apiService } from '@/services/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

const router = useRouter()
const authStore = useAuthStore()

const userProfile = ref(null)
const error = ref<string | null>(null)

const handleLogout = async () => {
  try {
    await authStore.signOut()
    router.push('/login')
  } catch (err) {
    console.error('Logout error:', err)
  }
}

const loadUserProfile = async () => {
  if (!authStore.user) return

  try {
    const profile = await apiService.getUserProfile(authStore.user.id)
    userProfile.value = profile
  } catch (err: any) {
    console.error('Failed to load user profile:', err)
    // Don't show error if profile doesn't exist yet
    if (err.response?.status !== 404) {
      error.value = 'Failed to load user profile'
    }
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

onMounted(() => {
  loadUserProfile()
})
</script>
