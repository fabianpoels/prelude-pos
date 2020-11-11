<template>
  <b-card class="mb-2" :border-variant="valid ? 'success' : ''">
    <div class="d-flex flex-column">
      <div class="d-flex flex-row justify-content-between align-items-center cardTitle">
        <div class="h5"><slot name="title"></slot></div>
        <div><slot name="title-info"></slot></div>
      </div>
      <slot></slot>
    </div>
  </b-card>
</template>
<script>
export default {
  props: {
    valid: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
