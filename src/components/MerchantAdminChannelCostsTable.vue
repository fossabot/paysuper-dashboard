<script>
import { cloneDeep } from 'lodash-es';
import PaymentMethodsTable from '@/mixins/PaymentMethodsTable';
import ExpandableCellText from '@/components/ExpandableCellText.vue';

export default {
  name: 'MerchantAdminChannelCostsTable',

  mixins: [PaymentMethodsTable],

  components: {
    ExpandableCellText,
  },

  props: {
  },

  data() {
    const channelCostsItem = {
      fee: {
        value: '1',
        hasChanges: false,
        hasError: false,
        hasFocus: false,
      },
      fixedFee: {
        value: '1',
        hasChanges: false,
        hasError: false,
        hasFocus: false,
      },
      overallFee: {
        value: '1',
        hasChanges: false,
        hasError: false,
        hasFocus: false,
      },
      psGeneralFixedFee: {
        value: '1',
        hasChanges: false,
        hasError: false,
        hasFocus: false,
      },
    };
    return {
      activeFieldNames: ['fee', 'fixedFee', 'overallFee', 'psGeneralFixedFee'],
      channelCosts: [
        {
          ...(cloneDeep(channelCostsItem)),
          method: 'Visa',
          icon: 'IconVisa',
          isExpanded: false,
          items: [
            cloneDeep(channelCostsItem),
            cloneDeep(channelCostsItem),
            cloneDeep(channelCostsItem),
          ],
        },
        {
          ...(cloneDeep(channelCostsItem)),
          method: 'Mastercard',
          icon: 'IconMastercard',
          isExpanded: false,
          items: [
            cloneDeep(channelCostsItem),
            cloneDeep(channelCostsItem),
          ],
        },
        {
          ...(cloneDeep(channelCostsItem)),
          method: 'QIWI',
          icon: 'IconQiwi',
          isExpanded: false,
          items: [
            cloneDeep(channelCostsItem),
            cloneDeep(channelCostsItem),
          ],
        },
        {
          ...(cloneDeep(channelCostsItem)),
          method: 'Ali Pay',
          icon: 'IconAlipay',
          isExpanded: false,
          items: [
            cloneDeep(channelCostsItem),
            cloneDeep(channelCostsItem),
            cloneDeep(channelCostsItem),
          ],
        },
        {
          ...(cloneDeep(channelCostsItem)),
          method: 'WebMoney',
          icon: 'IconWebMoney',
          isExpanded: false,
          items: [
            cloneDeep(channelCostsItem),
            cloneDeep(channelCostsItem),
          ],
        },
        {
          ...(cloneDeep(channelCostsItem)),
          method: 'Yandex Money',
          icon: 'IconYandexMoney',
          isExpanded: false,
          items: [
            cloneDeep(channelCostsItem),
            cloneDeep(channelCostsItem),
          ],
        },
      ],
    };
  },

  computed: {
    channelCostsFlattened() {
      return this.$_PaymentMethodsTable_flattenDataList(this.channelCosts, 'method');
    },
  },

  methods: {
    moveFocus(index, fieldName, focusMoveDirection) {
      this.$_PaymentMethodsTable_moveFocus({
        index,
        fieldName,
        focusMoveDirection,
        activeFieldNames: this.activeFieldNames,
        flattenedDataList: this.channelCostsFlattened,
      });
    },
  },
};
</script>

