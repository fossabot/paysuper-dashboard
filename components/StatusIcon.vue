<template>
  <span class="status-icon" :class="`_${status}`">
    <IconDocument v-if="status === 'initial'" />
    <IconCheck v-if="status === 'complete'" />
    <IconIncomplete v-if="status === 'incomplete'" />
  </span>
</template>

<script>
import { includes } from 'lodash-es';
import IconCheck from './IconCheck.vue';
import IconIncomplete from './IconIncomplete.vue';
import IconDocument from './IconDocument.vue';

export default {
  components: {
    IconCheck,
    IconIncomplete,
    IconDocument,
  },

  props: {
    status: {
      type: String,
      default: 'initial',
      validator(value) {
        return includes(['initial', 'incomplete', 'complete'], value);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.status-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  &._initial {
    background: rgba(201, 201, 201, 0.37);
  }

  &._complete {
    background: rgba(85, 210, 135, 0.37);
  }

  &._incomplete {
    background: rgba(216, 90, 43, 0.37);
  }
}
</style>
