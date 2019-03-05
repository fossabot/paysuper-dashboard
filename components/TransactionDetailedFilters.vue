<template>
<div class="transaction-detailed-filters">
  <form @submit.prevent="submitFilters">
    <div class="short" v-if="!isDetailedSearchMode">
      <div class="short-filters">
        <div class="short-filters-item">
          <TextField label="Quick search" v-model="filters.quickFilter" />
        </div>
        <div class="short-filters-item">
          <DateInput label="Date" v-model="filters.date" />
        </div>
      </div>
      <div class="controls">
        <Button type="submit">Search</Button>
        <div class="controls-addition">
          or use
          <a href="#" @click.prevent="isDetailedSearchMode = true">Advanced search</a>
        </div>
      </div>
    </div>

    <div class="detailed" v-if="isDetailedSearchMode">
      <div class="detailed-filters">
        <div class="detailed-filters-single-column">
          <div class="detailed-filters-single-column-item">
            <DateInput dateLabel="Date from" v-model="filters.dateFrom" />
          </div>
          <div class="detailed-filters-single-column-item">
            <DateInput dateLabel="Date to" v-model="filters.dateTo" />
          </div>
        </div>
        <div class="detailed-filters-column">
          <div class="detailed-filters-item">
            <TagInput
              label="Project"
              indent="shallow"
              :tags="projects"
              v-model="filters.project"
            />
          </div>
          <div class="detailed-filters-item">
            <TagInput
              label="Status"
              indent="shallow"
              :tags="statuses"
              v-model="filters.status"
            />
          </div>
        </div>
        <div class="detailed-filters-column">
          <div class="detailed-filters-item">
            <TextField label="User details" v-model="filters.account" />
          </div>
          <div class="detailed-filters-item">

            <TagInput
              label="Payment system"
              indent="shallow"
              :tags="paymentMethods"
              v-model="filters.paymentMethod"
            />
          </div>
        </div>
        <div class="detailed-filters-column">
          <div class="detailed-filters-item">
            <TextField label="Transaction ID" v-model="filters.id" />
          </div>
          <div class="detailed-filters-item">
            <TextField label="External ID" v-model="filters.orderID" />
          </div>
        </div>
      </div>
      <div class="controls">
        <Button type="submit">Search</Button>
        <div class="controls-addition">
          <a href="#" @click.prevent="clearFilters">Clear</a>
          or use
          <a href="#" @click.prevent="isDetailedSearchMode = false">Quick search</a>
        </div>
      </div>
    </div>
  </form>
</div>
</template>

<script>
import { mapState } from 'vuex';
import { cloneDeep } from 'lodash-es';
import { Button, TagInput, TextField, DateInput } from '@protocol-one/ui-kit';

export default {
  components: {
    Button,
    TagInput,
    TextField,
    DateInput,
  },
  props: {
    getFilterValues: {
      type: Function,
      required: true,
    },
    getEmptyFilterValues: {
      type: Function,
      required: true,
    },
  },
  data() {
    const filterNames = [
      'id',
      'orderID',
      'account',
      'project',
      'status',
      'paymentMethod',
      'quickFilter',
      'date',
      'dateFrom',
      'dateTo',
    ];
    return {
      isDetailedSearchMode: true,
      filterNames,
      filters: this.getFilterValues(filterNames),
    };
  },
  computed: {
    ...mapState('order', ['paymentMethods', 'projects', 'statuses']),
  },

  methods: {
    submitFilters() {
      this.$emit('searchRequested', cloneDeep(this.filters));
    },

    clearFilters() {
      this.filters = this.getEmptyFilterValues(this.filterNames);
      this.submitFilters();
    },

    updateFiltersFromQuery() {
      this.filters = this.getFilterValues(this.filterNames);
    },
  },
};
</script>

<style lang="scss">
.transaction-detailed-filters {
  padding: 12px 30px 20px;
}

.short {
  display: flex;
  align-items: center;
}

.short-filters {
  display: flex;
}

.short-filters-item {
  width: 200px;
  margin-right: 40px;
}

.detailed-filters {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  max-width: 1100px;
}

.detailed-filters-single-column {
  width: 100%;
  box-sizing: border-box;
  padding-right: 70%;
  display: flex;
  justify-content: space-between;
}

.detailed-filters-single-column-item {
  width: 46%;
}

.detailed-filters-column {
  width: 30%;
}

.controls {
  display: flex;
  align-items: center;

  a {
    color: #2275D7;
  }
}
.controls-addition {
  margin-left: 22px;
}
</style>
