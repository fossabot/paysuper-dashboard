<script>
import {
  mapState, mapGetters, mapActions,
} from 'vuex';
import {
  isEqual, get,
} from 'lodash-es';
import moment from 'moment';

import reportsStatusScheme from '@/schemes/reportsStatusScheme';
import ReportsListStore from '@/store/ReportsListStore';
import NoResults from '@/components/NoResults.vue';
import CreatePayoutModal from '@/components/CreatePayoutModal.vue';
import ReportDispute from '@/components/ReportDispute.vue';
import ExportModal from '@/components/ExportModal.vue';

const STATUS_COLOR = {
  pending: 'orange',
  accepted: 'green',
  waiting_payment: 'green',
  paid: 'aqua',
  dispute: 'red',
  canceled: 'transparent',
};

const STATUS = {
  pending: 'pending',
  accepted: 'confirmed',
  waiting_payment: 'paying',
  paid: 'paid',
  dispute: 'dispute',
  canceled: 'canceled',
};

export default {
  name: 'RoyaltyReportsPage',

  components: {
    NoResults,
    CreatePayoutModal,
    ReportDispute,
    ExportModal,
  },

  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('Reports', ReportsListStore, {
        query: route.query,
      });
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },

  data() {
    return {
      filters: {},
      scheme: reportsStatusScheme,
      showRefundModal: false,
      currentTransaction: null,
      isCreatePayoutModalOpened: false,
      openedReportId: null,
      disputeReportId: null,
      reportIdExport: null,
      showExportModal: false,
      showDisputeModal: false,
    };
  },

  computed: {
    ...mapState('Reports', ['reportsList', 'filterValues', 'query', 'apiQuery', 'balance']),
    ...mapGetters('Reports', ['getFilterValues']),
    ...mapGetters('Dictionaries', ['countries']),

    dateFilter: {
      get() {
        return [this.filters.dateFrom || null, this.filters.dateTo || null];
      },
      set(value) {
        const [dateFrom, dateTo] = value;
        this.filters.dateFrom = dateFrom;
        this.filters.dateTo = dateTo;
      },
    },

    isPayoutAmount() {
      return this.reportsList.count > 0;
    },

    payoutAmount() {
      return this.balance.debit || 0;
    },

    isBalance() {
      return this.balance.debit && this.balance.currency;
    },
  },

  created() {
    this.updateFiltersFromQuery();
  },

  mounted() {
    this.initInfiniteScroll();
    this.getBalance();
  },

  methods: {
    ...mapActions(['setIsLoading']),
    ...mapActions('Reports', [
      'initQuery',
      'createItem',
      'submitFilters',
      'fetchReports',
      'getBalance',
      'acceptReport',
      'dispute',
    ]),
    ...mapActions('ExportFile', [
      'createReportFile',
      'initWaitingFile',
    ]),

    get,

    updateFiltersFromQuery() {
      this.filters = this.getFilterValues(['dateFrom', 'dateTo', 'offset', 'limit', 'status']);
    },

    filterReports() {
      this.filters.offset = 0;
      this.searchItems();
    },

    async searchItems() {
      this.isSearchRouting = true;
      this.setIsLoading(true);
      this.submitFilters(this.filters);
      this.navigate();
      await this.fetchReports().catch(this.$showErrorMessage);
      this.setIsLoading(false);
    },

    initInfiniteScroll() {
      this.$appEventsOn('contentScrollReachEnd', async () => {
        if (
          this.isInfiniteScrollLocked
          || this.filters.offset + this.filters.limit >= this.reportsList.count
        ) {
          return;
        }
        this.isInfiniteScrollLocked = true;

        this.filters.offset += this.filters.limit;
        await this.searchItems();
        this.isInfiniteScrollLocked = false;
      });
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

    getColor(status) {
      return STATUS_COLOR[status];
    },

    getStatus(status) {
      return STATUS[status];
    },

    handleFilterInput(data) {
      this.filters.status = [];

      if (data === 'all') {
        this.filters.status = [];
      } else {
        this.filters.status.push(data);
      }

      this.filterReports();
    },

    getFormattedDate(item) {
      return moment.unix(item).format('DD MMM YYYY');
    },

    getValue(item, path) {
      return get(item, path) || '—';
    },

    showExport(id) {
      this.reportIdExport = id;
      this.showExportModal = !this.showExportModal;
    },

    async exportFile(fileType) {
      this.setIsLoading(true);
      await this.createReportFile({
        file_type: fileType.toLowerCase(),
        report_type: 'royalty',
        params: {
          id: this.reportIdExport,
        },
      });
      this.setIsLoading(false);
      this.showExportModal = false;

      this.initWaitingFile();
    },

    async confirmReport(id) {
      this.setIsLoading(true);
      await this.acceptReport(id)
        .then(this.$showSuccessMessage('Report confirmed'))
        .catch(this.$showErrorMessage);
      this.setIsLoading(false);
    },

    openDispute(id) {
      this.disputeReportId = id;
      this.showDisputeModal = true;
    },

    async declineReport(reason) {
      this.setIsLoading(true);
      this.showDisputeModal = false;
      await this.dispute({ reason, id: this.disputeReportId })
        .catch(this.$showErrorMessage);
      this.setIsLoading(false);
    },
  },
};
</script>

