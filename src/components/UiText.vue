<script>
import { includes } from 'lodash-es';

export default {
  name: 'UiText',

  props: {
    indentBottom: {
      type: String,
      default: 'medium',
      validator(value) {
        return includes(['small', 'medium', 'big'], value);
      },
    },
  },
};
</script>

<template>
<p class="ui-text" :class="`_indent-bottom-${indentBottom}`">
  <slot></slot>
</p>
</template>

<style lang="scss" scoped>
.ui-text {
  max-width: 448px;
  margin-bottom: 24px;
  font-size: 14px;
  line-height: 20px;
  color: #5e6366;

  &._indent-bottom-small {
    margin-bottom: 12px;
  }

  &._indent-bottom-medium {
    margin-bottom: 24px;
  }

  &._indent-bottom-big {
    margin-bottom: 32px;
  }

  a {
    color: #3d7bf5;
  }
}
</style>
