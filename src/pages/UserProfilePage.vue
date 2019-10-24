<script>
import { mapState, mapActions } from 'vuex';
import { findKey, size } from 'lodash-es';
import UserProfilePerson from '@/components/UserProfilePerson.vue';
import UserProfileHelp from '@/components/UserProfileHelp.vue';
import UserProfileCompany from '@/components/UserProfileCompany.vue';
import StepsProgressBar from '@/components/StepsProgressBar.vue';
import ConfirmYourEmail from '@/components/ConfirmYourEmail.vue';
import Notifications from '@/mixins/Notifications';

export default {
  name: 'UserProfilePage',

  mixins: [Notifications],

  components: {
    UserProfilePerson,
    UserProfileHelp,
    UserProfileCompany,
    StepsProgressBar,
    ConfirmYourEmail,
  },

  data() {
    return {
      steps: {
        personal: {
          name: 'About yourself',
          component: 'UserProfilePerson',
          position: 1,
          isValid: false,
          dataSectionName: 'personal',
        },
        help: {
          name: 'How we can help',
          component: 'UserProfileHelp',
          position: 2,
          isValid: false,
          dataSectionName: 'help',
        },
        company: {
          name: 'About your company and games',
          component: 'UserProfileCompany',
          position: 3,
          isValid: false,
          dataSectionName: 'company',
        },
      },
    };
  },

  computed: {
    ...mapState('User/Profile', ['profile', 'currentStepCode']),

    isConfirmEmailStep() {
      return this.currentStepCode === 'confirmEmail';
    },

    currentStep() {
      return this.steps[this.currentStepCode];
    },

    isFinalStep() {
      if (!this.currentStep) {
        return false;
      }
      return this.currentStep.position === size(this.steps);
    },

    isGoNextEnabled() {
      if (!this.currentStep) {
        return false;
      }
      return this.currentStep.isValid;
    },
  },

  mounted() {
    if (this.currentStepCode === 'confirmEmail') {
      this.waitForEmailConfirm();
      this.$router.push({ name: 'Dashboard' });
    }
  },

  methods: {
    ...mapActions('User', ['setEmailConfirmed']),
    ...mapActions('User/Profile', ['updateProfile', 'setCurrentStepCode', 'waitForEmailConfirm']),

    handleStepComplete(value) {
      this.currentStep.isValid = value;
    },

    async goNext() {
      const nextStepCode = findKey(this.steps, { position: this.currentStep.position + 1 })
        || 'confirmEmail';
      const { dataSectionName } = this.currentStep;
      try {
        await this.updateProfile({
          [dataSectionName]: this.profile[dataSectionName],
          ...(nextStepCode ? { last_step: nextStepCode } : {}),
        });

        this.setCurrentStepCode(nextStepCode);

        if (nextStepCode === 'confirmEmail') {
          await this.waitForEmailConfirm();
          this.setEmailConfirmed(true);
          this.$router.push({ name: 'Dashboard' });
        }
      } catch (error) {
        this.$_Notifications_showErrorMessage(error.message);
      }
    },

    goBack() {
      const prevStepCode = findKey(this.steps, { position: this.currentStep.position - 1 });
      if (prevStepCode) {
        this.setCurrentStepCode(prevStepCode);
      }
    },
  },
};
</script>

<template>
<div class="user-profile">
  <div class="wrapper">
    <ConfirmYourEmail v-if="isConfirmEmailStep" />
    <template v-if="!isConfirmEmailStep">
      <StepsProgressBar
        class="progress-bar"
        :stepsCount="3"
        :currentStep="currentStep.position"
        :currentStepName="currentStep.name"
      />
      <component
        :is="currentStep.component"
        :profile="profile"
        @valid="handleStepComplete"
      />

      <div class="controls">
        <UiButton
          v-if="currentStep.position > 1"
          class="controls__button"
          :isTransparent="true"
          @click="goBack"
        >
          BACK
        </UiButton>
        <UiButton
          v-if="isFinalStep"
          class="controls__button"
          color="green"
          :disabled="!isGoNextEnabled"
          @click="goNext"
        >
          DONE
        </UiButton>
        <UiButton
          v-else
          class="controls__button"
          :disabled="!isGoNextEnabled"
          @click="goNext"
        >
          NEXT
        </UiButton>
      </div>
    </template>
  </div>
</div>
</template>


<style lang="scss" scoped>
.user-profile {
  padding-bottom: 40px;
}

.wrapper {
  width: 450px;
}

.progress-bar {
  margin-bottom: 48px;
}

.controls {
  display: flex;
  justify-content: flex-end;
  margin-top: 36px;

  &__button {
    width: 120px;

    & + & {
      margin-left: 12px;
    }
  }
}
</style>
