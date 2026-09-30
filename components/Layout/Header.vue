<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and main nav -->
        <div class="flex">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <NuxtLink to="/dashboard" class="flex items-center space-x-2">
              <div class="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">DZ</span>
              </div>
              <span class="text-xl font-bold text-gray-900">DoZLab</span>
            </NuxtLink>
          </div>
          
          <!-- Desktop navigation -->
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <NuxtLink
              to="/dashboard"
              class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors"
              active-class="border-blue-500 text-blue-600"
            >
              Dashboard
            </NuxtLink>
            <NuxtLink
              to="/labs"
              class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors"
              active-class="border-blue-500 text-blue-600"
            >
              Lab Catalog
            </NuxtLink>
            <NuxtLink
              v-if="labsStore.currentSession"
              :to="`/workspace/${labsStore.currentSession.id}`"
              class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors"
              active-class="border-blue-500 text-blue-600"
            >
              Workspace
            </NuxtLink>
            <NuxtLink
              v-if="authStore.isAdmin"
              to="/admin"
              class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors"
              active-class="border-blue-500 text-blue-600"
            >
              Admin
            </NuxtLink>
          </div>
        </div>
        
        <!-- Right side: notifications, user menu -->
        <div class="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
          <!-- Notifications -->
          <button
            type="button"
            class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span class="sr-only">View notifications</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 19H6c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h8l6 6v8c0 1.1-.9 2-2 2z" />
            </svg>
          </button>
          
          <!-- Profile dropdown -->
          <div class="relative">
            <button
              @click="showUserMenu = !showUserMenu"
              class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span class="sr-only">Open user menu</span>
              <div class="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span class="text-white font-medium text-sm">
                  {{ authStore.user?.firstName?.[0] || authStore.user?.username?.[0] || 'U' }}
                </span>
              </div>
            </button>
            
            <!-- Dropdown menu -->
            <div
              v-if="showUserMenu"
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
              @click="showUserMenu = false"
            >
              <div class="px-4 py-2 border-b border-gray-200">
                <p class="text-sm font-medium text-gray-900">{{ authStore.fullName }}</p>
                <p class="text-sm text-gray-500">{{ authStore.user?.email }}</p>
              </div>
              
              <NuxtLink
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Your Profile
              </NuxtLink>
              
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
        
        <!-- Mobile menu button -->
        <div class="sm:hidden flex items-center">
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <span class="sr-only">Open main menu</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!showMobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div v-if="showMobileMenu" class="sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <NuxtLink
            to="/dashboard"
            class="bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            active-class="bg-blue-50 border-blue-500 text-blue-700"
            inactive-class="border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
          >
            Dashboard
          </NuxtLink>
          
          <NuxtLink
            to="/labs"
            class="border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            active-class="bg-blue-50 border-blue-500 text-blue-700"
          >
            Lab Catalog
          </NuxtLink>
          
          <NuxtLink
            v-if="labsStore.currentSession"
            :to="`/workspace/${labsStore.currentSession.id}`"
            class="border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            active-class="bg-blue-50 border-blue-500 text-blue-700"
          >
            Workspace
          </NuxtLink>
        </div>
        
        <div class="pt-4 pb-3 border-t border-gray-200">
          <div class="flex items-center px-4">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span class="text-white font-medium">
                  {{ authStore.user?.firstName?.[0] || authStore.user?.username?.[0] || 'U' }}
                </span>
              </div>
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">{{ authStore.fullName }}</div>
              <div class="text-sm font-medium text-gray-500">{{ authStore.user?.email }}</div>
            </div>
          </div>
          
          <div class="mt-3 space-y-1">
            <NuxtLink
              to="/profile"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              Your Profile
            </NuxtLink>
            
            <button
              @click="handleLogout"
              class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const labsStore = useLabsStore()
const router = useRouter()

const showUserMenu = ref(false)
const showMobileMenu = ref(false)

const handleLogout = async () => {
  await authStore.logout()
  showUserMenu.value = false
  showMobileMenu.value = false
}

// Close dropdowns when clicking outside
onMounted(() => {
  document.addEventListener('click', (event) => {
    const target = event.target as Element
    if (!target.closest('.relative')) {
      showUserMenu.value = false
    }
  })
})
</script>