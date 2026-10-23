<template>
  <AuthShell
    label="Create account"
    title="Create your DoZLab account"
    lede="Start your DevOps learning journey today."
  >
    <form v-if="!success" class="space-y-5" @submit.prevent="handleRegister">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="firstName" class="field-label">First name</label>
          <input
            id="firstName"
            v-model="form.firstName"
            name="firstName"
            type="text"
            autocomplete="given-name"
            class="input-field"
          >
        </div>
        <div>
          <label for="lastName" class="field-label">Last name</label>
          <input
            id="lastName"
            v-model="form.lastName"
            name="lastName"
            type="text"
            autocomplete="family-name"
            class="input-field"
          >
        </div>
      </div>

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
        <label for="email" class="field-label">Email</label>
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

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label for="password" class="field-label">Password</label>
          <input
            id="password"
            v-model="form.password"
            name="password"
            type="password"
            autocomplete="new-password"
            required
            class="input-field"
          >
        </div>
        <div>
          <label for="confirmPassword" class="field-label">Confirm password</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            name="confirmPassword"
            type="password"
            autocomplete="new-password"
            required
            class="input-field"
          >
        </div>
      </div>
      <p class="-mt-2 text-[0.8125rem] text-subtle">
        At least 6 characters.
      </p>

      <label class="flex items-start gap-2 text-sm">
        <input
          id="terms"
          v-model="form.acceptTerms"
          name="terms"
          type="checkbox"
          required
          class="mt-0.5 size-4"
        >
        <span>
          I agree to the
          <!-- Greyed out until the pages exist (composables/pages.ts) -->
          <ReadyLink to="/terms" :ready="pageReady.terms" class="underline hover:text-brand">Terms of Service</ReadyLink>
          and
          <ReadyLink to="/privacy" :ready="pageReady.terms" class="underline hover:text-brand">Privacy Policy</ReadyLink>
        </span>
      </label>

      <p v-if="error" class="notice-error" role="alert">
        {{ error }}
      </p>

      <button type="submit" :disabled="authStore.isLoading" class="btn-primary w-full">
        {{ authStore.isLoading ? 'Creating account…' : 'Create account' }}
      </button>

      <p class="border-t border-line pt-5 text-sm text-subtle">
        Already have an account?
        <NuxtLink to="/login" class="lx-link ml-1">
          Sign in →
        </NuxtLink>
      </p>
    </form>

    <p v-else class="notice-ok" role="status">
      {{ success }}
    </p>
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
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const error = ref('')
const success = ref('')

const handleRegister = async () => {
  error.value = ''
  success.value = ''

  // Validation
  if (form.password !== form.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  if (form.password.length < 6) {
    error.value = 'Password must be at least 6 characters long'
    return
  }

  if (!form.acceptTerms) {
    error.value = 'You must accept the terms of service'
    return
  }

  try {
    await authStore.register({
      username: form.username,
      email: form.email,
      password: form.password,
      firstName: form.firstName || undefined,
      lastName: form.lastName || undefined
    })

    success.value = 'Account created successfully! Please sign in.'

    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err) {
    error.value = (err as Error).message || 'Failed to create account'
  }
}

// Redirect if already authenticated
onMounted(async () => {
  if (authStore.isAuthenticated) {
    await router.push(homePath)
  }
})
</script>
