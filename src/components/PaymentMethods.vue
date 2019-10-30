<script>
import { mapState, mapActions } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import { get, find } from 'lodash-es';
import Notifications from '@/mixins/Notifications';

export default {
  name: 'PaymentMethods',
  mixins: [Notifications],
  data() {
    return {
      hasCountriesOpened: false,
      hasCustomersTipOpened: false,
      hasOverallFeeOpened: false,
    };
  },
  validations: {
    region: { required },
  },
  computed: {
    ...mapState('Company/Tariff', [
      'amount',
      'amounts',
      'currency',
      'payerRegion',
      'region',
      'regions',
    ]),
    ...mapState('User/Merchant', ['merchant', 'onboardingSteps']),

    status() {
      return this.merchant.status;
    },
    amountsOptions() {
      return this.amounts.map(amount => ({ label: `${amount} ${this.currency}`, value: amount }));
    },
    prepareCountries() {
      const region = this.regions[this.region];
      return region ? region.countries.join(', ') : 'List countries for region';
    },
    prepareRegions() {
      return [
        { label: 'European Union', value: 'europe', abbr: 'EU' },
        { label: 'Russia & CIS', value: 'russia_and_cis', abbr: 'RU & CIS' },
        { label: 'Asia', value: 'asia', abbr: 'Asia' },
        { label: 'Latin America', value: 'latin_america', abbr: 'LA' },
        { label: 'Worldwide', value: 'worldwide', abbr: 'WW' },
      ];
    },
    payerRegionAbbr() {
      return get(find(this.prepareRegions, { value: this.payerRegion }), 'abbr', '');
    },
    channelCosts() {
      return get(
        this.regions,
        `${this.region}.payerRegions.${this.payerRegion}`,
        {},
      )[this.amount] || [];
    },
    chargeback() {
      return get(this.regions, `${this.region}.chargeback`, {});
    },
    payout() {
      return get(this.regions, `${this.region}.payout`, {});
    },
    isOneLineCountries() {
      return this.prepareCountries.length < 44;
    },
  },
  async mounted() {
    try {
      await this.initState();
    } catch (error) {
      this.$_Notifications_showErrorMessage(error);
    }
  },
  methods: {
    ...mapActions('Company/Tariff', [
      'initState',
      'submitTariffs',
      'updateAmount',
      'updatePayerRegion',
      'updateRegion',
    ]),

    async submit() {
      this.$v.region.$touch();

      if (!this.$v.region.$invalid) {
        try {
          const hasSubmit = await this.submitTariffs(this.merchant.id);

          if (hasSubmit) {
            this.$emit('hasSubmit');
          }
        } catch (error) {
          this.$_Notifications_showErrorMessage(error);
        }
      }
    },
  },
};
</script>

