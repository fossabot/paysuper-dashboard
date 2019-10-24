export default function getMerchantMainNavItems({ hasMerchant }) {
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
      unavailableReason: 'Need to start signing agreement',
      icon: 'IconFolder',
      link: '/projects',
      title: 'Projects',
      routeNames: ['ProjectsList'],
      isAvailable: hasMerchant,
    },
    {
      additional: 'Your weekly royalty reports',
      icon: 'IconBlank',
      link: '/reports',
      title: 'Reports',
      isAvailable: false,
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
      link: '/transaction',
      title: 'Transaction Search',
      isAvailable: false,
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
