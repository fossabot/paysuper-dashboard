<script>
import { includes, sortBy } from 'lodash-es';

export default {
  name: 'EntityManagement',

  model: {
    event: 'update',
    prop: 'value',
  },

  props: {
    title: {
      type: String,
      required: true,
    },
    defaultOptionValue: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    value: {
      type: Array,
      required: true,
    },
  },

  computed: {
    itemsView() {
      return sortBy(this.items, (item) => {
        if (item.value === this.defaultOptionValue) {
          return 0;
        }
        return 1;
      });
    },
  },

  methods: {
    includes,

    toggleItemSelected(itemValue) {
      if (itemValue === this.defaultOptionValue || includes(this.value, itemValue)) {
        return;
      }
      const newItems = this.value.slice();
      newItems.push(itemValue);

      this.$emit('update', newItems);
    },
  },
};
</script>

<template>
<UiModal
  width="458px"
  :hasCloseButton="true"
  @close="$emit('close')"
>
  <UiHeader
    slot="header"
    level="3"
    align="center"
  >
    {{ title }}
  </UiHeader>
  <UiScrollbarBox class="content">
    <div
      v-for="(item, index) in itemsView"
      class="item"
      :key="index"
      :class="{
        '_selected': includes(value, item.value),
        '_undeletable': item.value === defaultOptionValue,
      }"
      @click="toggleItemSelected(item.value)"
    >
      <div class="icon" v-if="item.iconComponent">
        <component :is="item.iconComponent" />
      </div>

      <div class="label">
        {{ item.label }}
      </div>

      <span
        class="delete-icon"
        @click="$emit('delete', item.value)"
      >
        <IconCloseInCircle />
      </span>
    </div>
  </UiScrollbarBox>
  <div class="controls">
    <UiButton
      class="submit-button"
      @click="$emit('save', value)"
    >
      SAVE
    </UiButton>
  </div>
</UiModal>
</template>

<style lang="scss" scoped>
.content {
  max-height: 295px;
  margin-right: -20px;
  margin-bottom: 10px;
}

.item {
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 48px;
  font-size: 16px;
  line-height: 24px;
  border-bottom: 1px solid #e3e5e6;
  margin-right: 20px;
  padding-right: 20px;
  position: relative;

  &:not(._selected):hover {
    background-color: rgba(#3d7bf5, 0.1);
    color: #3d7bf5;
  }

  &._selected {
    color: #919699;
    cursor: default;

    .delete-icon {
      display: flex;
    }

    .icon {
      opacity: 0.3;
    }
  }

  &._undeletable {
    cursor: default;

    .delete-icon {
      display: none;
    }
  }
}
.icon {
  border-radius: 3px;
  overflow: hidden;
  height: 18px;
  flex-shrink: 0;
  margin: -1px 10px 0 0;
}
.label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.delete-icon {
  position: absolute;
  display: none;
  right: 0;
  top: 8px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  justify-content: center;
  align-items: center;

  & > svg {
    transition: fill 0.15s ease-out;
  }

  &:hover > svg {
    fill: #ea3d2f;
  }
}

.controls {
  display: flex;
}
.submit-button {
  flex-grow: 1;
}
</style>
