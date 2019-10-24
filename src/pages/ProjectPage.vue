<script>
import { cloneDeep, isEqual } from 'lodash-es';
import { mapState, mapActions } from 'vuex';
import ProjectStore from '@/store/ProjectStore';
import SaveDataWarningModal from '@/components/SaveDataWarningModal.vue';

export default {
  name: 'ProjectCard',

  components: {
    SaveDataWarningModal,
  },

  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('Project', ProjectStore, {
        id: route.params.id,
        name: route.query.name,
        image: route.query.image,
      });
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },

  data() {
    return {
      projectLocal: null,
      defaultStep: 'settings',
      currentStep: '',
      routNextCallback: null,

      isUnsavedDataModalOpened: false,
    };
  },

  computed: {
    ...mapState('Project', ['project', 'currencies']),
  },

  async beforeRouteUpdate(to, from, next) {
    if (to.params.id !== from.params.id) {
      this.setIsLoading(true);
      await this.initState({ id: to.params.id });
      this.updateProjectLocal();
      this.setIsLoading(false);
    }
    next();
  },

  async beforeRouteLeave(to, from, next) {
    if (isEqual(this.project, this.projectLocal)) {
      next();
      return;
    }
    try {
      await this.confirmDataSaved();
      next(false);
      this.handleSaveProject();
    } catch (error) {
      next();
    }
  },

  created() {
    this.updateProjectLocal();
  },

  methods: {
    ...mapActions(['setIsLoading', 'uploadImage']),
    ...mapActions('Project', [
      'initState',
      'saveProject',
    ]),

    updateProjectLocal() {
      this.projectLocal = cloneDeep(this.project);
    },

    async handleSaveProject() {
      this.setIsLoading(true);
      try {
        await this.saveProject(this.projectLocal);
        this.updateProjectLocal();
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
    v-bind="{
      uploadImage,
      project: projectLocal,
    }"
    @save="handleSaveProject"
  />
  <SaveDataWarningModal
    v-show="isUnsavedDataModalOpened"
    ref="saveDataWarningModal"
  />
</div>
</template>
