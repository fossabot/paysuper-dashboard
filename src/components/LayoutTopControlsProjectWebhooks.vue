<script>
import { mapState } from 'vuex';
import { findIndex, includes } from 'lodash-es';
import LayoutTopControlsMenuBase from '@/components/LayoutTopControlsMenuBase.vue';

export default {
  name: 'LayoutTopControlsProjectWebhooks',

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
          url: `/projects/${projectId}/webhooks/`,
          routeNames: ['ProjectWebhooks'],
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
