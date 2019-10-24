<script>
export default {
  name: 'TransactionsListExport',

  data() {
    return {
      showModal: false,
      formats: ['PDF', 'XSL', 'CSV'],
      selected: 'PDF',
    };
  },
};
</script>

<template>
  <div>
    <div class="export-button" @click="showModal = !showModal">
      <svg width="14" height="17" viewBox="0 0 14 17">
        <path
          d="M0.700195 16.1H13.3002V14.3H0.700195V16.1ZM13.3002
      6.19999H9.7002V0.799988H4.3002V6.19999H0.700195L7.0002 12.5L13.3002 6.19999Z"
        />
      </svg>
    </div>

    <UiModal width="448px" :hasCloseButton="true" v-show="showModal" @close="showModal = false">
      <UiHeader
        slot="header"
        level="3"
        align="center"
      >
        Export list of transactions per period
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
          @click="$emit('export')"
        >
          EXPORT
        </UiButton>
      </div>
    </UiModal>
  </div>
</template>

<style lang="scss" scoped>
.export-button {
  width: 40px;
  height: 40px;
  display: flex;
  border: 1px solid #e3e5e6;
  box-sizing: border-box;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  cursor: pointer;
  transition: all 0.2s ease-out;

  & > svg {
    fill: #78909C;
    transition: fill 0.2s ease-out;
  }

  &:hover {
     background: rgba(61, 123, 245, 0.08);

  & > svg {
      fill: #3d7bf5;
    }
  }
}

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
}

.modal-button {
  width: 100%;
}
</style>
