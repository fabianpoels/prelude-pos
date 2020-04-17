<template>
  <div id="mainContainer">
    <div class="buttonContainer p-3">
      <div v-for="y in page.rows" :key="y" class="buttonRow">
        <div v-for="x in page.cols" :key="x" class="buttonCol">
          <page-button :x="x" :y="y" :page="page" class="itemButton p-2" />
        </div>
      </div>
    </div>
    <cart-sidebar />
  </div>
</template>
<script>
import config from '@/config/config'
import { mapGetters } from 'vuex'
import CartSidebar from '@/components/page/sidebar/CartSidebar'
import PageButton from '@/components/page/_PageButton'
export default {
  components: {
    CartSidebar,
    PageButton,
  },

  computed: {
    ...mapGetters(['pageById']),

    page() {
      return this.pageById(this.$route.params.pageId)
    },

    maxRows() {
      return config.layout.maxRows
    },

    maxCols() {
      return config.layout.maxCols
    },
  },
}
</script>
<style scoped>
#mainContainer {
  width: 100vw;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: row;
}

.buttonContainer {
  width: calc(100vw - 500px);
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
}

.buttonRow {
  display: flex;
  flex-grow: 1;
}

.buttonCol {
  flex-grow: 1;
  flex-basis: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.itemButton {
  text-align: center;
  width: 100%;
  height: 100%;
}
</style>
