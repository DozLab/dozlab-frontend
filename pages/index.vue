<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Navigation -->
    <nav class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <div class="flex items-center space-x-2">
          <div class="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold">DZ</span>
          </div>
          <span class="text-2xl font-bold text-gray-900">DoZLab</span>
        </div>
        
        <div class="space-x-4">
          <NuxtLink 
            to="/login" 
            class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Sign In
          </NuxtLink>
          <NuxtLink 
            to="/register" 
            class="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
          >
            Get Started
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center">
        <h1 class="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
          Master DevOps with
          <span class="text-blue-600">Hands-On Labs</span>
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Learn DevOps, DevSecOps, and SRE through interactive, terminal-based labs. 
          Practice with real tools in containerized environments.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink 
            to="/register" 
            class="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
          >
            Start Learning Free
          </NuxtLink>
          <NuxtLink 
            to="/labs" 
            class="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
          >
            Explore Labs
          </NuxtLink>
        </div>
      </div>

      <!-- Feature Cards -->
      <div class="mt-20 grid md:grid-cols-3 gap-8">
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Container & Kubernetes</h3>
          <p class="text-gray-600">
            Master Docker, Kubernetes, Helm, and container orchestration with hands-on labs.
          </p>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Security & DevSecOps</h3>
          <p class="text-gray-600">
            Learn security scanning, vulnerability assessment, and DevSecOps practices.
          </p>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div class="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">SRE & Monitoring</h3>
          <p class="text-gray-600">
            Build expertise in monitoring, observability, and site reliability engineering.
          </p>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="mt-20 bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
        <div class="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-3xl font-bold text-blue-600">85+</div>
            <div class="text-gray-600">Interactive Labs</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-green-600">8</div>
            <div class="text-gray-600">Learning Tracks</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-purple-600">100%</div>
            <div class="text-gray-600">Hands-On Learning</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-orange-600">24/7</div>
            <div class="text-gray-600">Lab Access</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="mt-20 border-t border-gray-200 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center">
          <div class="flex items-center justify-center space-x-2 mb-4">
            <div class="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">DZ</span>
            </div>
            <span class="text-xl font-bold text-gray-900">DoZLab</span>
          </div>
          <p class="text-gray-600">
            © 2024 DoZLab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  auth: false
})

const authStore = useAuthStore()

// Redirect to dashboard if already authenticated
onMounted(async () => {
  await authStore.initializeAuth()
  if (authStore.isAuthenticated) {
    await navigateTo('/dashboard')
  }
})
</script>