<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { debounce, find } from 'lodash-es';
import { format } from 'date-fns';
import Notifications from '@/mixins/Notifications';
import TaxesByPeriodStore from '@/store/TaxesByPeriodStore';
import NoResults from '@/components/NoResults.vue';

export default {
  name: 'TaxesCardDetailsPage',
  mixins: [Notifications],
  components: {
    NoResults,
  },
  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('TaxesByPeriod', TaxesByPeriodStore, {
        id: route.params.periodId,
        query: route.query,
      });
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },
  data() {
    return {
      filters: {},
      isSearchRouting: false,
    };
  },
  computed: {
    ...mapState('TaxesByCountry', ['countryTaxes']),
    ...mapState('TaxesByPeriod', ['periodId', 'periodTaxes', 'query']),
    ...mapGetters('TaxesByPeriod', ['getFilterValues']),

    period() {
      return find(this.countryTaxes.items, { id: this.periodId });
    },

    handleQuickSearchInput() {
      return debounce(() => {
        this.searchPeriodTaxes();
      }, 500);
    },
  },

  beforeRouteUpdate(to, from, next) {
    if (!this.isSearchRouting) {
      this.initQuery(to.query);
      this.updateFiltersFromQuery();
    }
    this.isSearchRouting = false;
    next();
  },

  created() {
    this.updateFiltersFromQuery();
  },

  methods: {
    ...mapActions(['setIsLoading', 'uploadImage']),
    ...mapActions('TaxesByPeriod', [
      'deactivateProject', 'activateProject', 'fetchPeriodTaxes',
      'submitFilters', 'initQuery',
    ]),

    formatDate(value) {
      const datetime = new Date(value);
      return format(datetime, 'dd MMM yyyy');
    },

    formatDateAndTime(seconds) {
      const datetime = new Date(seconds * 1000);
      return format(datetime, 'dd MMM yyyy, HH:mm');
    },

    updateFiltersFromQuery() {
      this.filters = this.getFilterValues(['quickFilter', 'status']);
    },

    async searchPeriodTaxes() {
      this.setIsLoading(true);
      this.submitFilters(this.filters);
      this.navigate();
      await this.fetchPeriodTaxes();
      this.setIsLoading(false);
    },

    navigate() {
      this.isSearchRouting = true;
      this.$navigatePath(this.$route.path, this.query);
    },
  },
};
</script>

<template>
<div>
  <UiHeader level="2" :hasMargin="true">
    Taxes for
    {{formatDate(period.date_from)}}
    -
    {{formatDate(period.date_to)}}
  </UiHeader>
  <div class="controls">
    <div class="filters">
      <UiFilterSearchInput
        v-model="filters.quickFilter"
        @input="handleQuickSearchInput"
      />
    </div>
  </div>
  <div class="content">
    <UiTable>
      <UiTableRow :isHead="true">
        <UiTableCell class="cell" align="left">Date & time</UiTableCell>
        <UiTableCell class="cell">Country</UiTableCell>
        <UiTableCell class="cell">Transaction</UiTableCell>
        <UiTableCell class="cell">Method</UiTableCell>
        <UiTableCell class="cell">Amount</UiTableCell>
        <UiTableCell class="cell">VAT</UiTableCell>
        <UiTableCell class="cell">Comission</UiTableCell>
        <UiTableCell class="cell">Payout</UiTableCell>
      </UiTableRow>
      <UiTableRow
        v-for="item in periodTaxes.items"
        :key="item.id"
      >
        <UiTableCell class="cell" align="left">
          {{formatDateAndTime(item.created_at.seconds)}}
        </UiTableCell>
        <UiTableCell class="cell">
          {{item.billing_address.country}}
        </UiTableCell>
        <UiTableCell class="cell">
          {{item.transaction}}
        </UiTableCell>
        <UiTableCell class="cell">
          {{item.payment_method.title}}
        </UiTableCell>
        <UiTableCell class="cell">
          {{$formatPrice(item.total_payment_amount, item.currency)}}
        </UiTableCell>
        <UiTableCell class="cell">
          {{$formatPrice(item.tax_fee.amount, item.tax_fee.currency)}}
        </UiTableCell>
        <UiTableCell class="cell">
          {{$formatPrice(item.paysuper_fixed_fee.amount, item.paysuper_fixed_fee.currency)}}
        </UiTableCell>
        <UiTableCell class="cell">
          ??
        </UiTableCell>
      </UiTableRow>
    </UiTable>
    <NoResults
      v-if="!periodTaxes.items"
    />
  </div>
</div>
</template>

<style lang="scss" scoped>
.description {
  max-width: 566px;
  margin-bottom: 24px;
}

.controls {
  margin-bottom: 40px;
  padding-bottom: 32px;
  border-bottom: 1px solid #e3e5e6;
  display: flex;
  justify-content: flex-end;
}

.filters {
  display: flex;

  & > * {
    margin-left: 8px;
  }
}

.content {
}
</style>
