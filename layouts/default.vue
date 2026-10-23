<template>
  <div class="min-h-screen bg-paper text-ink">
    <LayoutHeader />
    <main class="flex-1 pb-24">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// This layout is used for authenticated pages
// Redirect to login if not authenticated
const authStore = useAuthStore()

onMounted(async () => {
  await authStore.initializeAuth()

  if (!authStore.isAuthenticated) {
    await navigateTo('/login')
  }
})
</script>
