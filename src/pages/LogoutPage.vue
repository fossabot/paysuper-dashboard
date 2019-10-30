<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'LogoutPage',

  computed: {
    ...mapState(['config']),
  },

  async created() {
    await this.logout();
    this.$router.push({ name: 'Index' });
  },

  methods: {
    ...mapActions('User', ['logout']),
  },
};
</script>

<template>
<div></div>
</template>
