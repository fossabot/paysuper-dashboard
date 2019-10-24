<script>
import CoverImageUpload from '@/components/CoverImageUpload.vue';

export default {
  name: 'NewProjectModal',

  components: {
    CoverImageUpload,
  },

  props: {
    uploadImage: {
      required: true,
      type: Function,
    },
  },

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
    New Project
  </UiHeader>
  <UiTextField
    label="Project Name"
    :required="true"
    v-model="name"
  />
  <CoverImageUpload
    class="cover-uploader"
    :uploadImage="uploadImage"
    v-model="image"
  />
  <UiButton
    class="create-button"
    :disabled="name.length < 3"
    @click="$emit('submit', { name, image })"
  >
    CREATE
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
