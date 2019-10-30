<script>
export default {
  name: 'CreatePayouttModal',

  data() {
    return {
      name: '',
      image: '',
    };
  },
};
</script>

<template>
<UiModal
  width="448px"
  :hasCloseButton="true"
  @close="$emit('close')"
>
  <UiHeader
    slot="header"
    level="3"
    align="center"
  >
    Create payout
  </UiHeader>
  <UiTextField
    label="Project Name"
    :required="true"
    v-model="name"
  />
  <UiButton
    class="create-button"
    :disabled="name.length < 3"
    @click="$navigate('/projects/new', { name, image })"
  >
    CREATE PAYOUT
  </UiButton>
</UiModal>
</template>

<style lang="scss" scoped>
.cover-uploader {
  margin-bottom: 24px;
}
.create-button {
  width: 100%;
}
</style>
