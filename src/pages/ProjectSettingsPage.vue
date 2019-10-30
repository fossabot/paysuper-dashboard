<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { cloneDeep, isEqual } from 'lodash-es';
import { required } from 'vuelidate/lib/validators';
import updateLangFields from '@/helpers/updateLangFields';

export default {
  name: 'ProjectSettingsPage',

  props: {
    confirmDataSaved: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      projectLocal: null,
    };
  },

  computed: {
    ...mapState('Project', ['project', 'langFields', 'defaultCurrency']),
    ...mapGetters('Project', ['defaultCurrencyValue']),
  },

  validations: {
    projectLocal: {
      name: {
        en: {
          required,
        },
      },
    },
  },

  watch: {
    project() {
      this.updateProjectLocal();
    },
  },

  created() {
    this.updateProjectLocal();
  },

  async beforeRouteLeave(to, from, next) {
    if (isEqual(this.project, this.projectLocal)) {
      next();
      return;
    }
    try {
      await this.confirmDataSaved();
      next(false);
      this.handleSave();
    } catch (error) {
      next();
    }
  },

  methods: {
    ...mapActions(['uploadImage']),
    updateProjectLocal() {
      this.projectLocal = cloneDeep(this.project);
    },

    updateLangs(langs) {
      this.projectLocal.localizations = langs;
      updateLangFields(this.projectLocal, this.langFields, langs);
    },

    handleSave() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.$emit('save', this.projectLocal);
      }
    },
  },
};
</script>

<template>
<div>
  <UiPageHeaderFrame>
    <span slot="title">Settings</span>
    <span slot="description">
      Setup main scope of project parameters here.
    </span>
  </UiPageHeaderFrame>

  <UiPanel>
    <UiHeader
      :hasMargin="true"
      level="3"
    >
      Localizations
    </UiHeader>
    <UiText indentBottom="small">
      Choose complete set of supported languages for all products and descriptions.
    </UiText>
    <UiLangsMainHub
      :langs="projectLocal.localizations"
      @change="updateLangs"
    />
  </UiPanel>

  <UiPanel>
    <UiSwitchBox
      class="localization-switch"
      v-model="projectLocal.cover.use_one_for_all"
    >
      Use single cover for all localizations
    </UiSwitchBox>

    <UiLangsImageUpload
      class="section"
      :langs="projectLocal.localizations"
      :uploadImage="uploadImage"
      :isLocalizationEnabled="!projectLocal.cover.use_one_for_all"
      v-model="projectLocal.cover.images"
    />

    <div class="section">
      <UiHeader
        :hasMargin="true"
        level="3"
      >
        Project description
      </UiHeader>
      <UiText>
        Fill-in the unique name and localised project descriptions here.
        It will be mentioned in payment form and different customer correspondence.
      </UiText>
      <UiLangTextField
        :value="projectLocal.name"
        :langs="projectLocal.localizations"
        label="Project name"
        v-bind="$getValidatedFieldProps('projectLocal.name.en')"
      />
      <UiLangTextField
        :value="projectLocal.full_description"
        :langs="projectLocal.localizations"
        label="Full description"
      />
      <UiLangTextField
        :value="projectLocal.short_description"
        :langs="projectLocal.localizations"
        label="Short description"
      />
    </div>

    <div class="section">
      <UiHeader
        :hasMargin="true"
        level="3"
      >
        Currencies
      </UiHeader>
      <UiText indentBottom="small">
        Choose a fixed set of currencies which will be actual for all products in this project.
        <span class="bold">{{ defaultCurrencyValue }} is default currency</span>.
      </UiText>

      <UiCurrenciesMainHub
        v-model="projectLocal.currencies"
        :defaultCurrency="defaultCurrency"
      />
    </div>

    <div class="controls">
      <UiButton
        class="submit-button"
        @click="handleSave"
        text="SAVE"
      />
    </div>
  </UiPanel>
</div>
</template>

<style lang="scss" scoped>
.section {
  margin-bottom: 32px;
}

.localization-switch {
  margin-bottom: 20px;
}

.switch-box {
  margin-left: 16px;
}

.bold {
  font-weight: 500;
}

.generate-button {
  margin-left: 30px;
}
.controls {
  display: flex;
  justify-content: flex-end;
}

.submit-button {
  width: 140px;
}
</style>
