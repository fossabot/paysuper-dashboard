<template>
<div class="ui-panel">
  <slot />
</div>
</template>

<style lang="scss" scoped>
.ui-panel {
  background: #ffffff;
  box-shadow: 0px 1px 2px rgba(8, 35, 48, 0.12),
    0px 2px 6px rgba(8, 35, 48, 0.08);
  border-radius: 8px;
  padding: 32px;

  & + & {
    margin-top: 8px;
  }
}
</style>
