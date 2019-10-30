<script>
import ConfirmEmailStore from '@/store/ConfirmEmailStore';

export default {
  name: 'ConfirmEmail',

  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('ConfirmEmail', ConfirmEmailStore, route.query.token);
      store.dispatch('ConfirmEmail/redirectToDashboard');
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },
};
</script>

<template>
  <div class="confirm-email">
    Loading...
  </div>
</template>
<style lang="scss" scoped>
.confirm-email {
}
</style>
