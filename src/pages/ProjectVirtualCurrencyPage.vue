<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { cloneDeep } from 'lodash-es';
import { required } from 'vuelidate/lib/validators';
import PictureLetterGLandscape from '@/components/PictureLetterGLandscape.vue';
import TestingTag from '@/components/TestingTag.vue';

export default {
  name: 'ProjectVirtualCurrencyPage',
  components: {
    PictureLetterGLandscape,
    TestingTag,
  },

  data() {
    return {
      projectLocal: null,
      image: '',
      virtualCurrencyName: {
        en: '',
        ru: '',
      },
      successfulMessage: {
        en: '',
        ru: '',
      },
      singleUnitPrice: {
        USD: 0,
        EUR: 0,
      },
    };
  },

  computed: {
    ...mapState('Project', ['project']),
    ...mapGetters('Project', ['currenciesTags', 'defaultCurrencyValue']),
  },

  validations: {
    virtualCurrencyName: {
      en: {
        required,
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

  methods: {
    ...mapActions(['uploadImage']),

    updateProjectLocal() {
      this.projectLocal = cloneDeep(this.project);
    },

    handleSave() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.$emit('save', this.projectLocal);
    },
  },
};
</script>

<template>
<div>
  <UiPageHeaderFrame>
    <template slot="title">
      Virtual currency
      <TestingTag class="tag" />
    </template>
    <span slot="description">
      Virtual Currency is an option to sell your in-game currency — gold, coins, etc.
      This method allows you to sell customisable quantity of your currency.
      Integration webhook testing is obligatory requirement for this sales option.
    </span>
    <PictureLetterGLandscape slot="picture" />
  </UiPageHeaderFrame>

  <UiPanel>
    <section class="section">
      <UiImageUpload
        class="section"
        title="logo"
        description="200x200 px, .png, .jpg"
        :uploadImage="uploadImage"
        v-model="image"
      />
      <UiLangTextField
        :value="virtualCurrencyName"
        :langs="projectLocal.localizations"
        label="Virtual currency name"
        v-bind="$getValidatedFieldProps('virtualCurrencyName.en')"
      />
      <UiLangTextField
        :value="successfulMessage"
        :langs="projectLocal.localizations"
        label="Custom message on successful payment"
      />
    </section>

    <section class="section">
      <UiHeader
        :hasMargin="true"
        level="3"
      >
        Pricing
      </UiHeader>
      <p class="text">
        Setup the price for one virtual currency unit in all your <br> currencies.
        If you need to add more currencies to the list you can do this in
        <a :href="`/projects/${project.id}/settings/`">project settings</a>.
      </p>

      <div class="radio-group">
        <UiRadio class="radio" :disabled="true">
          Currency conversion
          <IconQuestion fill="#919699" />
        </UiRadio>
        <UiRadio class="radio">
          Manual input
          <IconQuestion fill="#919699" />
        </UiRadio>
        <UiRadio class="radio">
          Default currency only
          <IconQuestion fill="#919699" />
        </UiRadio>
      </div>
      <UiLangTextField
        :value="singleUnitPrice"
        :langs="currenciesTags"
        :isNumeric="true"
        :decimalLength="2"
        label="Virtual currency single unit price"
        v-bind="$getValidatedFieldProps(`singleUnitPrice.${defaultCurrencyValue}`)"
      />
    </section>

    <section class="section">
      <p class="text">
        Choose maximal and minimal limits of virtual currency
        for a single purchase.
      </p>
      <UiTextField
        :value="1"
        label="Minimum purchase value"
        :isNumeric="true"
      />
      <UiTextField
        :value="100"
        label="Maximum purchase value"
        :isNumeric="true"
      />
    </section>

    <section class="section">
      <p class="text">
        Choose if your in-game currency may sell fractionally
        (for example: 1,58) or as an integral number (1, 2, 5 etc).
      </p>
      <div class="radio-group">
        <UiRadio class="radio">Fractional value</UiRadio>
        <UiRadio class="radio">Integral value</UiRadio>
      </div>
    </section>

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

.text {
  width: 416px;
  margin-bottom: 12px;

  a {
    color: #3d7bf5;
  }
}

.radio-group {
  margin: 22px 0 20px;
}

.radio {
  & + & {
    margin-top: 12px;
  }
}

.controls {
  display: flex;
  justify-content: flex-end;
}

.submit-button {
  width: 140px;
}

.tag {
  top: -8px;
  margin-left: 8px;
}
</style>
