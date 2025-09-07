<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-xl">DZ</span>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you a reset link
        </p>
      </div>
      
      <form v-if="!success" class="mt-8 space-y-6" @submit.prevent="handleReset">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            id="email"
            v-model="form.email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your email address"
          />
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isLoading">Send Reset Link</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          </button>
        </div>

        <div class="text-center">
          <NuxtLink to="/login" class="font-medium text-blue-600 hover:text-blue-500">
            ← Back to sign in
          </NuxtLink>
        </div>
      </form>

      <div v-if="success" class="mt-8 text-center space-y-4">
        <div class="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-medium text-gray-900">Check your email</h3>
          <p class="mt-2 text-sm text-gray-600">
            We've sent a password reset link to <strong>{{ form.email }}</strong>
          </p>
          <p class="mt-2 text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or 
            <button @click="handleReset" class="text-blue-600 hover:text-blue-500 underline">
              try again
            </button>
          </p>
        </div>
        <div class="pt-4">
          <NuxtLink 
            to="/login" 
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to sign in
          </NuxtLink>
        </div>
      </div>

      <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  auth: false
})

const form = reactive({
  email: ''
})

const isLoading = ref(false)
const error = ref('')
const success = ref(false)

const handleReset = async () => {
  error.value = ''
  isLoading.value = true
  
  try {
    // TODO: Implement actual API call for password reset
    await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: form.email }
    })
    
    success.value = true
  } catch (err: any) {
    error.value = err.message || 'Failed to send reset email'
  } finally {
    isLoading.value = false
  }
}
</script>