<template>
  <div>
    <PageHeader :breadcrumbs="[{label: '...', url: '/'}]" title="Projects">
      <template slot="right">
        <div>
          <a href="#" @click="viewType = 'panels'">panels</a>
          /
          <a href="#" @click="viewType = 'table'">table</a>
          &nbsp;
        </div>
        <nuxt-link
          to="/project/add"
        >
          <Button>Create project</Button>
        </nuxt-link>
      </template>
    </PageHeader>

    <div class="content-wrapper" v-if="viewType === 'panels' || !projects.length">
      <div v-if="projects.length" class="cont-list">
        <PanelItem
          v-for="project in projects"
          :key="project.id"
          :id="project.id"
          :title="project.name"
          :status="project.is_active ? 'complete' : 'initial'"
        />
      </div>
      <p v-else>Projects list is empty</p>
    </div>

    <ui-table v-if="viewType === 'table'">
      <ui-table-row :isHead="true">
        <ui-table-cell>Name</ui-table-cell>
        <ui-table-cell>Product ID</ui-table-cell>
        <ui-table-cell>Status</ui-table-cell>
        <ui-table-cell>Creation date</ui-table-cell>
      </ui-table-row>
      <ui-table-row
        v-for="project in projects"
        :key="project.id"
        :link="{
          url: `/project/${project.id}`,
          router: true
        }"
      >
        <ui-table-cell>{{project.name}}</ui-table-cell>
        <ui-table-cell>{{project.id}}</ui-table-cell>
        <ui-table-cell>
          <StatusIcon :status="project.is_active ? 'complete' : 'initial'" />
        </ui-table-cell>
        <ui-table-cell>{{project.created_at}}</ui-table-cell>
      </ui-table-row>
    </ui-table>
  </div>
</template>

<script>
import axios from 'axios';
import {
  Button,
  UiTable,
  UiTableCell,
  UiTableRow,
  PageHeader,
} from '@protocol-one/ui-kit';
import PanelItem from '@/components/PanelItem.vue';
import StatusIcon from '@/components/StatusIcon.vue';

export default {
  middleware: 'IsNotAuthenticated',
  components: {
    Button,
    PanelItem,
    UiTable,
    UiTableCell,
    UiTableRow,
    PageHeader,
    StatusIcon,
  },
  data() {
    return {
      projects: [],
      viewType: 'panels',
    };
  },
  mounted() {
    const self = this;

    axios.get(`${process.env.apiServerUrl}/api/v1/s/project`, {
      headers: { Authorization: `Bearer ${this.$store.state.user.accessToken}` },
    }).then((response) => {
      self.projects = response.data;
    }).catch(() => {});
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.content-wrapper {
  padding: 16px 32px;
}
.cont-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  & > * {
    margin-bottom: 30px;
    margin-right: 30px;
  }
}
</style>
