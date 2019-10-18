<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import Notifications from '@/mixins/Notifications';
import TaxesListStore from '@/store/TaxesListStore';
import NoResults from '@/components/NoResults.vue';

export default {
  name: 'TaxesListPage',
  mixins: [Notifications],
  components: {
    NoResults,
  },
  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('TaxesList', TaxesListStore, {
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
    ...mapState('TaxesList', ['query']),
    ...mapGetters('TaxesList', ['taxesFiltered', 'getFilterValues']),
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
    ...mapActions('TaxesList', [
      'deactivateProject', 'activateProject', 'submitFilters', 'initQuery',
    ]),

    updateFiltersFromQuery() {
      this.filters = this.getFilterValues(['quickFilter', 'status']);
    },

    searchTaxes() {
      this.submitFilters(this.filters);
      this.navigate();
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
  <UiHeader level="2" :hasMargin="true">Taxes</UiHeader>
  <div class="controls">
    <div class="filters">
      <UiFilterSearchInput
        v-model="filters.quickFilter"
        @input="searchTaxes"
      />
    </div>
  </div>
  <div class="content">
    <UiTable>
      <UiTableRow :isHead="true">
        <UiTableCell class="cell" align="left">Country</UiTableCell>
        <UiTableCell class="cell">Gross revenue</UiTableCell>
        <UiTableCell class="cell">Rate</UiTableCell>
        <UiTableCell class="cell">Tax amount</UiTableCell>
        <UiTableCell class="cell">Deduction</UiTableCell>
      </UiTableRow>
      <UiTableRow
        v-for="item in taxesFiltered"
        :key="item.id"
        :link="`/taxes/${item.country}/`"
      >
        <UiTableCell class="cell" align="left">
          {{$t(`countries.${item.country}`)}}
        </UiTableCell>
        <UiTableCell class="cell">
          {{$formatPrice(item.gross_revenue, item.currency)}}
        </UiTableCell>
        <UiTableCell class="cell">
          {{item.vat_rate}}%
        </UiTableCell>
        <UiTableCell class="cell">
          {{$formatPrice(item.vat_amount, item.currency)}}
        </UiTableCell>
        <UiTableCell class="cell">
          {{$formatPrice(item.deduction_amount, item.currency)}}
        </UiTableCell>
      </UiTableRow>
    </UiTable>
    <NoResults
      v-if="!taxesFiltered.length"
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
