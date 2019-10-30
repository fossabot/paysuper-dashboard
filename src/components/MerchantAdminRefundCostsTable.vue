<script>
import { find, cloneDeep } from 'lodash-es';
import ClickOutside from 'vue-click-outside';
import PaymentMethodsTable from '@/mixins/PaymentMethodsTable';
import ExpandableCellText from '@/components/ExpandableCellText.vue';

export default {
  name: 'MerchantAdminRefundCostsTable',
  mixins: [PaymentMethodsTable],

  components: {
    ExpandableCellText,
  },

  directives: {
    ClickOutside,
  },

  props: {
  },

  data() {
    const refundCostsItem = {
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
      payoutParty: 'paysuper',
      isPayoutPartyMenuOpened: false,
    };
    return {
      activeFieldNames: ['fee', 'fixedFee'],
      refundCosts: [
        {
          ...(cloneDeep(refundCostsItem)),
          method: 'Visa',
          icon: 'IconVisa',
          isExpanded: false,
          items: [
            cloneDeep(refundCostsItem),
            cloneDeep(refundCostsItem),
            cloneDeep(refundCostsItem),
          ],
        },
        {
          ...(cloneDeep(refundCostsItem)),
          method: 'Mastercard',
          icon: 'IconMastercard',
          isExpanded: false,
          items: [
            cloneDeep(refundCostsItem),
            cloneDeep(refundCostsItem),
          ],
        },
        {
          ...(cloneDeep(refundCostsItem)),
          method: 'QIWI',
          icon: 'IconQiwi',
          isExpanded: false,
          items: [
            cloneDeep(refundCostsItem),
            cloneDeep(refundCostsItem),
          ],
        },
        {
          ...(cloneDeep(refundCostsItem)),
          method: 'Ali Pay',
          icon: 'IconAlipay',
          isExpanded: false,
          items: [
            cloneDeep(refundCostsItem),
            cloneDeep(refundCostsItem),
            cloneDeep(refundCostsItem),
          ],
        },
        {
          ...(cloneDeep(refundCostsItem)),
          method: 'WebMoney',
          icon: 'IconWebMoney',
          isExpanded: false,
          items: [
            cloneDeep(refundCostsItem),
            cloneDeep(refundCostsItem),
          ],
        },
        {
          ...(cloneDeep(refundCostsItem)),
          method: 'Yandex Money',
          icon: 'IconYandexMoney',
          isExpanded: false,
          items: [
            cloneDeep(refundCostsItem),
            cloneDeep(refundCostsItem),
          ],
        },
      ],

      payoutPartyList: [
        {
          label: 'Pay Super',
          value: 'paysuper',
        },
        {
          label: 'Merchant',
          value: 'merchant',
        },
      ],
    };
  },

  computed: {
    refundCostsFlattened() {
      return this.$_PaymentMethodsTable_flattenDataList(this.refundCosts, 'method');
    },
  },

  methods: {
    moveFocus(index, fieldName, focusMoveDirection) {
      this.$_PaymentMethodsTable_moveFocus({
        index,
        fieldName,
        focusMoveDirection,
        activeFieldNames: this.activeFieldNames,
        flattenedDataList: this.refundCostsFlattened,
      });
    },

    closePayoutPartyMenu(data) {
      data.isPayoutPartyMenuOpened = false;
    },

    getPayoutPartyLabel(data) {
      return find(this.payoutPartyList, { value: data.payoutParty }).label;
    },

    handlePayoutPartyMenuItemClick(data, item) {
      if (data.payoutParty === item.value) {
        return;
      }
      data.payoutParty = item.value;
      data.isPayoutPartyMenuOpened = false;
    },
  },
};
</script>

<template>
<UiComplexTable>
  <UiComplexTableRow :isHead="true">
    <UiComplexTableCell class="cell _method" align="left">Payment Method</UiComplexTableCell>
    <UiComplexTableCell class="cell _currency">Payout currency</UiComplexTableCell>
    <UiComplexTableCell class="cell _region">Region</UiComplexTableCell>
    <UiComplexTableCell class="cell _country">Country</UiComplexTableCell>
    <UiComplexTableCell class="cell _fee">Fee, %</UiComplexTableCell>
    <UiComplexTableCell class="cell _fee">Fixed fee</UiComplexTableCell>
    <UiComplexTableCell class="cell _fee">Refund fee payout party</UiComplexTableCell>
  </UiComplexTableRow>
  <template
    v-for="(data, index) in refundCostsFlattened"
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
        class="cell _payout-party"
        @click.native="data.isPayoutPartyMenuOpened = !data.isPayoutPartyMenuOpened"
        v-click-outside="() => closePayoutPartyMenu(data)"
      >
        <div class="payout-party">
          {{getPayoutPartyLabel(data)}}
          <UiOpenerCorner :isOpened="data.isPayoutPartyMenuOpened" />
        </div>

        <UiTip
          innerPosition="right"
          position="bottom"
          width="180px"
          :margin="0"
          :visible="data.isPayoutPartyMenuOpened"
          :closeDelay="0"
          :stayOpenedOnHover="false"
        >
          <UiTooltipMenuItem
            v-for="item in payoutPartyList"
            v-text="item.label"
            :key="item.value"
            :isCurrent="data.payoutParty === item.value"
            @click.native.stop="handlePayoutPartyMenuItemClick(data, item)"
          />
        </UiTip>
      </UiComplexTableCell>
    </UiComplexTableRow>
  </template>

</UiComplexTable>
</template>

<style lang="scss" scoped>
.cell {
  &._method {
    width: 30%;

    &._leading {
      cursor: pointer;
    }
  }
  &._currency {
    width: 7%;
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
  &._payout-party {
    width: 18%;
    cursor: pointer;
    position: relative;
  }
}
.method-icon {
  width: 32px;
  height: 18px;
  margin-right: 4px;
}
.payout-party {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 9px;
}
</style>
