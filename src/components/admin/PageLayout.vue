<template>
  <div>
    <default-card class="my-3">
      <div class="d-flex flex-row justify-content-between">
        <div>
          <font-awesome-icon :icon="['fas', page.icon]" v-if="page.icon" size="2x" />
          <span class="h3 ml-2">{{ page.name }}</span>
        </div>
        <div>
          <b-input-group>
            <b-input-group-prepend>
              <b-btn variant="secondary" @click="addRow()" :disabled="page.rows === maxRows || saving">
                <font-awesome-icon :icon="['fas', 'plus']" />
              </b-btn>
            </b-input-group-prepend>
            <b-input-group-text>{{ $t('layout.rows') }}: {{ page.rows }}</b-input-group-text>
            <b-input-group-append>
              <b-btn variant="secondary" @click="removeRow()" :disabled="!removeRowAllowed(page) || saving">
                <font-awesome-icon :icon="['fas', 'minus']" />
              </b-btn>
            </b-input-group-append>
          </b-input-group>
        </div>
        <div>
          <b-input-group>
            <b-input-group-prepend>
              <b-btn variant="secondary" @click="addCol()" :disabled="page.cols === maxCols || saving">
                <font-awesome-icon :icon="['fas', 'plus']" />
              </b-btn>
            </b-input-group-prepend>
            <b-input-group-text>{{ $t('layout.columns') }}: {{ page.cols }}</b-input-group-text>
            <b-input-group-append>
              <b-btn variant="secondary" @click="removeCol()" :disabled="!removeColAllowed(page) || saving">
                <font-awesome-icon :icon="['fas', 'minus']" />
              </b-btn>
            </b-input-group-append>
          </b-input-group>
        </div>
        <div>
          <b-btn variant="primary" @click="$emit('done')" :disabled="saving">{{ $t('form.done') }}</b-btn>
        </div>
      </div>
    </default-card>
    <b-overlay :show="saving" rounded="sm">
      <div class="buttonContainer">
        <div v-for="y in page.rows" :key="y" class="buttonRow">
          <div v-for="x in page.cols" :key="x" class="buttonCol">
            <layout-button :x="x" :y="y" :pageId="page._id" class="itemButton p-2" />
          </div>
        </div>
      </div>
    </b-overlay>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import config from '@/config/config'
import DefaultCard from '@/components/shared/DefaultCard'
import LayoutButton from '@/components/admin/_LayoutButton'
export default {
  components: {
    DefaultCard,
    LayoutButton,
  },

  props: {
    pageId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      saving: false,
    }
  },

  computed: {
    ...mapGetters(['businessUnits', 'categoriesForBusinessUnit', 'itemsForCategory', 'pageById', 'removeRowAllowed', 'removeColAllowed']),

    maxRows() {
      return config.layout.maxRows
    },

    maxCols() {
      return config.layout.maxCols
    },

    page() {
      return this.pageById(this.pageId)
    },
  },

  methods: {
    async addRow() {
      if (this.page.rows < this.maxRows) {
        this.saving = true
        let editPage = { ...this.page }
        editPage.rows++
        await this.$store.dispatch('updatePage', editPage)
        this.saving = false
      }
    },

    async removeRow() {
      if (this.removeRowAllowed(this.page)) {
        this.saving = true
        let editPage = { ...this.page }
        editPage.rows--
        await this.$store.dispatch('updatePage', editPage)
        this.saving = false
      }
    },

    async addCol() {
      if (this.page.cols < this.maxCols) {
        this.saving = true
        let editPage = { ...this.page }
        editPage.cols++
        await this.$store.dispatch('updatePage', editPage)
        this.saving = false
      }
    },

    async removeCol() {
      if (this.removeColAllowed(this.page)) {
        this.saving = true
        let editPage = { ...this.page }
        editPage.cols--
        await this.$store.dispatch('updatePage', editPage)
        this.saving = false
      }
    },
  },
}
</script>
<style scoped>
.buttonContainer {
  width: 100%;
  height: 100%;
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