<template>
  <div>
    <UiPageHeaderFrame>
      <template slot="title">
        Royalty reports
      </template>
      <span slot="description">
        By these weekly reports we calculate your payments.
        You must confirm each report within 5 days period
        for it is to be paid or dispute it, after 5 days pending
        reports will be confirmed automatically.
      </span>
      <div class="controls">
        <UiButton
          :noSidePaddings="true"
          :disabled="!isPayoutAmount"
          @click="isCreatePayoutModalOpened = true"
          >
          <IconPlus slot="iconBefore" />
          CREATE PAYOUT
        </UiButton>
      </div>
    </UiPageHeaderFrame>

    <CreatePayoutModal
      v-if="isCreatePayoutModalOpened"
      @close="isCreatePayoutModalOpened = false"
      />

    <div class="total-amount">
      <UiPanel>
        <div class="control-bar _center">
          <div class="total-amount__summ">
            {{ isBalance ? $formatPrice(payoutAmount, balance.currency) : 0 }}
          </div>
          <div class="total-amount__text">
            Total royalty amount
          </div>
        </div>
      </UiPanel>
    </div>

    <UiPanel>
      <div class="control-bar">
        <div class="control-bar _left-center">
          <UiFilterDate
            v-model="dateFilter"
            @input="filterReports"
          />
          <UiFilterReportsStatus
            class="filter-status"
            @input="handleFilterInput"
            :value="filters.status[0]"
            :scheme="scheme" />
        </div>
      </div>

      <div class="reports-list">
        <UiTable v-if="reportsList.items.length">
          <UiTableRow :isHead="true">
            <UiTableCell align="left">Period</UiTableCell>
            <UiTableCell align="left">Report date</UiTableCell>
            <UiTableCell align="left">Payout ID</UiTableCell>
            <UiTableCell align="left">Payment date</UiTableCell>
            <UiTableCell align="left">Amount</UiTableCell>
            <UiTableCell align="left">Status</UiTableCell>
            <UiTableCell align="left" width="3%"></UiTableCell>
          </UiTableRow>
          <UiTableRow
            class="report"
            v-for="(report, index) in reportsList.items"
            :key="index"
            :link="`/reports/${report.id}`"
            >
            <UiTableCell align="left">
              {{ getFormattedDate(report.period_from.seconds) }}
              —
              {{ getFormattedDate(report.period_to.seconds) }}
            </UiTableCell>
            <UiTableCell align="left">
              {{ getFormattedDate(report.created_at.seconds) }}
            </UiTableCell>
            <UiTableCell align="left">
              {{ getValue(report, 'payout_document_id') }}
            </UiTableCell>
            <UiTableCell align="left">
              {{ getFormattedDate(report.payout_date.seconds) }}
            </UiTableCell>
            <UiTableCell align="left" :class="`status-${report.status}`">
              {{
                get(report, 'totals.payout_amount')
                  ? $formatPrice(report.totals.payout_amount, report.currency)
                  : '—'
              }}
            </UiTableCell>
            <UiTableCell align="left" class="report__status">
              <UiLabelTag class="status" :color="getColor(report.status)">
                <IconFlag
                  class="report__status-flag"
                  v-if="report.is_auto_accepted"
                  />
                {{ getStatus(report.status) }}
              </UiLabelTag>
              <UiTip
                v-if="report.is_auto_accepted"
                width="258px"
                :visible="true"
                position="top"
                innerPosition="center"
                :margin="0"
                class="report__status-tip">
                  This report was accepted automatically.
                  You must make a decision to Confirm or Dispute
                  each report within 5 days period, since it was created
              </UiTip>
            </UiTableCell>
            <UiTableCell
              class="cell-with-menu"
              align="left"
              valign="middle"
              @mouseenter.native="openedReportId = report.id"
              @mouseleave.native="() => openedReportId = null"
              :noPadding="true"
            >
              <div class="dots-menu">
                <UiDotsMenuTrigger
                  class="dots-menu-trigger"
                  :isOpened="openedReportId === report.id"
                />
                <UiTip
                  innerPosition="right"
                  position="bottom"
                  width="180px"
                  :margin="0"
                  :visible="openedReportId === report.id"
                  :closeDelay="0"
                  :stayOpenedOnHover="false"
                >
                  <UiTooltipMenuItem
                    v-if="report.status === 'pending'"
                    class="dots-menu__item"
                    iconComponent="IconCheckInCircle"
                    @click.stop.prevent="confirmReport(report.id)"
                  >
                    Confirm
                  </UiTooltipMenuItem>
                  <UiTooltipMenuItem
                    v-if="report.status === 'pending'"
                    class="dots-menu__item"
                    iconComponent="IconDispute"
                    @click.stop.prevent="openDispute(report.id)"
                  >
                   <IconDispute slot="iconBefore" />
                    Dispute
                  </UiTooltipMenuItem>
                  <UiTooltipMenuItem
                    class="dots-menu__item"
                    iconComponent="IconDownload"
                    @click.stop.prevent="showExport(report.id)"
                  >
                    Export data
                  </UiTooltipMenuItem>
                </UiTip>
              </div>
            </UiTableCell>
          </UiTableRow>
        </UiTable>

        <NoResults type="add-new" v-else>You don’t have any item yet</NoResults>
      </div>
    </UiPanel>

    <ReportDispute
      v-show="showDisputeModal"
      @close="showDisputeModal = false"
      @input="declineReport($event)"
    />

    <ExportModal
      title="Export of royalty report"
      v-show="showExportModal"
      @export="exportFile"
      @close="showExportModal = false"
    />

  </div>
