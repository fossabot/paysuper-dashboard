const routes = [
  {
    path: '/',
    component: () => import('@/pages/index.vue'),
  },
  {
    path: '/order/',
    component: () => import('@/pages/order/index.vue'),
    meta: { layout: 'Page', isAuthRequired: true },
    name: 'order',
  },
  {
    path: '/order/:id',
    component: () => import('@/pages/order/_id.vue'),
    meta: { layout: 'Page', isAuthRequired: true },
    name: 'order-card',
  },
  {
    path: '/demo/',
    component: () => import('@/pages/demo.vue'),
  },
  {
    path: '/docs/',
    component: () => import('@/pages/docs.vue'),
  },
  {
    path: '/dashboard/',
    component: () => import('@/pages/dashboard.vue'),
    meta: { layout: 'Page', isAuthRequired: true },
    name: 'dashboard',
  },
  {
    path: '/eula/',
    component: () => import('@/pages/eula.vue'),
  },
  {
    path: '/oauth/',
    component: () => import('@/pages/oauth.vue'),
  },
  {
    path: '/payment_finished/',
    component: () => import('@/pages/payment_finished.vue'),
  },
  {
    path: '/privacy_policy/',
    component: () => import('@/pages/privacy_policy.vue'),
  },
  {
    path: '/login/',
    component: () => import('@/pages/login.vue'),
  },
  {
    path: '/register/',
    component: () => import('@/pages/register.vue'),
  },
  {
    path: '/revenue/',
    component: () => import('@/pages/revenue.vue'),
    meta: { layout: 'Page', isAuthRequired: true },
    name: 'revenue',
  },
  {
    path: '/payout/',
    component: () => import('@/pages/payout.vue'),
    meta: { layout: 'Page', isAuthRequired: true },
  },
  {
    path: '/merchant/',
    component: () => import('@/pages/merchant.vue'),
    meta: { layout: 'Page', isAuthRequired: true },
    name: 'merchant',
  },
  {
    path: '/project/',
    component: () => import('@/pages/project/index.vue'),
    meta: { layout: 'Page', isAuthRequired: true },
    name: 'project',
  },
  {
    path: '/project/add/',
    component: () => import('@/pages/project/add.vue'),
    meta: { layout: 'Page', isAuthRequired: true },
    name: 'project-add',
  },
  {
    path: '/project/:id',
    component: () => import('@/pages/project/_id.vue'),
    meta: { layout: 'Page', isAuthRequired: true },
    name: 'project-card',
  },
];

export default routes;
