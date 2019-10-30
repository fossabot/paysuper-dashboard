<script>
import { mapState } from 'vuex';
import { findIndex, includes } from 'lodash-es';
import LayoutTopControlsMenuBase from '@/components/LayoutTopControlsMenuBase.vue';

export default {
  name: 'LayoutTopControlsProjectSalesOptions',

  components: {
    LayoutTopControlsMenuBase,
  },

  computed: {
    ...mapState('Project', ['project']),

    items() {
      const projectId = this.project.id || 'new';
      return [
        {
          title: 'General',
          url: `/projects/${projectId}/sales-options/`,
          routeNames: ['ProjectSalesOptions'],
        },
        {
          title: 'Virtual currency',
          url: `/projects/${projectId}/virtual-currency/`,
          routeNames: ['ProjectVirtualCurrency'],
        },
        {
          title: 'Virtual items',
          url: `/projects/${projectId}/virtual-items/`,
          routeNames: ['ProjectVirtualItems'],
        },
        {
          title: 'Game keys',
          url: `/projects/${projectId}/game-keys`,
          routeNames: ['ProjectKeyProductsList'],
        },
      ];
    },

    currentItemIndex() {
      return findIndex(this.items, item => includes(item.routeNames, this.$route.name));
    },
  },
};
</script>

<template>
<LayoutTopControlsMenuBase v-bind="{ items, currentItemIndex }" />
</template>
