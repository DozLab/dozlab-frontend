// Pages that are built enough to use. A page listed as false keeps its code in pages/;
// its buttons and links stay on screen but greyed out and not clickable (ReadyLink),
// and opening its address goes to homePath instead. Set it to true once the page works.
export const pageReady = {
  dashboard: false, // pages/dashboard.vue is only a heading
  labs: false, // pages/labs.vue (Lab Catalog) is only a heading
  profile: false, // pages/profile.vue is only a heading
  admin: false, // there is no pages/admin.vue
  forgotPassword: false, // the API has no password reset route
  terms: false, // there are no Terms of Service or Privacy Policy pages
  notifications: false // the header's bell: there are no notifications yet
} as const

// Where signed-in people land: My VMs is the one page that works end to end today
export const homePath = '/vms'

export const hiddenPaths: Record<string, boolean> = {
  '/dashboard': pageReady.dashboard,
  '/labs': pageReady.labs,
  '/profile': pageReady.profile,
  '/admin': pageReady.admin,
  '/forgot-password': pageReady.forgotPassword
}
