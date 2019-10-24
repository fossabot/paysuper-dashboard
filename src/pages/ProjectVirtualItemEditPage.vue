<script>
import { mapActions, mapState } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import {
  debounce, get, cloneDeep,
} from 'lodash-es';
import ProjectVirtualItemPageStore from '@/store/ProjectVirtualItemPageStore';
import ProjectVirtualItemPrice from '@/components/ProjectVirtualItemPrice.vue';

const DEFAULTS = {
  name: {
    en: '',
    ru: '',
  },
  description: {
    en: '',
    ru: '',
  },
  long_description: {
    en: '',
    ru: '',
  },
  enabled: true,
};

export default {
  name: 'ProjectVirtualItemEditPage',

  components: {
    ProjectVirtualItemPrice,
  },

  props: {
    project: {
      type: Object,
      required: true,
    },
    uploadImage: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      isSkuUnique: true,
      langs: ['en', 'ru'],
      item: null,
      image: null,
    };
  },

  computed: {
    ...mapState('ProjectVirtualItemPage', ['virtualItem']),
    ...mapState('Project', ['currencies']),

    isNewItem() {
      return this.$route.params.itemId === 'new';
    },

    mapCurrencies() {
      return this.currencies.map((name) => {
        let currency = name;
        let region = name;
        if (name.indexOf('-') > -1) {
          [currency, region] = name.split('-');
        }
        return {
          amount: null,
          currency,
          region,
        };
      });
    },

    projectId() {
      return this.$route.params.id;
    },
  },

  validations() {
    return {
      item: {
        name: {
          en: {
            required,
          },
        },
        description: {
          en: {
            required,
          },
        },
        long_description: {
          en: {
            required,
          },
        },
        sku: {
          required,
          uniqueSku() {
            return this.isSkuUnique;
          },
        },
      },
    };
  },

  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('ProjectVirtualItemPage', ProjectVirtualItemPageStore, {
        projectId: route.params.id,
        itemId: route.params.itemId,
      }).catch(this.$showErrorMessage);
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },

  created() {
    if (!this.isNewItem) {
      this.item = this.virtualItem;
    } else {
      this.item = cloneDeep(DEFAULTS);
      this.item.prices = this.mapCurrencies;
      this.item.pricing = 'manual';
    }
    this.image = get(this.item, 'images.0', '');
  },

  methods: {
    ...mapActions(['setIsLoading']),
    ...mapActions('ProjectVirtualItemPage', ['editItem', 'createItem']),
    ...mapActions('Project', ['checkIsSkuUnique']),

    async saveItem() {
      this.$v.$touch();
      let isPricesValid = true;
      if (this.$refs.pricesBlock) {
        isPricesValid = this.$refs.pricesBlock.checkIsValid();
      }
      if (this.$v.$invalid || !isPricesValid) {
        this.$showErrorMessage('The form is not filled right');
        return;
      }
      this.setIsLoading(true);
      const data = {
        ...this.item,
        images: [this.image],
        object: 'product',
        type: 'simple_product',
        default_currency: 'USD',
      };
      try {
        if (this.isNewItem) {
          await this.createItem({ data, projectId: this.projectId });
        } else {
          data.id = this.virtualItem.id;
          await this.editItem({ data, projectId: this.projectId });
        }
        this.$showSuccessMessage('Saved successfully');
        this.$navigate(`/projects/${this.project.id}/virtual-items/`);
      } catch (e) {
        this.$showErrorMessage(e);
      }
      this.setIsLoading(false);
    },

    handleSkuFieldInput: debounce(
      async function handleSkuFieldInput(value) {
        this.isSkuUnique = await this.checkIsSkuUnique(value).catch(this.$showErrorMessage);
        this.$v.item.sku.$touch();
      },
      200,
    ),

    handleUpdatePrice(value) {
      this.item.prices = value;
    },
  },
};
</script>

<template>
  <div>
    <UiPageHeaderFrame>
      <template slot="title">
        {{ virtualItem === null ? 'Adding item' : 'Edit item' }}
      </template>
      <span slot="description">
        Here you can add a new item to your project, specify localised text descriptions,
        prices and currencies, using the tabs.
      </span>
    </UiPageHeaderFrame>

    <UiPanel>
      <section class="section">
        <UiImageUpload
          class="section"
          title="cover"
          description=".png, .jpg, .jpeg, max size 30Mb, min 200x300px; max 1000x1500px"
          :uploadImage="uploadImage"
          v-model="image"
        />
        <UiLangTextField
          v-model="item.name"
          label="Item name"
          v-bind="$getValidatedFieldProps('item.name.en')"
        />
        <UiLangTextField
          v-model="item.description"
          :required="true"
          label="Short description"
          v-bind="$getValidatedFieldProps('item.description.en')"
        />
        <UiLangTextField
          v-model="item.long_description"
          :required="true"
          label="Full description"
          v-bind="$getValidatedFieldProps('item.long_description.en')"
        />

        <p class="text">
          Use SKU to identify this item. Item SKU is unique within parent project.
        </p>
        <UiTextField
          :disabled="!isNewItem"
          label="SKU"
          v-model="item.sku"
          @input="handleSkuFieldInput"
          :required="true"
          v-bind="$getValidatedFieldProps('item.sku')"/>
      </section>
      <section class="section">
        <UiHeader
          :hasMargin="true"
          level="3"
        >
          Item price
        </UiHeader>
        <p class="text">
          Setup the price for one virtual currency unit in all your <br> currencies.
          If you need to add more currencies to the list you can do this in
          <a :href="`/projects/${project.id}/settings/`">project settings</a>.
        </p>

        <ProjectVirtualItemPrice
          ref="pricesBlock"
          :method="item.pricing"
          :prices="item.prices"
          @updatePrice="handleUpdatePrice"/>
      </section>

      <div class="controls">
        <UiSwitchBox v-model="item.enabled">Enabled</UiSwitchBox>
        <UiButton
          class="submit-button"
          @click="saveItem"
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

  & > a {
    color: #3d7bf5;
  }
}

.controls {
  display: flex;
  justify-content: flex-end;

  .submit-button {
    margin-left: 32px;
  }
}

.price-group {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;

  .text-field {
    width: 138px;
    margin-right: 12px;

    &:first-child {
      width: 100%;
    }
  }
}

.region-prices {
  width: 100%;

  & > .ui-header {
    margin-left: 12px;
  }
}
</style>
