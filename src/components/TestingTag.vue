<template>
<span class="testing-tag">
  Testing
  <IconParagraphPointer
    fill="#F3AA18"
    width="5"
    height="9"
  />
</span>
</template>

<style lang="scss" scoped>
.testing-tag {
  position: relative;
  height: 24px;
  line-height: 20px;
  border: 1px solid #f3aa18;
  box-sizing: border-box;
  border-radius: 12px;
  padding: 0 12px;
  font-size: 12px;
  color: #f3aa18;
  letter-spacing: 0.4px;

  & > svg {
    margin-left: 4px;
  }
}
</style>