</template>

<style lang="scss" scoped>
.total-amount {
  margin-bottom: 8px;

  &__summ {
    font-size: 20px;
    font-weight: 500;
    line-height: 1.4;
    color: #000;
  }
  &__text {
    font-size: 12px;
    line-height: 1.3;
    color: #5e6366;
  }
}
.control-bar {
  display: flex;
  &._center {
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  &._left-center {
    justify-content: center;
    align-items: center;
  }
}

.status-filter {
  margin-left: 4px;
  position: relative;
  top: 1px;
}

.reports-list {
  margin-top: 32px;
}

.report {
  &:hover {
    background: rgba(61, 123, 245, 0.08);
    color: #3d7bf5;
    cursor: pointer;
  }

  &__status {
    position: relative;
    & .label-tag {
      width: 104px;
    }
    &-flag {
      margin-right: 3px;
    }
    &-tip {
      display: none;
      background: #000;
      border-radius: 4px;
      color: #fff;
      font-size: 12px;
      text-align: left;
      line-height: 16px;
      box-shadow: none;
      padding: 12px;

      &:after {
        display: block;
        content: "";
        width: 6px;
        height: 6px;
        position: absolute;
        bottom: -4px;
        background: #000000;
        transform: rotate(45deg);
      }
    }

    &:hover &-tip {
      display: block;
    }
  }
}

.filter-status {
  margin: 0 0 0 2px;
}

.status {
  text-transform: capitalize;
}

.status-paid {
  color: #069697;
}

.cell-with-menu {
  position: relative;
  padding-right: 5px;
}
.dots-menu {
  position: relative;
  &__item {
    /deep/ .menu-icon {
      svg {
        fill: #78909c !important;
      }
    }
  }
}
</style>
