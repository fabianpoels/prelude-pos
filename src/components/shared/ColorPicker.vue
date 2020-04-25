<template>
  <el-color-picker v-if="showPalette" :predefine="palette" v-model="localValue" :disabled="disabled" />
  <el-color-picker v-else v-model="localValue" :disabled="disabled" />
</template>
<script>
import config from '@/config/config'
import { Button, ColorPicker } from 'element-ui'
import Vue from 'vue'
Vue.use(Button)
Vue.use(ColorPicker)
export default {
  props: {
    showPalette: {
      type: Boolean,
      default: false,
    },
    showCustomPicker: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: '',
    },
    id: String,
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    palette() {
      return config.defaultColors
    },

    localValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
}
</script>
