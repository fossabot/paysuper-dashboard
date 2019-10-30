import axios from 'axios';
import {
  get,
  groupBy,
  map,
  includes,
  union,
  upperFirst,
} from 'lodash-es';
import qs from 'qs';
import getCountriesByRegion from '@/helpers/getCountriesByRegion';
import getIconByPaymentMethod from '@/helpers/getIconByPaymentMethod';

function preparePayerRegion(data) {
  let amounts = [];
  const channelCosts = groupBy(
    map(data, item => ({
      method: upperFirst(item.method_name),
      icon: getIconByPaymentMethod(item.method_name),
      methodFee: item.method_percent_fee,
      fixedFee: item.method_fixed_fee,
      overallFee: item.ps_percent_fee,
      psGeneralFixedFee: item.ps_fixed_fee,
      min: item.min_amount,
      max: item.max_amount,
    })),
    (item) => {
      const amount = `${item.min}-${item.max}`;
      amounts = union(amounts, [amount]);
      return amount;
    },
  );

  return { amounts, channelCosts };
}

export default function createTariffStore() {
  return {
    namespaced: true,
    state: {
      amount: '0-4.99',
      amounts: [],
      currency: 'USD',
      payerRegion: 'europe',
      region: 'europe',
      regions: [],
    },
    getters: {},
    mutations: {
      amount(state, data) {
        state.amount = data;
      },
      amounts(state, data) {
        state.amounts = data;
      },
      payerRegion(state, data) {
        state.payerRegion = data;
      },
      region(state, data) {
        state.region = data;
      },
      regions(state, data) {
        state.regions = data;
      },
    },
    actions: {
      async initState({ dispatch }) {
        await dispatch('fetchTariffs');
      },
      async fetchTariffs({ commit, state }) {
        const { payerRegion, region } = state;
        const queryString = qs.stringify({ payer_region: payerRegion, region });

        const response = await axios.get(
          `{apiUrl}/admin/api/v1/merchants/tariffs?${queryString}`,
        );

        if (response.data) {
          const { payment, chargeback, payout } = response.data;
          const { amounts, channelCosts } = preparePayerRegion(payment);

          if (amounts && amounts.length) {
            commit('amounts', amounts);

            if (!includes(amounts, state.amount)) {
              commit('amount', amounts[0]);
            }
          }
          commit('regions', {
            ...state.regions,
            [region]: {
              countries: getCountriesByRegion(region),
              payerRegions: {
                ...get(state.regions, `${region}.payerRegions`, {}),
                [payerRegion]: channelCosts,
              },
              chargeback: {
                fee: chargeback.method_fixed_fee,
                currency: chargeback.method_fixed_fee_currency,
                payoutParty: chargeback.is_paid_by_merchant ? 'Merchant' : 'PaySuper',
              },
              payout: {
                fee: payout.method_fixed_fee,
                currency: payout.method_fixed_fee_currency,
                payoutParty: payout.is_paid_by_merchant ? 'Merchant' : 'PaySuper',
              },
            },
          });
        }
      },
      async submitTariffs({ dispatch, state }, merchantId) {
        const response = await axios.post(
          `{apiUrl}/admin/api/v1/merchants/${merchantId}/tariffs`,
          { home_region: state.region },
        );

        if (response.status === 200) {
          dispatch('User/Merchant/completeStep', 'tariff', { root: true });
          dispatch('Company/LicenseAgreement/fetchAgreementSignature', true, { root: true });
          return true;
        }

        return false;
      },
      updatePayerRegion({ commit, dispatch, state }, region) {
        commit('payerRegion', region);

        if (get(state.regions, `${state.region}.payerRegions.${region}`, null)) {
          return;
        }

        dispatch('fetchTariffs');
      },
      updateRegion({ commit, dispatch, state }, region) {
        commit('region', region);

        if (get(state.regions, `${region}.payerRegions.${state.payerRegion}`, null)) {
          return;
        }

        dispatch('fetchTariffs');
      },
      updateAmount({ commit }, amount) {
        commit('amount', amount);
      },
    },
  };
}
