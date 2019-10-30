<script>
import { kebabCase } from 'lodash-es';

const errorTexts = {
  401: 'Not authorized',
  403: 'Forbidden',
  404: 'Page not found',
  500: 'Server error',
  520: 'Unknown error',
};

export default {
  name: 'ErrorPage',

  props: {
    errorCode: {
      required: true,
      type: Number,
    },
    layout: {
      type: String,
      default: 'PageNoLayout',
    },
  },

  computed: {
    errorText() {
      return errorTexts[this.errorCode] || 'Error';
    },
  },

  methods: {
    kebabCase,
  },
};
</script>

<template>
  <div class="page-error" :class="`_layout-${kebabCase(layout)}`">
    <p class="code">{{errorCode}}</p>
    <p class="text">{{errorText}}</p>
    <p v-if="errorCode === 401" class="link-text">
      <a :href="`/login/?redirect=${$route.fullPath}`">Go for sign in</a>
    </p>
  </div>
</template>

<style lang="scss" scoped>
.page-error {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;

  &._layout-layout {
    height: 51vh;
  }
}

.code {
  font-size: 40px;
  font-weight: bold;
  line-height: 50px;
  margin: 0;
}

.text {
  text-transform: uppercase;
  font-size: 20px;
  line-height: 35px;
  margin: 0;
}

.link-text {
  text-transform: uppercase;
  font-size: 15px;
  line-height: 25px;
}
</style>
