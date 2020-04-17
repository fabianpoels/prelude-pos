<template>
  <article class="baseLayoutArticle">
    <!-- <header class="baseLayoutHeader bg-white shadow-sm" v-if="hasTitleSlot || hasActionsSlot">
      <div :class="{'container-fluid': fullWidth, 'container': !fullWidth}">
        <div class="row align-items-center">
          <div class="col-auto py-2" v-if="hasTitleSlot">
            <h5 class="text-truncate mb-0">
              <slot name="title"></slot>
            </h5>
          </div>
          <div class="col py-2" v-if="hasActionsSlot">
            <div class="d-flex flex-fill align-items-center">
              <slot name="actions"></slot>
            </div>
          </div>
        </div>
      </div>
    </header>-->
    <main class="baseLayoutMain" id="base-layout-main">
      <b-container fluid>
        <!-- <div class="row">
        <div class="col-12 py-3">-->
        <slot></slot>
        <!-- </div>
        </div>-->
      </b-container>
    </main>
  </article>
</template>

<script>
export default {
  props: {
    fullWidth: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    hasTitleSlot() {
      return !!this.$slots.title
    },
    hasActionsSlot() {
      return !!this.$slots.actions
    },
  },
}
</script>

<style scoped>
.baseLayoutArticle {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
}

.baseLayoutMain {
  flex: 0 1 auto;
  overflow: auto;
}
</style>
