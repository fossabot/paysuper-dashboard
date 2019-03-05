<template>
  <span class="transaction-status-icon" :class="`_${statusName}`">
  </span>
</template>

<script>
import { includes } from 'lodash-es';

export default {

  props: {
    status: {
      type: [Number, String],
      required: true,
    },
  },

  computed: {
    statusName() {
      const statusInNumber = Number(this.status);

      // success
      if (includes([4, 5, 6, 7], statusInNumber)) {
        return 'complete';
      }

      // danger
      if (includes([8], statusInNumber)) {
        return 'incomplete';
      }

      // warning
      if (includes([9, 10], statusInNumber)) {
        return 'incomplete';
      }

      return 'initial';
    },
  },
};
</script>

<style lang="scss" scoped>
.transaction-status-icon {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-sizing: border-box;
  border: 2px solid #203d5f;

  &._initial {
    background: #ccc;
  }

  &._complete {
    background: #5dca37;
  }

  &._incomplete {
    background: #ffa338;
  }
}
</style>
