<template>
  <div class="min-h-screen bg-paper text-ink">
    <!-- Navigation -->
    <header class="lx-chrome sticky top-0 z-40">
      <nav aria-label="Main" class="page-frame flex h-16 items-center justify-between">
        <span class="text-[0.9375rem] font-semibold tracking-tight">DoZLab</span>
        <div class="flex items-center gap-5">
          <NuxtLink to="/login" class="text-sm text-subtle transition-colors hover:text-ink">
            Sign In
          </NuxtLink>
          <NuxtLink to="/register" class="lx-link text-sm">
            Get Started →
          </NuxtLink>
        </div>
      </nav>
    </header>

    <!-- Hero -->
    <section class="page-frame pt-16 pb-20 md:pt-28 md:pb-32">
      <h1 class="display lx-rise max-w-5xl text-5xl sm:text-7xl lg:text-8xl">
        Master DevOps with
        <span class="text-brand">Hands-On Labs</span>
      </h1>
      <div class="mt-10 grid gap-8 md:grid-cols-12">
        <p class="lx-rise lx-rise-2 text-lg text-subtle text-pretty md:col-span-6 md:col-start-5">
          Learn DevOps, DevSecOps, and SRE through interactive, terminal-based labs.
          Practice with real tools in containerized environments.
        </p>
        <div class="lx-rise lx-rise-3 flex flex-wrap gap-3 md:col-span-6 md:col-start-5">
          <NuxtLink to="/register" class="btn-primary">
            Start Learning Free
          </NuxtLink>
          <ReadyLink to="/labs" :ready="pageReady.labs" class="btn-secondary">
            Explore Labs
          </ReadyLink>
        </div>
      </div>
    </section>

    <!-- What the labs cover -->
    <section class="page-frame">
      <div class="lx-section">
        <p class="lx-label">
          Tracks
        </p>
        <dl class="lx-body border-t border-line md:border-t-0">
          <div
            v-for="track in tracks"
            :key="track.title"
            class="grid gap-1 border-b border-line py-6 first:pt-0 sm:grid-cols-8 sm:gap-6"
          >
            <dt class="text-xl font-medium tracking-tight sm:col-span-3">
              {{ track.title }}
            </dt>
            <dd class="text-subtle text-pretty sm:col-span-5">
              {{ track.text }}
            </dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- Footer -->
    <footer class="page-frame mt-16 flex flex-col gap-2 border-t border-line py-10 text-sm text-subtle sm:flex-row sm:justify-between">
      <span class="font-semibold text-ink">DoZLab</span>
      <span>© 2024 DoZLab. All rights reserved.</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  auth: false
})

const tracks = [
  {
    title: 'Container & Kubernetes',
    text: 'Master Docker, Kubernetes, Helm, and container orchestration with hands-on labs.'
  },
  {
    title: 'Security & DevSecOps',
    text: 'Learn security scanning, vulnerability assessment, and DevSecOps practices.'
  },
  {
    title: 'SRE & Monitoring',
    text: 'Build expertise in monitoring, observability, and site reliability engineering.'
  }
]

const authStore = useAuthStore()

// Signed-in people go straight to the app
onMounted(async () => {
  await authStore.initializeAuth()
  if (authStore.isAuthenticated) {
    await navigateTo(homePath)
  }
})
</script>
