<script>
export default {
  name: 'ReportDispute',

  data() {
    return {
      descr: 'We need you direct confirmation for every report been processed. If you will fail to confirm or dispute a report in 5 days it will be confirmed automatically.',
      reason: '',
    };
  },

  computed: {
    isShowButtonSend() {
      return this.reason !== '';
    },
  },
};
</script>

<template>
  <UiModal width="448px">
    <UiHeader
      slot="header"
      level="3"
      align="center"
    >
      Start a Dispute
    </UiHeader>

    <div class="content">
      <div class="descr">
        {{ descr }}
      </div>

      <UiTextarea
        class="textBox"
        label="Details of correction"
        :required="true"
        v-model="reason"
      />
    </div>

    <div class="controls">
      <UiButton
        class="button-cancel"
        color="light-gray"
        @click="$emit('close')"
      >
        CANCEL
      </UiButton>
      <UiButton
        class="button-send"
        color="blue"
        :disabled="!isShowButtonSend"
        @click="$emit('input', reason)"
        >
        SEND
      </UiButton>
    </div>
  </UiModal>
</template>

<style lang="scss" scoped>
.content {
  padding: 24px 0;
  .descr {
    text-align: center;
    width: 100%;
  }
}
.controls {
  display: flex;
}
.button-cancel {
  width: 128px;
  margin-right: 16px;
}
.button-send {
  width: 256px;
}
.textBox {
  height: 120px;
  & textarea {
    font-size: 16px;
    line-height: 24px;
  }
}

</style>