<template>
<div class="payment-methods">
  <div class="section">
    <div class="info">
      Choose payout currency and the main operational region,
      where you plan your main sales volume.
      This important choice will define your future money flow rates and commissions,
      so check the variants below carefully,
      since you will not be able to change these parameters in future.
    </div>

    <div class="select">
      <UiSelect
        v-bind="$getValidatedFieldProps('region')"
        label="Home Region"
        :options="prepareRegions"
        :value="region"
        @input="updateRegion($event)"
        @blur="$v.region.$touch()"
      />
      <div
        class="icon-wrapper"
        @mouseenter="hasCountriesOpened = true"
        @mouseleave="hasCountriesOpened = false"
      >
        <IconQuestion class="question" />
        <UiTip
          :class="['tip', { '_nowrap': isOneLineCountries }]"
          innerPosition="left"
          position="top"
          maxWidth="280px"
          :width="isOneLineCountries ? 'auto' : 'calc(100vw - 320px)'"
          :hasCaret="true"
          :visible="hasCountriesOpened"
        >
          {{ prepareCountries }}
        </UiTip>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="title">Channel costs</div>
    <div class="info">
      You can find how your chosen pair <span class="bolder">Home Region</span> and
      <span class="bolder">Payout Currency</span> affects on different payment methods fees.
    </div>

    <div class="select">
      <UiSelect
        label="Payment Amount"
        :options="amountsOptions"
        :value="amount"
        @input="updateAmount($event)"
      />
    </div>

    <div class="tabs-info">
      <div
        class="icon-wrapper"
        @mouseenter="hasCustomersTipOpened = true"
        @mouseleave="hasCustomersTipOpened = false"
      >
        <IconQuestion class="question" />
        <UiTip
          class="tip"
          innerPosition="left"
          position="top"
          width="calc(100vw - 320px)"
          maxWidth="280px"
          :hasCaret="true"
          :visible="hasCustomersTipOpened"
        >
          You can check here how your choice of <span class="bolder">Home Region</span>
          and <span class="bolder">Payout Currency</span> will affect
          on rates and fees, if your customer will get refund in another region
        </UiTip>
      </div>
      External regions rates ({{ payerRegionAbbr }})
    </div>
    <div class="tabs">
      <UiButton
        v-for="(region, index) in prepareRegions"
        :key="index"
        class="tabs-btn"
        color="light-gray"
        :isRounded="true"
        :isTransparent="payerRegion !== region.value"
        @click="updatePayerRegion(region.value)"
      >
        {{ region.label }}
      </UiButton>
    </div>

    <transition name="table" mode="out-in">
      <UiTable v-if="channelCosts.length">
        <UiTableRow :isHead="true" class="row-indent">
          <UiTableCell class="cell _second" align="left">
            Payment Method
          </UiTableCell>
          <UiTableCell class="cell _channel">
            Method fee, %
          </UiTableCell>
          <UiTableCell class="cell _channel">
            Fixed fee, {{ currency }}
          </UiTableCell>
          <UiTableCell class="cell _channel">
            <div
              class="icon-before-text"
              @mouseenter="hasOverallFeeOpened = true"
              @mouseleave="hasOverallFeeOpened = false"
              >
              <IconQuestion class="question" />
              <UiTip
                class="tip"
                innerPosition="left"
                position="top"
                width="210px"
                :margin="10"
                :hasCaret="true"
                :visible="hasOverallFeeOpened"
              >
                Overall fee is a sum of method and fixed fees.
              </UiTip>
            </div>
            Overall fee, %
          </UiTableCell>
          <UiTableCell class="cell _channel">
            PS general fixed fee, {{ currency }}
          </UiTableCell>
        </UiTableRow>
        <UiTableRow
          v-for="(data, index) in channelCosts"
          :key="index"
        >
          <UiTableCell class="cell _first">
            <component :is="data.icon" class="method-icon" />
          </UiTableCell>
          <UiTableCell class="cell _second" align="left">
            {{ data.method }}
          </UiTableCell>
          <UiTableCell class="cell _channel">
            <span class="cell-blue-transparent">
              {{ data.methodFee }}%
            </span>
          </UiTableCell>
          <UiTableCell class="cell _channel">
            <span class="cell-blue-transparent">
             {{ $formatPrice(data.fixedFee, currency) }}
            </span>
          </UiTableCell>
          <UiTableCell class="cell _channel">
            <span class="cell-blue">
              {{ data.overallFee }}%
            </span>
          </UiTableCell>
          <UiTableCell class="cell _channel">
            {{ $formatPrice(data.psGeneralFixedFee, currency) }}
          </UiTableCell>
        </UiTableRow>
      </UiTable>
    </transition>
  </div>

  <div class="section">
    <div class="title">Refund costs</div>
    <div class="info">
      Check the refund fees policy below.
      Notice that all refund fees are being paid by Pay Super, so they are
      <span class="bolder">free of charge for you</span>.
    </div>
  </div>

  <div class="section">
    <div class="title">Chargeback</div>
    <div class="info">
      Pay attention to our chargeback policy.
      Every such transaction has a fixed cost, mentioned below.
    </div>

    <UiTable>
      <UiTableRow :isHead="true" class="row-indent">
        <UiTableCell class="cell _second" align="left">Payment Method</UiTableCell>
        <UiTableCell class="cell _merch">Chargeback fixed fee, {{ currency }}</UiTableCell>
        <UiTableCell class="cell _merch">Chargeback fee payout party</UiTableCell>
      </UiTableRow>
      <UiTableRow class="row-indent">
        <UiTableCell class="cell _second" align="left">All Methods</UiTableCell>
        <UiTableCell class="cell _merch">{{ $formatPrice(chargeback.fee, currency) }}</UiTableCell>
        <UiTableCell class="cell _merch">{{ chargeback.payoutParty}}</UiTableCell>
      </UiTableRow>
    </UiTable>
  </div>

  <div class="section">
    <div class="title">Payout costs</div>
    <div class="info">
      Please notice there is a fixed service price for every payout transaction.
    </div>

    <UiTable>
      <UiTableRow :isHead="true" class="row-indent">
        <UiTableCell class="cell _second" align="left">Payment Method</UiTableCell>
        <UiTableCell class="cell _merch">Payout fixed fee, {{ currency }}</UiTableCell>
        <UiTableCell class="cell _merch">Fee payout party</UiTableCell>
      </UiTableRow>
      <UiTableRow class="row-indent">
        <UiTableCell class="cell _second" align="left">All Methods</UiTableCell>
        <UiTableCell class="cell _merch">{{ $formatPrice(payout.fee, currency) }}</UiTableCell>
        <UiTableCell class="cell _merch">{{ payout.payoutParty}}</UiTableCell>
      </UiTableRow>
    </UiTable>
  </div>

  <UiButton
    class="submit"
    color="green"
    :disabled="onboardingSteps.tariff || status !== 0"
    @click="submit"
  >
    SUBMIT APPLICATION
  </UiButton>
