<script>
import { mapState } from 'vuex';
import { findIndex, includes, get } from 'lodash-es';
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
          url: `/projects/${projectId}/sales-options/`,
          routeNames: [
            'ProjectSalesOptions', 'ProjectVirtualItems',
            'ProjectVirtualCurrency', 'ProjectKeyProductsList',
          ],
          available: true,
        },
        {
          title: 'Webhooks',
          icon: 'IconLabel',
          url: `/projects/${projectId}/webhooks/`,
          routeNames: ['ProjectWebhooks'],
          available: true,
        },
        {
          title: 'Settings',
          icon: 'IconSettings',
          url: `/projects/${projectId}/settings/`,
          routeNames: ['ProjectSettings'],
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

  methods: {
    get,
  },
};
</script>

<template>
<LayoutMainNavInnerBase
  :headTitle="projectPublicName"
  :headStatus="status"
  :headImage="get(project, 'cover.images.en', '')"
  :items="items"
  :currentItemIndex="currentItemIndex"
/>
</template>
