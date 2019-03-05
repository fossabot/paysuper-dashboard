<template>
  <div>
    <PageHeader :breadcrumbs="[{label: '...', url: '/'}]" title="Transactions search" />
    <div style="width: 100%;">
      <TransactionDetailedFilters
        @searchRequested="handleFiltersSearchRequest"
        :getFilterValues="getFilterValues"
        :getEmptyFilterValues="getEmptyFilterValues"
        ref="filters"
      />

      <TransactionsList
        :items="items"
        :count="count"
      />

      <UiPaginator
        v-if="items.length"
        :offset="filters.offset"
        :limit="filters.limit"
        :count="count"
        @pageChanged="handlePageChange"
      />
      <p v-if="!items.length" class="no-results">Computer says no results</p>

    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { PageHeader } from '@protocol-one/ui-kit';
import TransactionDetailedFilters from '@/components/TransactionDetailedFilters.vue';
import TransactionsList from '@/components/TransactionsList.vue';
import UiPaginator from '@/components/UiPaginator.vue';

export default {
  middleware: 'IsNotAuthenticated',
  components: {
    TransactionDetailedFilters, TransactionsList, PageHeader, UiPaginator,
  },
  asyncData({ store, app }) {
    return store.dispatch('order/initState', {
      query: app.router.history.current.query,
    });
  },
  data() {
    return {
      filters: {},
      isSearchRouting: false,
    };
  },
  computed: {
    ...mapState('order', ['query']),
    ...mapGetters('order', ['items', 'count', 'getFilterValues', 'getEmptyFilterValues']),
  },
  beforeRouteUpdate(to, from, next) {
    if (!this.isSearchRouting) {
      this.initQuery(to.query);
      this.$refs.filters.updateFiltersFromQuery();
      this.updateFiltersFromQuery();
    }
    this.isSearchRouting = false;
    next();
  },
  created() {
    this.updateFiltersFromQuery();
  },
  methods: {
    ...mapActions('order', ['searchTransactions', 'submitFilters', 'initQuery']),

    handlePageChange({ offset }) {
      this.filters.offset = offset;
      this.submitFilters({ offset });
      this.searchTransactions();
      this.isSearchRouting = true;
      this.navigate();
    },

    handleFiltersSearchRequest(filters) {
      this.submitFilters(filters);
      this.searchTransactions();
      this.isSearchRouting = true;
      this.navigate();
    },

    updateFiltersFromQuery() {
      this.filters = this.getFilterValues(['offset', 'limit']);
    },

    navigate() {
      this.$router.push({
        path: this.$route.path,
        query: this.query,
      });
    },
  },
};
</script>

<style lang="scss">
.no-results {
  font-size: 20px;
  color: #B1B1B1;
  text-align: center;
  padding: 100px 0;
}
</style>
