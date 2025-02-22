<script>
import { upperFirst } from 'lodash-es';
import EntityManagementModal from '@/components/EntityManagementModal.vue';

export default {
  name: 'UiLangsMainHub',

  components: {
    EntityManagementModal,
  },

  model: {
    prop: 'langs',
    event: 'change',
  },

  props: {
    langs: {
      type: Array,
      default: () => ['en', 'ru'],
    },
  },

  data() {
    return {
      defaultOptionValue: 'en',
      isToReopenAddModal: false,
      isEntityManagementModalOpened: false,
      localizationsModalLangs: [],
      isDeleteModalOpened: false,
      langToDelete: '',
      localizationOptions: [
        { label: 'English', value: 'en' },
        { label: 'Spanish', value: 'es' },
        { label: 'Arabic', value: 'ar' },
        { label: 'Russian', value: 'ru' },
        { label: 'Chinese traditional', value: 'zh-Hant' },
        { label: 'Chinese simplified', value: 'zh-Hans' },
        { label: 'Brazilian portuguese', value: 'pt-BR' },
        { label: 'Portuguese', value: 'pt-PT' },
        { label: 'French', value: 'fr' },
        { label: 'German', value: 'de' },
        { label: 'Italian', value: 'it' },
        { label: 'Polish', value: 'pl' },
        { label: 'Turkish', value: 'tr' },
        { label: 'Greek', value: 'el' },
        { label: 'Korean', value: 'ko' },
        { label: 'Vietnamese', value: 'vi' },
        { label: 'Japanese', value: 'ja' },
        { label: 'Hebrew', value: 'he' },
        { label: 'Tai', value: 'th' },
        { label: 'Czech', value: 'cs' },
        { label: 'Bulgarian', value: 'bg' },
        { label: 'Finnish', value: 'fi' },
        { label: 'Swedish', value: 'sv' },
        { label: 'Danish', value: 'da' },
      ],
    };
  },

  computed: {
    localizationOptionsPrepared() {
      return this.localizationOptions.map((item) => {
        let iconComponent = 'IconLangNoIcon';
        const [name] = item.value.split('-');
        const componentName = `IconLang${upperFirst(name)}`;

        if (this.$options.components[componentName]) {
          iconComponent = componentName;
        }
        return {
          label: `${item.label} (${item.value.toUpperCase()})`,
          value: item.value,
          iconComponent,
        };
      });
    },
  },

  methods: {
    openEntityManagementModal() {
      this.localizationsModalLangs = this.langs.slice();
      this.isEntityManagementModalOpened = true;
    },

    requestDeleteLang(lang) {
      if (lang === this.defaultOptionValue) {
        return;
      }
      this.isDeleteModalOpened = true;
      this.langToDelete = lang;
    },

    requestDeleteLangFromModal(lang) {
      this.langToDelete = lang;
      this.isEntityManagementModalOpened = false;
      this.isToReopenAddModal = true;
      this.isDeleteModalOpened = true;
    },

    deleteLang() {
      this.isDeleteModalOpened = false;

      if (this.isToReopenAddModal) {
        this.isEntityManagementModalOpened = true;
        this.isToReopenAddModal = false;
        const newLangs = this.localizationsModalLangs.filter(item => this.langToDelete !== item);
        this.localizationsModalLangs = newLangs;
      } else {
        const newLangs = this.langs.filter(item => this.langToDelete !== item);
        this.$emit('change', newLangs);
      }
    },

    handleModalSave(newLangs) {
      this.$emit('change', newLangs);
      this.isEntityManagementModalOpened = false;
    },
  },
};
</script>

<template>
<div>
  <UiEntityMainHub
    label="Localization"
    :items="langs"
    :defaultOptionValue="defaultOptionValue"
    @add="openEntityManagementModal"
    @delete="requestDeleteLang"
  />

  <UiDeleteModal
    v-if="isDeleteModalOpened"
    title="Delete localization"
    closeButtonText="Cancel"
    @close="isDeleteModalOpened = false"
    @submit="deleteLang"
  >
    Are you sure you want to delete? All texts and descriptions for this language will be lost.
  </UiDeleteModal>

  <EntityManagementModal
    v-if="isEntityManagementModalOpened"
    v-model="localizationsModalLangs"
    title="Localizations"
    :value="langs"
    :items="localizationOptionsPrepared"
    :defaultOptionValue="defaultOptionValue"
    @close="isEntityManagementModalOpened = false"
    @delete="requestDeleteLangFromModal"
    @save="handleModalSave"
  />
</div>
</template>
