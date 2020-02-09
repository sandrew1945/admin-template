<template>
  <div>
    <slot />
    <template v-for="(column, index) in columns">
      <el-table-column v-if="column.type === 'fixcode'" :key="index" :label="column.header" :width="column.width" :type="column.type" :prop="column.dataIndex" :formatter="getFixCodeDesc" align="center" />
      <el-table-column v-else-if="column.type === 'data'" :key="index" :label="column.header" :width="column.width" :type="column.type" :prop="column.dataIndex" align="center" />
      <el-table-column v-else :key="index" :label="column.header" :width="column.width" :type="column.type" align="center" />
    </template>

  </div>
</template>

<script>
import { getfixCodeDesc } from '@/utils/fixcode'

export default {
  name: 'Column',
  filters: {
    fixcodeFilter(fixcode) {
      return getfixCodeDesc(fixcode)
    }
  },
  props: {
    // route object
    columns: {
      type: Array,
      required: true
    }
  },
  methods: {
    getFixCodeDesc(row, column, cellValue, index) {
      return getfixCodeDesc(cellValue)
    }
  }
}

</script>
