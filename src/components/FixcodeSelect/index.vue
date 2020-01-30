<template>
  <el-select v-model="selectedItem" :placeholder="placeholder" clearable class="filter-item" :style="css">
    <el-option v-for="item in options" :key="item.key" :label="item.value" :value="item.key" />
  </el-select>
</template>

<script>
import { getSelectOption } from '@/utils/fixcode'

export default {
  name: 'FixcodeSelect',
  props: {
    placeholder: {
      required: false,
      type: String,
      default: ''
    },
    model: {
      required: true,
      type: String
    },
    css: {
      required: false,
      type: String,
      default: ''
    },
    type: {
      required: true,
      type: String
    }
  },
  data: function() {
    return {
      options: [],
      sdata: ''
    }
  },
  computed: {
    selectedItem: {
      get() {
        return this.model
      },
      set(val) {
        this.$emit('update:model', val)
      }
    }
  },
  created() {
    this.options = getSelectOption(this.type)
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
