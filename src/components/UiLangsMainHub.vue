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
        { label: 'Английский', value: 'en' },
        { label: 'Испанский', value: 'es' },
        { label: 'Арабский', value: 'ar' },
        { label: 'Русский', value: 'ru' },
        { label: 'Традиционный китайский', value: 'zh-Hant' },
        { label: 'Упрощенный китайский', value: 'zh-Hans' },
        { label: 'Бразильский португальский', value: 'pt-BR' },
        { label: 'Португальский', value: 'pt-PT' },
        { label: 'Французский', value: 'fr' },
        { label: 'Немецкий', value: 'de' },
        { label: 'Итальянский', value: 'it' },
        { label: 'Польский', value: 'pl' },
        { label: 'Турецкий', value: 'tr' },
        { label: 'Греческий', value: 'el' },
        { label: 'Корейский', value: 'ko' },
        { label: 'Вьетнамский', value: 'vi' },
        { label: 'Японский', value: 'ja' },
        { label: 'Иврит', value: 'he' },
        { label: 'Тайский', value: 'th' },
        { label: 'Чешский', value: 'cs' },
        { label: 'Болгарский', value: 'bg' },
        { label: 'Финский', value: 'fi' },
        { label: 'Шведский', value: 'sv' },
        { label: 'Датский', value: 'da' },
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
