<script>
import { required } from 'vuelidate/lib/validators';
import { mapKeys, mapValues, findKey } from 'lodash-es';
import PriceSuggestTable from '@/components/PriceSuggestTable.vue';
import { getCurrencyValueFromItem } from '@/helpers/currencyDataConversion';

export default {
  name: 'ProjectKeyProductPriceBlock',
  components: {
    PriceSuggestTable,
  },
  props: {
    platforms: {
      required: true,
      type: Array,
    },
    currencies: {
      required: true,
      type: Array,
    },
    defaultCurrency: {
      required: true,
      type: Object,
    },
    recommendedPricesTable: {
      required: true,
      type: Array,
    },
  },

  data() {
    return {
      currentPlatformPricingIndex: 0,
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
        {
          id: 'steam',
          text: 'Select Steam recommended prices',
        },
      ],
    };
  },

  computed: {
    defaultCurrencyValue() {
      return getCurrencyValueFromItem(this.defaultCurrency);
    },
    currentPlatformPricing() {
      return this.platforms[this.currentPlatformPricingIndex];
    },

    priceModel() {
      return mapKeys(this.currentPlatformPricing.prices, item => getCurrencyValueFromItem(item));
    },

    currenciesPrimary() {
      return this.currencies
        .filter(item => item.currency === item.region)
        .filter(item => getCurrencyValueFromItem(item) !== this.defaultCurrencyValue);
    },
    currenciesSecondary() {
      return this.currencies.filter(item => item.currency !== item.region);
    },

    platformsForTabs() {
      return this.platforms.map((item, index) => {
        const { $invalid, $dirty } = this.$v.platforms.$each[index];
        return {
          label: item.name,
          value: item.id,
          hasError: $dirty && $invalid,
        };
      });
    },
  },

  watch: {
    platforms(value) {
      const lastIndex = value.length - 1;
      if (this.currentPlatformPricingIndex > lastIndex) {
        this.currentPlatformPricingIndex = lastIndex;
      }
    },
  },

  validations() {
    return {
      platforms: {
        $each: {
          prices: {
            $each: {
              amount: {
                required,
              },
            },
          },
        },
      },
      priceModel: mapValues(this.priceModel, () => ({
        amount: {
          required,
        },
      })),
    };
  },

  methods: {
    handleSuggestClick(item, closeSuggest) {
      if (item.id === 'steam') {
        this.isSteamSuggestOpened = true;
      } else if (item.id === 'conversion') {
        this.$emit('fillConvertedPrices', {
          platformId: this.currentPlatformPricing.id,
          amount: this.priceModel[this.defaultCurrencyValue].amount,
          closeSuggest,
        });
      } else {
        closeSuggest();
      }
    },
    handleSteamPriceSelect(amount, closeSuggest) {
      this.$emit('fillSteamPrices', {
        platformId: this.currentPlatformPricing.id,
        amount,
        closeSuggest,
      });
    },

    checkIsValid() {
      this.$v.$touch();

      const index = findKey(this.$v.platforms.$each.$iter, { $invalid: true });
      if (index) {
        this.currentPlatformPricingIndex = Number(index);
      }
      return !this.$v.$invalid;
    },

    getPriceId(item) {
      return getCurrencyValueFromItem(item);
    },
  },
};
</script>

<template>
<div>
  <UiTabs
    class="tabs"
    :items="platformsForTabs"
    v-model="currentPlatformPricingIndex"
  />

  <UiTextField
    :label="`${defaultCurrencyValue}, Default currency`"
    autocomplete="new-password"
    :isNumeric="true"
    :decimalLength="2"
    v-bind="$getValidatedFieldProps(`priceModel[${defaultCurrencyValue}].amount`)"
    v-model="priceModel[defaultCurrencyValue].amount"
    @suggestClosed="isSteamSuggestOpened = false"
  >
    <template v-slot:suggest="{ closeSuggest }">
      <div>
        <PriceSuggestTable
          v-show="isSteamSuggestOpened"
          :items="recommendedPricesTable"
          @close="closeSuggest"
          @select="handleSteamPriceSelect($event, closeSuggest)"
        />
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
  <div class="currencies">
    <UiTextField
      v-for="(item, index) in currenciesPrimary"
      :label="item.currency"
      :key="index"
      :isNumeric="true"
      :decimalLength="2"
      v-bind="$getValidatedFieldProps(`priceModel[${getPriceId(item)}].amount`)"
      v-model="priceModel[`${getPriceId(item)}`].amount"
      autocomplete="off"
    />
  </div>
  <template v-if="currenciesSecondary.length">
    <UiHeader level="4" :hasMargin="true">Prices for regions</UiHeader>
    <div class="currencies">
      <UiTextField
        v-for="(item, index) in currenciesSecondary"
        :key="index"
        :required="true"
        :isNumeric="true"
        :decimalLength="2"
        v-bind="$getValidatedFieldProps(`priceModel[${getPriceId(item)}].amount`)"
        v-model="priceModel[`${getPriceId(item)}`].amount"
        autocomplete="off"
      >
        <span slot="label">
          <IconQuestionInCircle class="field-label-icon" />
          {{ `${item.region}, ${item.currency}` }}
        </span>
      </UiTextField>
    </div>
  </template>
</div>
</template>

<style lang="scss" scoped>
.tabs {
  margin-bottom: 28px;
}
.currencies {
  display: flex;
  flex-wrap: wrap;

  & > * {
    width: 18%;
    margin-right: 2%;
  }
}
.field-label-icon {
  position: absolute;
  margin: 1px 0 0 -16px;
  cursor: pointer;
}
</style>
