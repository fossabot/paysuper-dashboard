<script>
import { mapState, mapActions } from 'vuex';
import ProjectStore from '@/store/ProjectStore';
import SaveDataWarningModal from '@/components/SaveDataWarningModal.vue';
import { DEFAULT_CURRENCY_IS_NOT_SET } from '@/errors';

export default {
  name: 'ProjectPage',

  components: {
    SaveDataWarningModal,
  },

  async asyncData({
    store, registerStoreModule, route, resources,
  }) {
    try {
      await registerStoreModule('Project', ProjectStore, {
        id: route.params.id,
        name: route.query.name,
        image: route.query.image,
      });
    } catch (error) {
      if (error === DEFAULT_CURRENCY_IS_NOT_SET) {
        store.dispatch('setPageError', 403);
        resources.notifications.showErrorMessage(error);
      } else {
        store.dispatch('setPageError', error);
      }
    }
  },

  data() {
    return {
      isUnsavedDataModalOpened: false,
    };
  },

  computed: {
    ...mapState('Project', ['project']),
  },

  async beforeRouteUpdate(to, from, next) {
    if (to.params.id !== from.params.id) {
      this.setIsLoading(true);
      await this.initState({ id: to.params.id });
      this.setIsLoading(false);
    }
    next();
  },

  methods: {
    ...mapActions(['setIsLoading', 'uploadImage']),
    ...mapActions('Project', [
      'initState',
      'saveProject',
    ]),

    async handleSaveProject(project) {
      this.setIsLoading(true);
      try {
        await this.saveProject(project);
        this.$showSuccessMessage('Project saved successfully');
      } catch (error) {
        this.$showErrorMessage(error);
      }
      this.setIsLoading(false);
    },

    confirmDataSaved() {
      return new Promise((resolve, reject) => {
        this.isUnsavedDataModalOpened = true;
        this.$refs.saveDataWarningModal.$once('submit', (result) => {
          if (result) {
            resolve();
          } else {
            reject();
          }
          this.isUnsavedDataModalOpened = false;
        });
      });
    },
  },
};
</script>

<template>
<div>
  <RouterView
    v-bind="{ confirmDataSaved }"
    @save="handleSaveProject"
  />
  <SaveDataWarningModal
    v-show="isUnsavedDataModalOpened"
    ref="saveDataWarningModal"
  />
</div>
</template>
