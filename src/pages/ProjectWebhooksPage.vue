<script>
import { mapState } from 'vuex';
import { cloneDeep } from 'lodash-es';
import { required, minLength, url } from 'vuelidate/lib/validators';
import PictureDotsAndSquaresScheme from '@/components/PictureDotsAndSquaresScheme.vue';
import KeyGenerateField from '@/components/KeyGenerateField.vue';

export default {
  name: 'ProjectWebhooksPage',

  components: {
    PictureDotsAndSquaresScheme,
    KeyGenerateField,
  },

  data() {
    return {
      projectLocal: null,
    };
  },

  computed: {
    ...mapState('Project', ['project']),
    ...mapState('User/Merchant', ['merchant']),
  },

  validations: {
    projectLocal: {
      url_process_payment: {
        required,
        url,
      },
      secret_key: {
        required,
        minLength: minLength(12),
      },
    },
  },

  watch: {
    project() {
      this.updateProjectLocal();
    },
  },

  created() {
    this.updateProjectLocal();
  },

  methods: {
    updateProjectLocal() {
      this.projectLocal = cloneDeep(this.project);
    },
    handleSave() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.$emit('save', this.projectLocal);
      }
    },
  },
};
</script>

<template>
<div>
  <UiPageHeaderFrame>
    <template slot="title">
      Webhooks
    </template>
    <template slot="description">
      In this section we will setup and test two-way notifications between our systems,
      so all orders and commands would work as intended.
      This is an obligatory requirement for Virtual Currency and Virtual Items sales options.
    </template>
    <PictureDotsAndSquaresScheme slot="picture" />
  </UiPageHeaderFrame>

  <UiPanel>
    <div class="blocks">
      <div class="block">
        <IconUserStroke />
        <div class="block-content">
          <div class="block-value">
            {{ merchant.id }}
          </div>
          <div class="block-label">Merchant ID</div>
        </div>
      </div>
      <div class="block">
        <IconFolder width="26" height="21" fill="#3D7BF5" />
        <div class="block-content">
          <div class="block-value">
            {{ project.id }}
          </div>
          <div class="block-label">Project ID</div>
        </div>
      </div>
    </div>

  </UiPanel>

  <UiPanel>
    <div class="section">
      <UiHeader
        :hasMargin="true"
        level="3"
      >
        Functional URL
      </UiHeader>
      <UiText indentBottom="small">
        Specify correct URL to get webhook notifications.
      </UiText>
      <UiTextField
        label="Webhook URL"
        v-model="projectLocal.url_process_payment"
        v-bind="$getValidatedFieldProps('projectLocal.url_process_payment')"
      />
    </div>

    <div class="section">
      <UiHeader
        :hasMargin="true"
        level="3"
      >
        Secret key
      </UiHeader>
      <UiText indentBottom="small">
        Generate a secret key to set up correct integration with
        Pay Super platform.
      </UiText>

      <KeyGenerateField
        label="Secret key"
        v-model="projectLocal.secret_key"
        v-bind="$getValidatedFieldProps('projectLocal.secret_key')"
      />
    </div>

    <div class="controls">
      <!-- <UiSwitchBox v-model="projectLocal.enabled">
        Enable webhooks
      </UiSwitchBox> -->
      <UiButton
        class="submit-button"
        text="SAVE"
        @click="handleSave"
      />
    </div>
  </UiPanel>
</div>
</template>


<style lang="scss" scoped>
.blocks {
  display: flex;
}
.block {
  display: flex;
  width: 50%;
  align-items: center;
  box-sizing: border-box;

  & + & {
    padding-left: 20px;
  }

  & > * {
    flex-shrink: 0;
  }
}
.block-content {
  padding-left: 18px;
}
.block-value {
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: #000000;
}
.block-label {
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.4px;
  color: #5e6366;
}
.section {
  margin-bottom: 32px;
}

.controls {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}

.submit-button {
  width: 140px;
  margin-left: 32px;
}
</style>
