<script>
export default {
  name: 'TransactionRefund',

  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      reason: 'Customer\'s request',
      reasons: [
        {
          label: 'Customer\'s request',
          value: 'Customer\'s request',
        },
        {
          label: 'Redeem chargeback',
          value: 'Redeem chargeback',
        },
        {
          label: 'Redeem chargeback',
          value: 'Purchase not provided',
        },
        {
          label: 'Card data was stolen',
          value: 'Card data was stolen',
        },
      ],
    };
  },
};
</script>

<template>
  <UiModal width="448px" :hasCloseButton="true" v-show="showModal" @close="$emit('close')">
    <UiHeader
      slot="header"
      level="3"
      align="center"
    >
      Transaction refund
    </UiHeader>

    <div class="content">
      <div class="descr">
        Seems like your customer wants ones money back. <br>
        Choose reason from the list and confirm return.
      </div>

      <UiSelect
        label="Reason"
        :required="true"
        :options="reasons"
        v-model="reason"
      />
    </div>

    <div class="controls">
      <UiButton
        class="modal-button"
        color="blue"
        @click="$emit('input', reason)"
      >
        CONFIRM
      </UiButton>
    </div>
  </UiModal>
</template>

<style lang="scss" scoped>
.content {
  padding: 0;

  .descr {
    text-align: center;
    width: 100%;
    font-size: 16px;
    margin-bottom: 16px;
  }
}

.modal-button {
  width: 100%;
}
</style>
