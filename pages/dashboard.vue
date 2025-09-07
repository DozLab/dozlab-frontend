<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Welcome Section -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">
        Welcome back, {{ authStore.fullName || 'Student' }}!
      </h1>
      <p class="mt-2 text-gray-600">
        Continue your DevOps learning journey
      </p>
    </div>

    <!-- Quick Actions -->
    <div class="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center">
          <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900">{{ labsStore.labs.length }}</h3>
            <p class="text-gray-600">Available Labs</p>
          </div>
        </div>
        <div class="mt-4">
          <NuxtLink to="/labs" class="text-blue-600 hover:text-blue-500 font-medium">
            Browse Labs →
          </NuxtLink>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center">
          <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900">{{ completedLabsCount }}</h3>
            <p class="text-gray-600">Completed Labs</p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-gray-500">{{ completionPercentage }}% complete</span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center">
          <div class="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900">{{ labsStore.activeSessions.length }}</h3>
            <p class="text-gray-600">Active Sessions</p>
          </div>
        </div>
        <div class="mt-4" v-if="labsStore.activeSessions.length > 0">
          <NuxtLink 
            :to="`/workspace/${labsStore.activeSessions[0].id}`" 
            class="text-yellow-600 hover:text-yellow-500 font-medium"
          >
            Resume Session →
          </NuxtLink>
        </div>
        <div class="mt-4" v-else>
          <span class="text-gray-500">No active sessions</span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center">
          <div class="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900">{{ totalTimeSpent }}</h3>
            <p class="text-gray-600">Time Spent</p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-gray-500">This month</span>
        </div>
      </div>
    </div>

    <!-- Recent Labs & Continue Learning -->
    <div class="grid lg:grid-cols-2 gap-8">
      <!-- Continue Learning -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Continue Learning</h2>
          
          <div v-if="inProgressLabs.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <p class="text-gray-500 mb-4">No labs in progress</p>
            <NuxtLink to="/labs" class="btn-primary">
              Start a New Lab
            </NuxtLink>
          </div>

          <div v-else class="space-y-4">
            <div 
              v-for="lab in inProgressLabs.slice(0, 3)" 
              :key="lab.id"
              class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div class="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span class="text-white font-bold text-sm">{{ lab.name[0] }}</span>
              </div>
              
              <div class="ml-4 flex-1">
                <h3 class="text-sm font-medium text-gray-900">{{ lab.name }}</h3>
                <p class="text-sm text-gray-500">{{ lab.category }} • {{ lab.difficulty }}</p>
                <div class="mt-2">
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full" :style="`width: ${lab.progress || 0}%`"></div>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">{{ lab.progress || 0 }}% complete</p>
                </div>
              </div>
              
              <div class="ml-4">
                <button 
                  @click="continueLabSession(lab)"
                  class="btn-primary"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommended Labs -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Recommended for You</h2>
          
          <div class="space-y-4">
            <div 
              v-for="lab in recommendedLabs.slice(0, 3)" 
              :key="lab.id"
              class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div class="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span class="text-white font-bold text-sm">{{ lab.name[0] }}</span>
              </div>
              
              <div class="ml-4 flex-1">
                <h3 class="text-sm font-medium text-gray-900">{{ lab.name }}</h3>
                <p class="text-sm text-gray-500">{{ lab.category }} • {{ lab.difficulty }}</p>
                <p class="text-sm text-gray-600 mt-1">{{ lab.estimatedTime }} min</p>
              </div>
              
              <div class="ml-4">
                <NuxtLink 
                  :to="`/labs/${lab.id}`"
                  class="btn-secondary"
                >
                  View Lab
                </NuxtLink>
              </div>
            </div>
          </div>
          
          <div class="mt-6">
            <NuxtLink to="/labs" class="text-blue-600 hover:text-blue-500 font-medium">
              View All Labs →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Learning Progress Chart -->
    <div class="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h2>
      
      <div class="grid md:grid-cols-3 gap-6">
        <!-- Progress by Category -->
        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-3">By Category</h3>
          <div class="space-y-3">
            <div v-for="category in categories" :key="category.name" class="flex items-center">
              <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm text-gray-600">{{ category.name }}</span>
                  <span class="text-sm text-gray-900">{{ category.completed }}/{{ category.total }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-blue-600 h-2 rounded-full" 
                    :style="`width: ${(category.completed / category.total * 100)}%`"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-3">Recent Activity</h3>
          <div class="space-y-3">
            <div v-for="activity in recentActivity.slice(0, 5)" :key="activity.id" class="flex items-center text-sm">
              <div class="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
              <span class="text-gray-600">{{ activity.description }}</span>
            </div>
          </div>
        </div>

        <!-- Achievement Badges -->
        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-3">Recent Achievements</h3>
          <div class="grid grid-cols-3 gap-3">
            <div v-for="badge in achievements.slice(0, 6)" :key="badge.id" class="text-center">
              <div class="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-1">
                <span class="text-yellow-600 text-lg">{{ badge.icon }}</span>
              </div>
              <span class="text-xs text-gray-600">{{ badge.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const labsStore = useLabsStore()

// Mock data - replace with actual API calls
const completedLabsCount = ref(12)
const totalTimeSpent = ref('24h')

const inProgressLabs = ref([
  {
    id: '1',
    name: 'Docker Fundamentals',
    category: 'Container',
    difficulty: 'beginner',
    progress: 65
  },
  {
    id: '2',
    name: 'Kubernetes Networking',
    category: 'Kubernetes',
    difficulty: 'intermediate',
    progress: 30
  }
])

const recommendedLabs = ref([
  {
    id: '3',
    name: 'Helm Chart Development',
    category: 'Kubernetes',
    difficulty: 'intermediate',
    estimatedTime: 45
  },
  {
    id: '4',
    name: 'Container Security Scanning',
    category: 'Security',
    difficulty: 'advanced',
    estimatedTime: 60
  },
  {
    id: '5',
    name: 'Prometheus Monitoring',
    category: 'SRE',
    difficulty: 'intermediate',
    estimatedTime: 90
  }
])

const categories = ref([
  { name: 'Container & K8s', completed: 8, total: 15 },
  { name: 'CI/CD', completed: 3, total: 8 },
  { name: 'Security', completed: 1, total: 12 },
  { name: 'SRE', completed: 0, total: 10 }
])

const recentActivity = ref([
  { id: 1, description: 'Completed Docker Fundamentals lab' },
  { id: 2, description: 'Started Kubernetes Networking lab' },
  { id: 3, description: 'Earned "Container Expert" badge' },
  { id: 4, description: 'Completed Jenkins Pipeline lab' },
  { id: 5, description: 'Started Helm Chart lab' }
])

const achievements = ref([
  { id: 1, name: 'First Lab', icon: '🎯' },
  { id: 2, name: 'Week Streak', icon: '🔥' },
  { id: 3, name: 'Container Pro', icon: '📦' },
  { id: 4, name: 'Fast Learner', icon: '⚡' },
  { id: 5, name: 'Night Owl', icon: '🦉' },
  { id: 6, name: 'Explorer', icon: '🗺️' }
])

const completionPercentage = computed(() => {
  if (labsStore.labs.length === 0) return 0
  return Math.round((completedLabsCount.value / labsStore.labs.length) * 100)
})

const continueLabSession = async (lab: any) => {
  try {
    // Check if there's an existing session for this lab
    const existingSession = labsStore.sessions.find(s => s.labId === lab.id && s.status === 'running')
    
    if (existingSession) {
      await navigateTo(`/workspace/${existingSession.id}`)
    } else {
      // Create new session
      const session = await labsStore.createSession(lab.id)
      await navigateTo(`/workspace/${session.id}`)
    }
  } catch (error) {
    console.error('Failed to continue lab session:', error)
  }
}

// Initialize data
onMounted(async () => {
  try {
    await Promise.all([
      labsStore.fetchLabs(),
      labsStore.fetchSessions()
    ])
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  }
})
</script>