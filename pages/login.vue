<template>
  <AuthShell
    label="Sign in"
    title="Sign in to DoZLab"
    lede="Access your hands-on DevOps learning environment."
  >
    <form class="space-y-5" @submit.prevent="handleLogin">
      <div>
        <label for="username" class="field-label">Username</label>
        <input
          id="username"
          v-model="form.username"
          name="username"
          type="text"
          autocomplete="username"
          required
          class="input-field"
        >
      </div>
      <div>
        <div class="flex items-baseline justify-between">
          <label for="password" class="field-label">Password</label>
          <ReadyLink to="/forgot-password" :ready="pageReady.forgotPassword" class="text-[0.8125rem] text-subtle hover:text-brand">
            Forgot your password?
          </ReadyLink>
        </div>
        <input
          id="password"
          v-model="form.password"
          name="password"
          type="password"
          autocomplete="current-password"
          required
          class="input-field"
        >
      </div>

      <label class="flex items-center gap-2 text-sm">
        <input
          id="remember-me"
          v-model="form.rememberMe"
          name="remember-me"
          type="checkbox"
          class="size-4"
        >
        Remember me
      </label>

      <p v-if="error" class="notice-error" role="alert">
        {{ error }}
      </p>

      <button type="submit" :disabled="authStore.isLoading" class="btn-primary w-full">
        {{ authStore.isLoading ? 'Signing in…' : 'Sign in' }}
      </button>

      <p class="border-t border-line pt-5 text-sm text-subtle">
        Don't have an account?
        <NuxtLink to="/register" class="lx-link ml-1">
          Sign up →
        </NuxtLink>
      </p>
    </form>
  </AuthShell>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  auth: false
})

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  username: '',
  password: '',
  rememberMe: false
})

const error = ref('')

const handleLogin = async () => {
  error.value = ''

  try {
    await authStore.login({
      username: form.username,
      password: form.password
    })

    await router.push(homePath)
  } catch (err) {
    error.value = (err as Error).message || 'Invalid username or password'
  }
}

// Redirect if already authenticated
onMounted(async () => {
  if (authStore.isAuthenticated) {
    await router.push(homePath)
  }
})
</script>