<template>
<UiComplexTable>
  <UiComplexTableRow :isHead="true">
    <UiComplexTableCell class="cell _method" align="left">Payment Method</UiComplexTableCell>
    <UiComplexTableCell class="cell _currency">Payout currency</UiComplexTableCell>
    <UiComplexTableCell class="cell _amount">Payment amount</UiComplexTableCell>
    <UiComplexTableCell class="cell _region">Region</UiComplexTableCell>
    <UiComplexTableCell class="cell _country">Country</UiComplexTableCell>
    <UiComplexTableCell class="cell _fee">Fee, %</UiComplexTableCell>
    <UiComplexTableCell class="cell _fee">Fixed fee</UiComplexTableCell>
    <UiComplexTableCell class="cell _fee">Overall fee</UiComplexTableCell>
    <UiComplexTableCell class="cell _fee">PS general fixed fee</UiComplexTableCell>
  </UiComplexTableRow>
  <template
    v-for="(data, index) in channelCostsFlattened"
  >
    <UiComplexTableRow
      :key="index"
      :isPainted="index % 2 === 1"
    >
      <UiComplexTableCell
        class="cell _method"
        :class="{ '_leading': !data.parent}"
        align="left"
        :isCollapsed="!!data.parent"
        :hasChanges="$_PaymentMethodsTable_getIsGroupHasChanges(data, activeFieldNames)"
        :hasError="$_PaymentMethodsTable_getIsGroupHasError(data, activeFieldNames)"
        @click.native="data.isExpanded = !data.isExpanded"
      >
        <ExpandableCellText
          v-if="!data.parent"
          :isOpened="data.isExpanded"
        >
          <component :is="data.icon" class="method-icon" />
          {{ data.method }}
        </ExpandableCellText>
      </UiComplexTableCell>
      <UiComplexTableCell class="cell _currency">USD</UiComplexTableCell>
      <UiComplexTableCell class="cell _amount">501–1000$</UiComplexTableCell>
      <UiComplexTableCell class="cell _region">EU</UiComplexTableCell>
      <UiComplexTableCell class="cell _country">United States</UiComplexTableCell>
      <UiComplexTableCell
        class="cell _fee"
        v-bind="$_PaymentMethodsTable_getEditableCellProps(data.fee)"
        @toggleFocus="data.fee.hasFocus = $event"
        @moveFocus="moveFocus(index, 'fee', $event)"
        @change="$_PaymentMethodsTable_handleCellChange(data.fee, $event)"
        mask="###"
      >
        {{ $_PaymentMethodsTable_getCellText(data.fee.value, '%') }}
      </UiComplexTableCell>
      <UiComplexTableCell
        class="cell _fee"
        v-bind="$_PaymentMethodsTable_getEditableCellProps(data.fixedFee)"
        @toggleFocus="data.fixedFee.hasFocus = $event"
        @moveFocus="moveFocus(index, 'fixedFee', $event)"
        @change="$_PaymentMethodsTable_handleCellChange(data.fixedFee, $event)"
        mask="NNNNNN"
      >
        {{ $_PaymentMethodsTable_getCellText(data.fixedFee.value, '$') }}
      </UiComplexTableCell>
      <UiComplexTableCell
        class="cell _fee"
        v-bind="$_PaymentMethodsTable_getEditableCellProps(data.overallFee)"
        @toggleFocus="data.overallFee.hasFocus = $event"
        @moveFocus="moveFocus(index, 'overallFee', $event)"
        @change="$_PaymentMethodsTable_handleCellChange(data.overallFee, $event)"
      >
        {{ $_PaymentMethodsTable_getCellText(data.overallFee.value, '%') }}
      </UiComplexTableCell>
      <UiComplexTableCell
        class="cell _fee"
        v-bind="$_PaymentMethodsTable_getEditableCellProps(data.psGeneralFixedFee)"
        @toggleFocus="data.psGeneralFixedFee.hasFocus = $event"
        @moveFocus="moveFocus(index, 'psGeneralFixedFee', $event)"
        @change="$_PaymentMethodsTable_handleCellChange(data.psGeneralFixedFee, $event)"
      >
        {{ $_PaymentMethodsTable_getCellText(data.psGeneralFixedFee.value, '$') }}
      </UiComplexTableCell>
    </UiComplexTableRow>
  </template>

</UiComplexTable>
</template>

<style lang="scss" scoped>
.cell {
  &._method {
    width: 22%;

    &._leading {
      cursor: pointer;
    }
  }
  &._currency {
    width: 7%;
  }
  &._amount {
    width: 14%;
  }
  &._region {
    width: 7%;
  }
  &._country {
    width: 18%;
  }
  &._fee {
    width: 8%;
  }
}
.method-icon {
  width: 32px;
  height: 18px;
  margin-right: 4px;
}
</style>
