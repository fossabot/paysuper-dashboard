<script>
export default {
  name: 'ExportModal',

  props: {
    title: {
      default: 'Export data',
      type: String,
    },
  },

  data() {
    return {
      formats: ['PDF', 'XLS', 'CSV'],
      selected: 'PDF',
    };
  },
};
</script>

<template>
  <UiModal width="448px" :hasCloseButton="true" @close="$emit('close')">
    <UiHeader
      slot="header"
      level="3"
      align="center"
    >
     {{ title }}
    </UiHeader>

    <div class="content">
      <div
        class="format"
        :class="{ 'current': selected === format }"
        v-for="(format, index) in formats"
        :key="index"
        @click="selected = format">
        <IconBlank></IconBlank>
        <div class="format__name">{{format}}</div>
      </div>
    </div>

    <div class="controls">
      <UiButton
        class="modal-button"
        color="blue"
        @click="$emit('export', selected)"
      >
        EXPORT
      </UiButton>
    </div>
  </UiModal>
</template>

<style lang="scss" scoped>
.content {
  display: flex;
  justify-content: space-between;
  padding: 24px 0;
}

.format {
  width: 122px;
  height: 112px;
  border: 1px solid #E3E5E6;
  box-sizing: border-box;
  border-radius: 8px;
  color: #919699;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.2s ease-out;

  & > svg {
      fill: #919699;
    }

  &:hover {
     box-shadow: 0px 2px 4px rgba(8, 35, 48, 0.24), 0px 4px 8px rgba(8, 35, 48, 0.08);
   }

  &.current {
     box-shadow: 0px 2px 4px rgba(8, 35, 48, 0.24), 0px 4px 8px rgba(8, 35, 48, 0.08);
     color: #000;

  & > svg {
      fill: #000;
    }
  }
  &__name {
    font-size: 14px;
    line-height: 20px;
    padding-top: 14px;
  }
}

.modal-button {
  width: 100%;
}
</style>
