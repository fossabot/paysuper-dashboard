<script>
import { mapState } from 'vuex';
import { findIndex, includes } from 'lodash-es';
import LayoutMainNavInnerBase from '@/components/LayoutMainNavInnerBase.vue';

export default {
  name: 'LayoutMainNavProject',

  components: {
    LayoutMainNavInnerBase,
  },

  computed: {
    ...mapState('Project', ['project', 'projectPublicName']),

    items() {
      const projectId = this.project.id || 'new';
      return [
        {
          title: 'Sales options',
          icon: 'IconMoney',
          url: `/projects/${projectId}/virtual-currency/`,
          routeNames: ['ProjectVirtualCurrency', 'ProjectKeyProductsList'],
          available: true,
        },
        {
          title: 'Settings',
          icon: 'IconSettings',
          url: `/projects/${projectId}/settings/`,
          routeNames: ['ProjectSettings'],
          available: true,
        },
        {
          title: 'Transactions',
          icon: 'IconCoin',
          url: `/projects/${projectId}/transactions/`,
          routeNames: ['ProjectTransactions'],
          available: true,
        },

        // {
        //   icon: 'IconInfo',
        //   link: '',
        //   title: 'About',
        // },
        // {
        //   icon: 'IconSettings',
        //   link: `/projects/${this.project.id}/`,
        //   title: 'Settings',
        //   routeNames: ['ProjectCard'],
        // },
        // {
        //   icon: 'IconLabel',
        //   link: '',
        //   title: 'Webhooks',
        // },
        // {
        //   icon: 'IconMoney',
        //   link: '',
        //   title: 'Sales options',
        // },
        // {
        //   icon: 'IconTwoArrowsToInside',
        //   link: '',
        //   title: 'Testing',
        // },
      ];
    },

    currentItemIndex() {
      return findIndex(this.items, item => includes(item.routeNames, this.$route.name));
    },

    status() {
      if (this.project.status === 4) {
        return 'inactive';
      }
      return 'new';
    },
  },
};
</script>

<template>
<LayoutMainNavInnerBase
  :headTitle="projectPublicName"
  :headStatus="status"
  :headImage="project.image"
  :items="items"
  :currentItemIndex="currentItemIndex"
/>
</template>
