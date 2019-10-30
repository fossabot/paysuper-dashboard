<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import IBAN from 'iban';
import { integer, maxLength, required } from 'vuelidate/lib/validators';
import Notifications from '@/mixins/Notifications';

export default {
  name: 'BankingInfo',
  mixins: [Notifications],
  validations: {
    bankingInfo: {
      accountNumber: { required, iban: IBAN.isValid },
      address: { maxLength: maxLength(60), required },
      correspondentAccount: { integer, maxLength: maxLength(30) },
      currency: { required },
      name: { maxLength: maxLength(60), required },
      swift: { required },
    },
  },
  computed: {
    ...mapGetters('Dictionaries', ['currenciesThreeLetters']),
    ...mapGetters('Company/BankingInfo', ['bankingInfo']),
    ...mapState('Company/Tariff', ['currency']),
    ...mapState('User/Merchant', ['merchant']),

    status() {
      return this.merchant.status;
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
    ...mapActions('Company/BankingInfo', ['initState', 'updateBankingInfo', 'submitBankingInfo']),

    updateField(key, value) {
      this.updateBankingInfo({ ...this.bankingInfo, [key]: value });
    },
    async submit() {
      this.$v.bankingInfo.$touch();
      if (!this.$v.bankingInfo.$invalid) {
        try {
          const hasSubmit = await this.submitBankingInfo();

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
<div class="banking-info">
  <div class="section">
    <div class="title">Account Details</div>
    <div class="info">
      Enter your bank account details here to receive your payouts.
      First specify the SWIFT-code and we will fill-in your bank details automatically.
    </div>

    <UiTextField
      v-bind="$getValidatedFieldProps('bankingInfo.swift')"
      label="SWIFT"
      :value="bankingInfo.swift"
      @input="updateField('swift', $event)"
      @blur="$v.bankingInfo.swift.$touch()"
    />
    <UiSelect
      v-bind="$getValidatedFieldProps('bankingInfo.currency')"
      label="Account Currency"
      :options="currenciesThreeLetters"
      :value="bankingInfo.currency"
      @input="updateField('currency', $event)"
      @blur="$v.bankingInfo.currency.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('bankingInfo.accountNumber')"
      label="IBAN"
      :value="bankingInfo.accountNumber"
      @input="updateField('accountNumber', $event)"
      @blur="$v.bankingInfo.accountNumber.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('bankingInfo.name')"
      label="Bank name"
      :value="bankingInfo.name"
      @input="updateField('name', $event)"
      @blur="$v.bankingInfo.name.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('bankingInfo.address')"
      label="Bank address"
      :value="bankingInfo.address"
      @input="updateField('address', $event)"
      @blur="$v.bankingInfo.address.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('bankingInfo.correspondentAccount')"
      label="Correspondent bank account"
      :required="false"
      :value="bankingInfo.correspondentAccount"
      @input="updateField('correspondentAccount', $event)"
      @blur="$v.bankingInfo.correspondentAccount.$touch()"
    />
  </div>

  <UiButton
    class="submit"
    :disabled="$v.bankingInfo.$invalid || status !== 0"
    @click="submit"
  >
    SUBMIT INFO
  </UiButton>
</div>
</template>

<style lang="scss" scoped>
.banking-info {
  display: flex;
  flex-direction: column;
}
.section {
  margin-bottom: 12px;
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
.submit {
  min-width: 180px;
  align-self: flex-end;
  letter-spacing: 0.75px;
}
</style>
