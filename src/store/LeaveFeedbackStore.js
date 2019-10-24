
import axios from 'axios';
import { get } from 'lodash-es';

export default function createLeaveFeedbackStore() {
  return {
    actions: {
      initState() { },

      async postFeedback({ rootState }, review) {
        try {
          await axios.post(
            `${rootState.config.apiUrl}/api/v1/user/feedback`,
            {
              review,
              page_id: 'primary_onboarding',
            },
          );
        } catch (error) {
          console.error(error);
          throw new Error(
            get(error, 'response.data.message', 'Unknown error'),
          );
        }
      },
    },

    namespaced: true,
  };
}
