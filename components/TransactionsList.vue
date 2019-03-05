<template>
  <div class="transactions-list">
    <ui-table>
      <ui-table-row :isHead="true">
        <ui-table-cell>Project</ui-table-cell>
        <ui-table-cell>Product</ui-table-cell>
        <ui-table-cell>Date</ui-table-cell>
        <ui-table-cell>Country</ui-table-cell>
        <ui-table-cell>Method</ui-table-cell>
        <ui-table-cell>User</ui-table-cell>
        <ui-table-cell>Transaction</ui-table-cell>
        <ui-table-cell>External ID</ui-table-cell>
        <ui-table-cell>Amount</ui-table-cell>
      </ui-table-row>
      <ui-table-row
        v-for="item in items"
        :key="item.id"
        :link="{
          url: `/order/${item.id}`,
          router: true
        }"
      >
        <ui-table-cell>{{item.project.name}}</ui-table-cell>
        <ui-table-cell>{{getValue(item, 'fixed_package.name')}}</ui-table-cell>
        <ui-table-cell>{{getFormattedDate(item)}}</ui-table-cell>
        <ui-table-cell>{{getValue(item, 'payer_data.country_name.en')}}</ui-table-cell>
        <ui-table-cell>{{getValue(item, 'payment_method.name')}}</ui-table-cell>
        <ui-table-cell>{{getValue(item, 'account')}}</ui-table-cell>
        <ui-table-cell>
          <TransactionStatusIcon :status="item.status.status" />
          {{getValue(item, 'id')}}
        </ui-table-cell>
        <ui-table-cell>{{getValue(item, 'order_id')}}</ui-table-cell>
        <ui-table-cell>
          {{getValue(item, 'project_amount_income.amount')}}
          {{getValue(item, 'project_amount_income.currency.code_a3')}}
        </ui-table-cell>
      </ui-table-row>
    </ui-table>
  </div>
</template>

<script>
import { get } from 'lodash-es';
import {
  UiTable,
  UiTableCell,
  UiTableRow,
} from '@protocol-one/ui-kit';
import TransactionStatusIcon from './TransactionStatusIcon.vue';

export default {
  name: 'TransactionsList',

  components: {
    UiTable,
    UiTableCell,
    UiTableRow,
    TransactionStatusIcon,
  },

  props: {
    count: {
      type: Number,
      required: true,
    },
    items: {
      type: Array,
      request: true,
    },
  },

  methods: {
    getValue(item, path) {
      return get(item, path) || '--';
    },

    getFormattedDate(item) {
      return this.$moment.unix(item.created_at).format('YYYY-MM-DD hh:mm a');
    },
  },
};
</script>
