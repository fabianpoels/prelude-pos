<template>
  <b-modal v-model="showModal" :id="`addItemButton-${page.id}-${x}-${y}`" :title="$t('layout.add_button')" body-bg-variant="100" no-close-on-backdrop>
    <b-form class="my-3">
      <b-form-group id="item" :label="$t('datastructure.item')" label-for="item-input">
        <el-select id="item-input" v-model="newButton.item" :placeholder="$t('datastructure.item')" class="w-100" filterable>
          <el-option-group v-for="category in categories" :key="category.id">
            <span class="category-dot ml-2" :style="{ backgroundColor: category.color }"></span>
            <span class="ml-2">{{ category.name }}</span>
            <el-option v-for="item in itemsForCategory(category)" :key="item.id" :label="item.name" :value="item.id">
              <span>{{ item.name }}</span>
            </el-option>
          </el-option-group>
        </el-select>
      </b-form-group>
      <b-form-group id="color" :label="$t('form.color')" label-for="color-input">
        <color-picker class="mr-2" showPalette v-model="newButton.color" />
      </b-form-group>
    </b-form>

    <div slot="modal-footer">
      <save-button :disabled="!newButton.item || (newButton.item && newButton.item.length < 1)" :saving="saving" @click="addButton()">{{ $t('form.save') }}</save-button>
    </div>
  </b-modal>
</template>
<script>
import { mapGetters } from 'vuex'
import ColorPicker from '@/components/shared/ColorPicker'
import SaveButton from '@/components/shared/SaveButton'
export default {
  props: {
    page: {
      type: Object,
      required: true,
    },
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
  },

  components: {
    ColorPicker,
    SaveButton,
  },

  data() {
    return {
      newButton: this.blankButton(),
      showModal: false,
      saving: false,
    }
  },

  watch: {
    'newButton.item'(id) {
      let category = this.categoryById(this.itemById(id.toString()).category.toString())
      this.newButton.color = category.color
    },
  },

  computed: {
    ...mapGetters(['categories', 'itemsForCategory', 'itemById', 'categoryById']),
  },

  methods: {
    async addButton() {
      this.saving = true
      await this.$store.dispatch('addButtonToPage', { page: { ...this.page }, button: this.newButton })
      this.saving = false
      this.showModal = false
    },

    blankButton() {
      return {
        key: `${this.x}:${this.y}`,
        item: '',
      }
    },
  },
}
</script>
<style scoped>
.category-dot {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border-collapse: collapse;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  box-sizing: content-box;
  display: inline-block;
  height: 10px;
  width: 10px;
}
</style>
