<script>
import { mapActions, mapState } from 'vuex';
import {
  get, find,
} from 'lodash-es';
import { format } from 'date-fns';
import TransactionPageStore from '@/store/TransactionPageStore';
import TransactionRefund from '@/components/TransactionRefund.vue';

const STATUS_COLOR = {
  created: 'blue',
  processed: 'green',
  pending: 'orange',
  refunded: 'red',
  chargeback: 'red',
  rejected: 'transparent',
  canceled: 'transparent',
};

export default {
  name: 'transactionsCard',
  components: { TransactionRefund },

  data() {
    return {
      colors: STATUS_COLOR,
      showRefundModal: false,
    };
  },

  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('TransactionPage', TransactionPageStore, {
        transactionId: route.params.transactionId,
      });
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },

  computed: {
    ...mapState('TransactionPage', ['transaction', 'refunds']),

    refundAvailable() {
      const badStatus = [
        'canceled',
        'refunded',
        'rejected',
        'chargeback',
      ];
      return !badStatus.includes(this.transaction.status);
    },

    // the refund process has started
    hasRefund() {
      return !!this.refunds.items;
    },
  },

  methods: {
    ...mapActions(['setIsLoading']),
    ...mapActions('TransactionPage', ['refund']),

    get,

    getProductName(items) {
      if (items === null) {
        return 'Checkout';
      }

      if (items.length > 1) {
        return 'Product';
      }

      return items[0].name;
    },

    getCountryByCode(code) {
      return get(find(this.countries, ({ value }) => value === code), 'label', code);
    },

    formatDateAndTime(seconds) {
      const datetime = new Date(seconds * 1000);
      return format(datetime, 'dd.MM.yyyy, HH:mm:ss');
    },

    async handleRefund(reason) {
      this.setIsLoading(true);
      await this.refund({ transaction: this.transaction, reason }).catch(this.$showErrorMessage);
      this.setIsLoading(false);
    },
  },
};
</script>

<template>
  <div>
    <UiPageHeaderFrame class="transaction-page-header">
      <template slot="title">
        Transaction {{ transaction.transaction }}
      </template>
      <span slot="description">
        <UiLabelTag :color="colors[transaction.status]">{{transaction.status}}</UiLabelTag>
      </span>
      <UiButton
        slot="picture"
        color="blue"
        class="refund-button"
        v-if="refundAvailable"
        :isTransparent="true"
        :disabled="hasRefund"
        @click="showRefundModal = true">
        REFUND
      </UiButton>
    </UiPageHeaderFrame>

    <TransactionRefund
      :showModal="showRefundModal"
      @close="showRefundModal = false"
      @input="handleRefund($event)"></TransactionRefund>

    <UiPanel>
      <div class="details">
        <UiHeader level="3" class="details__header">Transaction details</UiHeader>
        <div class="details__container">
          <div class="details__item">
            <div class="details__item--label">Payment date</div>
            <div class="details__item--info">
              {{ formatDateAndTime(transaction.created_at.seconds) }}
            </div>
          </div>
          <div class="details__item">
            <div class="details__item--label">Net amount</div>
            <div class="details__item--info">
              {{ $formatPrice(transaction.total_payment_amount, transaction.currency) }}
            </div>
          </div>
          <div class="products" v-if="transaction.items && transaction.items.length > 1">
            <UiTable>
              <UiTableRow :isHead="true">
                <UiTableCell width="50%" align="left" class="products__head">
                  Products
                </UiTableCell>
                <UiTableCell width="50%" align="left" class="products__head products__shift">
                  Product price
                </UiTableCell>
              </UiTableRow>
              <UiTableRow v-for="(product, index) in transaction.items" :key="index">
                <UiTableCell align="left" class="products__cell">{{product.name}}</UiTableCell>
                <UiTableCell align="left" class="products__cell products__shift">
                  {{ $formatPrice(product.amount, product.currency) }}
                </UiTableCell>
              </UiTableRow>
            </UiTable>
          </div>
          <div class="details__item" v-else>
            <div class="details__item--label">Products</div>
            <div class="details__item--info">
              {{ getProductName(transaction.items) }}
            </div>
          </div>
          <div class="details__item">
            <div class="details__item--label">Project</div>
            <div class="details__item--info">
              {{ transaction.project.name.en }}
            </div>
          </div>
          <div class="details__item">
            <div class="details__item--label">Payment method</div>
            <div class="details__item--info">
              {{ transaction.payment_method.title }}
            </div>
          </div>
          <div class="details__item">
            <div class="details__item--label">Country</div>
            <div class="details__item--info">
              {{ getCountryByCode(transaction.country_code) }}
            </div>
          </div>
        </div>
      </div>

      <div class="details">
        <UiHeader level="3" class="details__header">User info</UiHeader>
        <div class="details__container">
          <div class="details__item">
            <div class="details__item--label">User ID</div>
            <div class="details__item--info">
              {{ transaction.user.id }}
            </div>
          </div>
          <div class="details__item">
            <div class="details__item--label">IP</div>
            <div class="details__item--info">
              {{ transaction.user.ip }}
            </div>
          </div>
          <div class="details__item">
            <div class="details__item--label">Country</div>
            <div class="details__item--info">
              {{ transaction.user.address.country }}
            </div>
          </div>
        </div>
      </div>

      <div class="details" v-if="transaction.payment_method && transaction.payment_method.card">
        <UiHeader level="3" class="details__header">Payment details</UiHeader>
        <div class="details__container">
          <div class="details__item">
            <div class="details__item--label">Type of card</div>
            <div class="details__item--info">
              {{ transaction.payment_method.card.brand }}
            </div>
          </div>
          <div class="details__item">
            <div class="details__item--label">Card expiry month/year</div>
            <div class="details__item--info">
              {{ transaction.payment_method.card.expiry_month }}
              /
              {{ transaction.payment_method.card.expiry_year }}
            </div>
          </div>
          <div class="details__item">
            <div class="details__item--label">Card number</div>
            <div class="details__item--info">
              {{ transaction.payment_method.card.masked }}
            </div>
          </div>
        </div>
      </div>
    </UiPanel>
  </div>
</template>

<style lang="scss" scoped>
.transaction-page-header{
  position: relative;
}

.refund-button {
  width: 140px;
  height: 40px;
  position: absolute !important;
  top: 20px;
  right: 0;
}

.details {
  border-bottom: 1px solid rgba(227, 229, 230, .8);
  margin-bottom: 32px;

  &__header {
    margin-bottom: 16px;
  }

  &__container {
    display: flex;
    flex-wrap: wrap;
  }

  &__item {
    flex-basis: 50%;
    padding: 0 0 20px 12px;

    &--label {
      color: #5E6366;
      font-size: 12px;
      margin-bottom: 5px;
    }

    &--info {
      color: #000;
      letter-spacing: 0.44px;
    }
  }

  .products {
    flex-basis: 100%;
    width: 100%;
    padding: 0 0 20px 12px;

    &__head {
      color: #5E6366;
      font-size: 12px;
      padding: 0;
      border-bottom: none;
    }

    &__cell {
      color: #000;
      letter-spacing: 0.44px;
      padding: 10px 0;
      border-bottom: 1px dashed #C6CACC;
    }

    &__shift {
      padding-left: 5px;
    }
  }
}
</style>
