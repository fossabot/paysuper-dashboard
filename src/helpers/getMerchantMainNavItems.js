export default function getMerchantMainNavItems({ hasDefaultCurrency }) {
  return [
    {
      additional: 'Homepage for main controls',
      icon: 'IconDashboard',
      link: '/dashboard',
      title: 'Dashboard',
      routeNames: ['Dashboard'],
      isAvailable: true,
    },
    {
      additional: 'Organise your products for sales',
      unavailableReason: 'Need to fill banking info first',
      icon: 'IconFolder',
      link: '/projects',
      title: 'Projects',
      routeNames: ['ProjectsList'],
      isAvailable: hasDefaultCurrency,
    },
    {
      additional: 'Weekly royalty reports',
      icon: 'IconBlank',
      link: '/reports',
      title: 'Royalty reports',
      routeNames: ['RoyaltyReportsPage'],
      isAvailable: true,
    },
    {
      additional: 'Need license agreement',
      icon: 'IconCash',
      link: '/payouts',
      title: 'Payouts',
      isAvailable: false,
    },
    {
      additional: 'Full list of customer transactions',
      icon: 'IconCoin',
      link: '/transactions',
      title: 'Transaction Search',
      routeNames: ['TransactionsPage'],
      isAvailable: true,
    },
    {
      additional: 'Technical integrations',
      icon: 'IconRepeat',
      link: '/intagrations',
      title: 'Intagrations',
      isAvailable: false,
    },
    {
      additional: 'Need license agreement',
      icon: 'IconExcited',
      link: '/customers',
      title: 'Customers',
      isAvailable: false,
    },
  ];
}
