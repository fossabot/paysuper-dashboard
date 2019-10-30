const filters = {
  quickFilter: {
    defaultValue: '',
    apiQueryName: 'name',
  },

  sort: {
    defaultValue: () => [],
  },

  limit: {
    isPassingToQueryDisabled: true,
    defaultValue: 30,
  },

  offset: {
    isPassingToQueryDisabled: true,
    defaultValue: 0,
  },

  status: {
    defaultValue: () => [],
  },

  dateFrom: {
    defaultValue: null,
    apiQueryName: 'period_from',
  },

  dateTo: {
    defaultValue: null,
    apiQueryName: 'period_to',
  },
};

export default {
  filters,
};
