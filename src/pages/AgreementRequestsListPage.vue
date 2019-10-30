<script>
import {
  debounce, get, groupBy, mapKeys, mapValues, isEqual,
} from 'lodash-es';
import { mapState, mapGetters, mapActions } from 'vuex';
import Notifications from '@/mixins/Notifications';
import MerchanstListStore from '@/store/MerchanstListStore';
import merchantStatusScheme from '@/schemes/merchantStatusScheme';
import NoResults from '@/components/NoResults.vue';
import PictureBlocksScheme from '@/components/PictureBlocksScheme.vue';

export default {
  name: 'AgreementRequestsListPage',

  mixins: [Notifications],

  components: {
    PictureBlocksScheme,
    NoResults,
  },

  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('AgreementRequestsList', MerchanstListStore, {
        query: route.query,
        page: 'agreementRequestsList',
      });
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },

  data() {
    return {
      filters: {},
      isSearchRouting: false,
      isInfiniteScrollLocked: false,
    };
  },

  async beforeRouteUpdate(to, from, next) {
    if (!this.isSearchRouting) {
      this.initQuery(to.query);
      this.updateFiltersFromQuery();
      this.setIsLoading(true);
      await this.fetchMerchants().catch(this.$_Notifications_showErrorMessage);
      this.setIsLoading(false);
    }
    this.isSearchRouting = false;
    next();
  },

  created() {
    this.updateFiltersFromQuery();
  },

  mounted() {
    this.initInfiniteScroll();
  },

  computed: {
    ...mapState('AgreementRequestsList', ['merchants', 'filterValues', 'query', 'apiQuery']),
    ...mapGetters('AgreementRequestsList', ['getFilterValues']),

    handleQuickSearchInput() {
      return debounce(() => {
        this.filterMerchants();
      }, 500);
    },

    dateFilter: {
      get() {
        return [this.filters.receivedDateFrom || null, this.filters.receivedDateTo || null];
      },
      set(value) {
        const [receivedDateFrom, receivedDateTo] = value;
        this.filters.receivedDateFrom = receivedDateFrom;
        this.filters.receivedDateTo = receivedDateTo;
      },
    },

    countsByStatus() {
      const groups = groupBy(this.merchants.items, 'status');

      const itemsCounts = mapKeys(
        mapValues(groups, item => item.length),
        (value, key) => get(merchantStatusScheme, key, merchantStatusScheme[0]).value,
      );

      return {
        all: this.merchants.items.length,
        ...itemsCounts,
      };
    },
  },

  methods: {
    ...mapActions(['setIsLoading']),
    ...mapActions('AgreementRequestsList', [
      'submitFilters', 'fetchMerchants', 'initQuery',
    ]),

    get,

    updateFiltersFromQuery() {
      this.filters = this.getFilterValues([
        'quickFilter', 'offset', 'limit', 'receivedDateFrom', 'receivedDateTo', 'status',
      ]);
    },

    filterMerchants() {
      this.filters.offset = 0;
      this.searchMerchants();
    },

    initInfiniteScroll() {
      this.$appEventsOn('contentScrollReachEnd', async () => {
        if (
          this.isInfiniteScrollLocked
          || this.filters.offset + this.filters.limit >= this.merchants.count
        ) {
          return;
        }
        this.isInfiniteScrollLocked = true;

        this.filters.offset += this.filters.limit;
        await this.searchMerchants();
        this.isInfiniteScrollLocked = false;
      });
    },

    async searchMerchants() {
      this.isSearchRouting = true;
      this.setIsLoading(true);
      this.submitFilters(this.filters);
      this.navigate();
      await this.fetchMerchants().catch(this.$_Notifications_showErrorMessage);
      this.setIsLoading(false);
    },

    navigate() {
      if (isEqual(this.$route.query, this.query)) {
        return;
      }
      this.$router.push({
        path: this.$route.path,
        query: this.query,
      });
    },

    getCountry(merchant) {
      const country = get(merchant, 'company.country');
      if (!country) {
        return '—';
      }
      return this.$t(`countries.${country}`);
    },

    getLastPayoutValue(merchant) {
      const amount = get(merchant, 'last_payout.amount');
      if (!amount) {
        return '—';
      }

      const currency = get(merchant, 'banking.currency', '');
      return this.$formatPrice(amount, currency);
    },

    getStatus(status) {
      return get(merchantStatusScheme, status, merchantStatusScheme[0]);
    },
  },
};
</script>

