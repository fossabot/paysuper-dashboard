<script>
import { omit, without } from 'lodash-es';

export default {
  name: 'UiLangsImageUpload',

  model: {
    prop: 'value',
    event: 'input',
  },

  props: {
    langs: {
      type: Array,
      default: () => ['en', 'ru'],
    },
    title: {
      type: String,
      default: 'cover',
    },
    description: {
      type: String,
      default: '.png, .jpg, .jpeg, max size 30Mb, min 200x300px; max 1000x1500px',
    },
    uploadImage: {
      required: true,
      type: Function,
    },
    value: {
      required: true,
      type: Object,
    },
    isLocalizationEnabled: {
      type: Boolean,
      default: true,
    },
    isLocalizationOpened: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      isLocalizationOpenedLocal: this.isLocalizationOpened,
    };
  },

  watch: {
    isLocalizationOpened(value) {
      this.isLocalizationOpenedLocal = value;
    },
  },

  computed: {
    langsWithoutDefault() {
      return without(this.langs, 'en');
    },
  },

  methods: {
    updateValue(lang, value) {
      this.value[lang] = value;
    },
    omit,
  },
};
</script>

<template>
<div class="ui-langs-image-upload">
  <UiImageUpload
    v-bind="{ title, description, uploadImage }"
    v-model="value.en"
    :tag="isLocalizationEnabled ? 'EN' : ''"
    @change="updateValue('en', $event)"
  />

  <div v-if="isLocalizationEnabled && langsWithoutDefault.length">
    <div
      class="toggle-localizations"
      :class="{ '_opened': isLocalizationOpenedLocal }"
      @click="isLocalizationOpenedLocal = !isLocalizationOpenedLocal"
    >
      <UiOpenerCorner :isOpened="isLocalizationOpenedLocal" />
      {{ isLocalizationOpenedLocal ? 'Hide' : 'Show' }} localized {{ title }}s
    </div>
    <template v-if="isLocalizationOpenedLocal">
      <UiImageUpload
        class="item"
        v-for="lang in langsWithoutDefault"
        v-bind="{ title, uploadImage }"
        v-model="value[lang]"
        description="File-fomat is the same as for the main one"
        :key="lang"
        :tag="lang.toUpperCase()"
        @change="updateValue(lang, $event)"
      />
    </template>
  </div>


</div>
</template>

<style lang="scss" scoped>
.ui-langs-image-upload {
  width: 100%;
  margin-bottom: 24px;
}

.toggle-localizations {
  color: #3d7bf5;
  cursor: pointer;
  height: 55px;
  margin-top: 5px;
  display: flex;
  align-items: center;

  &._opened {
    color: #919699;
  }
}

.item {
  & + & {
    margin-top: 16px;
  }
}
</style>
