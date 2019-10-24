<script>
import { find, cloneDeep, mapValues } from 'lodash-es';
import { required } from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';

export default {
  name: 'ProjectVirtualItemPrice',

  props: {
    method: {
      type: String,
      required: true,
    },
    prices: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      priceData: null,
      pricingMethodOptions: {
        real: {
          label: 'Real currency',
          value: 'manual',
          enabled: true,
        },
        virtual: {
          label: 'Virtual currency',
          value: 'currency',
          enabled: false, // TODO: ждем реализацию Virtual currency
        },
      },

      isSteamSuggestOpened: false,

      priceSuggestList: [
        {
          id: 'manual',
          text: 'Continue manual input for all currencies',
        },
        {
          id: 'conversion',
          text: 'Use auto-conversion from default currency',
        },
      ],
    };
  },

  computed: {
    hasRegionPrice() {
      return this.priceData.some(price => price.currency !== price.region);
    },
  },

  validations() {
    return {
      priceData: mapValues(this.priceData, () => ({
        amount: {
          required,
        },
      })),
    };
  },

  created() {
    this.priceData = cloneDeep(this.prices);
  },

  watch: {
    priceData(value) {
      this.$emit('updatePrice', value);
    },
  },

  methods: {
    ...mapActions(['setIsLoading']),
    ...mapActions('ProjectVirtualItemPage', ['getPrices']),

    getCurrencyName(currency) {
      if (this.isDefault(currency)) {
        return 'USD, Default currency';
      }

      if (currency.currency === currency.region) {
        return currency.currency;
      }

      return `${currency.currency}, ${currency.region}`;
    },

    isDefault(currency) {
      return currency.currency === 'USD' && currency.region === 'USD';
    },

    async fillPrice(amount) {
      this.setIsLoading(true);
      const prices = await this.getPrices(amount).catch(this.$showErrorMessage);
      prices.forEach((price) => {
        const item = find(this.priceData, { region: price.region, currency: price.currency });
        if (item) {
          item.amount = price.amount;
        }
      });
      this.setIsLoading(false);
    },

    async handleSuggestClick(item, closeSuggest) {
      if (item.id === 'conversion' && find(this.priceData, price => this.isDefault(price)).amount > 0) {
        await this.fillPrice(find(this.priceData, price => this.isDefault(price)).amount);
      }
      closeSuggest();
    },

    checkIsValid() {
      this.$v.$touch();
      return !this.$v.$invalid;
    },
  },
};
</script>

<template>
<div>
  <div class="radio-group">
    <UiRadio
      class="radio"
      v-model="method"
      v-for="(m, index) in pricingMethodOptions"
      :key="index"
      :disabled="!m.enabled"
      :value="m.value">
      {{ m.label }}
      <IconQuestion fill="#919699" />
    </UiRadio>
  </div>

  <div class="price-group">
    <UiTextField
      v-for="(price, index) in priceData"
      :key="index"
      v-model="price.amount"
      :isNumeric="true"
      :decimalLength="2"
      :label="getCurrencyName(price, index)"
      :required="true"
      v-show="price.region === price.currency"
      v-bind="$getValidatedFieldProps(`priceData[${index}].amount`)"
      @suggestClosed="isSteamSuggestOpened = false"
    >
      <template v-slot:suggest="{ closeSuggest }" v-if="isDefault(price)">
        <div>
          <UiSuggestItem
            v-show="!isSteamSuggestOpened"
            v-for="(item, index) in priceSuggestList"
            :key="index"
            v-text="item.text"
            @click="handleSuggestClick(item, closeSuggest)"
          />
        </div>
      </template>
    </UiTextField>

    <!-- Show prices for regions if available -->
    <div class="region-prices" v-if="hasRegionPrice">
      <UiHeader level="4" :hasMargin="true">Prices for regions</UiHeader>
      <UiTextField
        v-for="(price, index) in priceData"
        :key="index"
        v-model="price.amount"
        :isNumeric="true"
        :decimalLength="2"
        label="Price"
        :required="true"
        v-show="price.region !== price.currency"
        v-bind="$getValidatedFieldProps(`priceData[${index}].amount`)"
      >
        <span slot="label">
        <IconQuestionInCircle class="field-label-icon" />
          {{ getCurrencyName(price, index) }}
        </span>
      </UiTextField>
    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>
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

.radio-group {
  margin: 22px 0 20px;
}

.radio {
  & + & {
    margin-top: 12px;
  }
}
</style>
