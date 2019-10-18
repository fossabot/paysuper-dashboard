<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { debounce } from 'lodash-es';
import { format } from 'date-fns';
import Notifications from '@/mixins/Notifications';
import NoResults from '@/components/NoResults.vue';

export default {
  name: 'TaxesCardCountryPage',
  mixins: [Notifications],
  components: {
    NoResults,
  },
  data() {
    return {
      filters: {},
      isSearchRouting: false,
    };
  },
  computed: {
    ...mapState('TaxesByCountry', ['countryId', 'countryTaxes', 'query']),
    ...mapGetters('TaxesByCountry', ['getFilterValues']),

    handleQuickSearchInput() {
      return debounce(() => {
        this.searchCountryTaxes();
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
    ...mapActions('TaxesByCountry', [
      'deactivateProject', 'activateProject', 'fetchCountryTaxes',
      'submitFilters', 'initQuery',
    ]),

    formatDate(value) {
      const datetime = new Date(value);
      return format(datetime, 'dd MMM yyyy');
    },

    updateFiltersFromQuery() {
      this.filters = this.getFilterValues(['quickFilter', 'status']);
    },

    async searchCountryTaxes() {
      this.setIsLoading(true);
      this.submitFilters(this.filters);
      this.navigate();
      await this.fetchCountryTaxes();
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
    {{$t(`countries.${countryId}`)}} Taxes
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
        <UiTableCell class="cell" align="left">Period</UiTableCell>
        <UiTableCell class="cell">Report date</UiTableCell>
        <UiTableCell class="cell">Payout ID</UiTableCell>
        <UiTableCell class="cell">Status</UiTableCell>
        <UiTableCell class="cell">Payment date</UiTableCell>
        <UiTableCell class="cell">Tax Amount</UiTableCell>
        <UiTableCell class="cell">count</UiTableCell>
      </UiTableRow>
      <UiTableRow
        v-for="item in countryTaxes.items"
        :key="item.id"
        :link="`/taxes/${countryId}/period/${item.id}/`"
      >
        <UiTableCell class="cell" align="left">
          {{formatDate(item.date_from)}}
          -
          {{formatDate(item.date_to)}}
        </UiTableCell>
        <UiTableCell class="cell">
          <!-- {{formatDate(item.updated_at)}} -->
        </UiTableCell>
        <UiTableCell class="cell">
          {{item.id}}
        </UiTableCell>
        <UiTableCell class="cell">
          {{item.status}}
        </UiTableCell>
          <UiTableCell class="cell">
          <!-- {{formatDate(item.updated_at)}} -->
        </UiTableCell>
        <UiTableCell class="cell">
          {{$formatPrice(item.vat_amount, item.currency)}}
        </UiTableCell>
        <UiTableCell class="cell">
          {{item.transactions_count}}
        </UiTableCell>
      </UiTableRow>
    </UiTable>
    <NoResults
      v-if="!countryTaxes.items"
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