</div>
</template>

<style lang="scss" scoped>
.payment-methods {
  display: flex;
  flex-direction: column;
}
.section {
  margin-bottom: 32px;
}
.title {
  font-family: Quicksand;
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  letter-spacing: 0.15px;
  color: #000;
  margin-bottom: 8px;
}
.info {
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.25px;
  color: #5e6366;
  margin-bottom: 20px;
  max-width: 420px;
}
.select {
  position: relative;
  width: 100%;
}
.icon-wrapper {
  position: absolute;
  display: flex;
  left: -4px;
  top: 9px;
}
.question {
  fill: #3d7bf5;
  cursor: pointer;

  &:hover {
    fill: #5e6366;
  }
}
.tip {
  background-color: #000;
  padding: 12px;
  color: #fff;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.4px;
  margin-left: -21px;

  &._nowrap {
    white-space: nowrap;
  }

  &::after {
    border-top-color: #000;
  }
}
.note {
  display: flex;
}
.icon-info {
  margin-left: -6px;
  margin-right: 6px;
  fill: #ea3d2f;
  flex-shrink: 0;
  width: 12px;
}
.note-text {
  flex-basis: 568px;
}
.tabs-info {
  position: relative;
  letter-spacing: 0.4px;
  color: #5e6366;
  font-size: 12px;
  line-height: 32px;
  padding-left: 12px;
}
.tabs {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.tabs > .tabs-btn {
  font-weight: normal;
  letter-spacing: 0.25px;
  margin-bottom: 4px;
  margin-right: 4px;
}
.method-icon {
  width: 32px;
  height: 18px;
  display: table-cell;
}
.bolder {
  font-weight: 500;
}
.blue-text {
  color: #3d7bf5;
}
.row-indent {
  &::before {
    content: '';
    display: table-cell;
    width: 40px;
    border-bottom: 2px solid #e3e5e6;
  }
}
.cell {
  &._first {
    width: 40px;
  }
  &._second {
    width: 120px;
  }
  &._channel {
    width: 19.5%;
  }
  &._refund {
    width: 26%;
  }
  &._merch {
    width: 39%;
  }
}
.table-enter,
.table-leave-active {
  opacity: 0;
}
.table-enter-active,
.table-leave-active {
  transition: opacity 0.2s ease-out;
}
.submit {
  min-width: 180px;
  align-self: flex-end;
  letter-spacing: 0.75px;
}
.icon-before-text {
  position: relative;
  top: 1px;
  display: inline-block;
}
.cell-blue {
  display: inline-block;
  width: 72px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  background: rgba(#DAF5F2, 0.5);
  border-radius: 2px;
  border: 1px solid transparent;
  &-transparent {
    width: 72px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    display: inline-block;
    background-color: transparent;
    border: 1px solid rgba(#069697, 0.2);
  }
}
</style>