<template>
<div>
  <UiPageHeaderFrame>
    <span slot="title">Agreement requests</span>
    <span slot="description">
      Here is the list of active agreement requests from merchants with actual statuses.
      All these requests must be worked out until Signed or Rejected status.
      You can archive rejected requests from view.
    </span>
    <PictureBlocksScheme slot="picture" />
  </UiPageHeaderFrame>

  <UiPanel>

    <div class="filters">
      <UiFilterSearchInput
        :isAlwaysExpanded="true"
        v-model="filters.quickFilter"
        @input="handleQuickSearchInput"
      />

      <div class="filters-right">
        <UiFilterAgreementStatus
          class="agreement-status-filter"
          :countsByStatus="countsByStatus"
          v-model="filters.status"
          @input="filterMerchants"
        />

        <UiFilterDate
          v-model="dateFilter"
          @input="filterMerchants"
        />
      </div>
    </div>

    <UiTable
      v-if="merchants.items.length"
      layout="fixed"
    >
      <UiTableRow :isHead="true">
        <UiTableCell width="16.666%" align="left">Company</UiTableCell>
        <UiTableCell width="16.666%" align="left">Owner name</UiTableCell>
        <UiTableCell width="16.666%" align="left">Country</UiTableCell>
        <UiTableCell width="16.666%" align="left">Received</UiTableCell>
        <UiTableCell width="16.666%" align="left">Last change</UiTableCell>
        <UiTableCell width="16.666%" align="left">Status</UiTableCell>
      </UiTableRow>
      <UiTableRow
        class="content-row"
        v-for="merchant in merchants.items"
        :key="merchant.id"
        :link="`/merchants/${merchant.id}`"
      >
        <UiTableCell align="left">
          <span
            class="cell-text"
            :class="{'_empty': !get(merchant, 'company.name')}"
          >
            {{get(merchant, 'company.name', '—')}}
          </span>
        </UiTableCell>
        <UiTableCell align="left">
          <span
            class="cell-text"
            :class="{'_empty': !get(merchant, 'user.email')}"
          >
            {{get(merchant, 'user.email', '—')}}
          </span>
        </UiTableCell>
        <UiTableCell align="left">
          <span
            class="cell-text"
            :class="{'_empty': !get(merchant, 'company.country')}"
          >
            {{getCountry(merchant)}}
          </span>
        </UiTableCell>
        <UiTableCell align="left">
          <span
            class="cell-text"
            :class="{'_empty': !merchant.received_date}"
          >
            {{ $formatDate(merchant.received_date, 'dd.MM.yy') || '—' }}
          </span>
        </UiTableCell>
        <UiTableCell align="left">
          <span
            class="cell-text"
            :class="{'_empty': !merchant.updated_at}"
          >
            {{ $formatDate(merchant.updated_at, 'dd.MM.yy') || '—' }}
          </span>
        </UiTableCell>
        <UiTableCell align="left">
          <div class="label-tag-holder">
            <UiLabelTag :color="getStatus(merchant.status).color">
              {{ getStatus(merchant.status).label }}
            </UiLabelTag>
          </div>
        </UiTableCell>
      </UiTableRow>
    </UiTable>
    <NoResults v-else />
  </UiPanel>
</div>
</template>

<style lang="scss" scoped>
.cell-text {
  &:not(._price) {
    max-width: 100%;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &._price {
    color: #069697;
    font-weight: 500;
  }

  &._empty {
    color: #c6cacc;
  }

  .content-row:hover & {
    color: #3d7bf5;
  }
}

.filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
}
.agreement-status-filter {
  margin-right: 4px;
}
.label-tag-holder {
  display: flex;

  & > * {
    flex-grow: 1;
    max-width: 104px;
  }
}
</style>
