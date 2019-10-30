<script>
import { mapGetters } from 'vuex';
import EntityManagementModal from '@/components/EntityManagementModal.vue';
import { getCurrencyItemFromValue, getCurrencyValueFromItem } from '@/helpers/currencyDataConversion';

export default {
  name: 'UiCurrenciesMainHub',

  components: {
    EntityManagementModal,
  },

  model: {
    prop: 'currencies',
    event: 'change',
  },

  props: {
    currencies: {
      type: Array,
      default: () => [{ currency: 'USD', region: 'USD' }],
    },
    defaultCurrency: {
      type: Object,
      default: () => ({ currency: 'USD', region: 'USD' }),
    },
  },

  data() {
    return {
      isToReopenAddModal: false,
      isEntityManagementModalOpened: false,
      localizationsModalCurrencies: [],
      isDeleteModalOpened: false,
      currencyToDelete: '',
    };
  },

  computed: {
    ...mapGetters('Dictionaries', ['currenciesWithRegions']),

    currenciesValues() {
      return this.currencies.map(item => getCurrencyValueFromItem(item));
    },

    defaultCurrencyValue() {
      return getCurrencyValueFromItem(this.defaultCurrency);
    },

    selectOptions() {
      const result = this.currenciesWithRegions.map((item) => {
        if (item.currency === item.region) {
          return {
            value: item.currency,
            label: `${this.$t(`currencies.${item.currency}`)} (${item.currency})`,
          };
        }
        return {
          value: `${item.currency}-${item.region}`,
          label: `${this.$t(`currencies.${item.currency}`)} ${item.region} (${item.currency})`,
        };
      });
      return [
        {
          value: 'USD',
          label: 'American Dollar (USD)',
        },
        ...result,
      ];
    },
  },

  methods: {
    openEntityManagementModal() {
      this.localizationsModalCurrencies = this.currenciesValues.slice();
      this.isEntityManagementModalOpened = true;
    },

    requestDeleteCurrency(currency) {
      if (currency === this.defaultCurrencyValue) {
        return;
      }
      this.isDeleteModalOpened = true;
      this.currencyToDelete = currency;
    },

    requestDeleteCurrencyFromModal(currency) {
      this.currencyToDelete = currency;
      this.isEntityManagementModalOpened = false;
      this.isToReopenAddModal = true;
      this.isDeleteModalOpened = true;
    },

    deleteCurrency() {
      this.isDeleteModalOpened = false;

      if (this.isToReopenAddModal) {
        this.isEntityManagementModalOpened = true;
        this.isToReopenAddModal = false;
        this.localizationsModalCurrencies = this.localizationsModalCurrencies
          .filter(item => this.currencyToDelete !== item);
      } else {
        const newCurrencies = this.currencies
          .filter(item => this.currencyToDelete !== getCurrencyValueFromItem(item));
        this.$emit('change', newCurrencies);
      }
    },

    handleModalSave(currencies) {
      const newCurrencies = currencies.map(item => getCurrencyItemFromValue(item));
      this.isEntityManagementModalOpened = false;
      this.$emit('change', newCurrencies);
    },
  },
};
</script>

<template>
<div>
  <UiEntityMainHub
    label="Currencies"
    :items="currenciesValues"
    :defaultOptionValue="defaultCurrencyValue"
    @add="openEntityManagementModal"
    @delete="requestDeleteCurrency"
  />

  <UiDeleteModal
    v-if="isDeleteModalOpened"
    title="Delete currency"
    closeButtonText="Cancel"
    @close="isDeleteModalOpened = false"
    @submit="deleteCurrency"
  >
    Are you sure you want to delete? All values for this currency will be lost.
  </UiDeleteModal>

  <EntityManagementModal
    v-if="isEntityManagementModalOpened"
    v-model="localizationsModalCurrencies"
    title="Select currencies"
    :value="currenciesValues"
    :items="selectOptions"
    :defaultOptionValue="defaultCurrencyValue"
    @close="isEntityManagementModalOpened = false"
    @delete="requestDeleteCurrencyFromModal"
    @save="handleModalSave"
  />
</div>
</template>
