<template>
  <!-- Not rendered yet; its link is greyed out: the API has no password reset route (composables/pages.ts) -->
  <AuthShell
    label="Reset password"
    title="Reset your password"
    lede="Enter your email address and we'll send you a reset link."
  >
    <form v-if="!success" class="space-y-5" @submit.prevent="handleReset">
      <div>
        <label for="email" class="field-label">Email address</label>
        <input
          id="email"
          v-model="form.email"
          name="email"
          type="email"
          autocomplete="email"
          required
          class="input-field"
        >
      </div>

      <p v-if="error" class="notice-error" role="alert">
        {{ error }}
      </p>

      <button type="submit" :disabled="isLoading" class="btn-primary w-full">
        {{ isLoading ? 'Sending…' : 'Send reset link' }}
      </button>

      <p class="border-t border-line pt-5 text-sm">
        <NuxtLink to="/login" class="lx-link">
          ← Back to sign in
        </NuxtLink>
      </p>
    </form>

    <div v-else class="space-y-5">
      <p class="notice-ok" role="status">
        We've sent a password reset link to <strong>{{ form.email }}</strong>.
      </p>
      <p class="text-sm text-subtle">
        Didn't receive the email? Check your spam folder or
        <button class="underline hover:text-brand" @click="handleReset">
          try again
        </button>.
      </p>
      <NuxtLink to="/login" class="btn-secondary w-full">
        Back to sign in
      </NuxtLink>
    </div>
  </AuthShell>
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
    // TODO: the API has no password reset route yet
    await useApi()('/auth/forgot-password', {
      method: 'POST',
      body: { email: form.email }
    })

    success.value = true
  } catch (err) {
    error.value = (err as Error).message || 'Failed to send reset email'
  } finally {
    isLoading.value = false
  }
}
</script>
