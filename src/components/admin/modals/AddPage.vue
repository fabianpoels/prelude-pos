<template>
  <b-modal v-model="showModal" id="addPageModal" :title="$t('layout.add_page')" body-bg-variant="100" no-close-on-backdrop>
    <b-form class="my-3">
      <b-form-group id="name" :label="$t('form.name')" label-for="name-input">
        <b-form-input id="name-input" v-model="newPage.name" required />
      </b-form-group>
      <b-form-group id="icon" :label="$t('layout.icon')" label-for="icon-input">
        <el-select id="icon-input" v-model="newPage.icon" :placeholder="$t('layout.choose_icon')" class="w-100">
          <el-option v-for="icon in icons" :key="icon" :value="icon">
            <span style="display: inline-block; width: 20px; height: 20px;">
              <font-awesome-icon :icon="['fas', icon]" />
            </span>
          </el-option>
        </el-select>
      </b-form-group>
    </b-form>

    <div slot="modal-footer">
      <save-button :disabled="newPage.name && newPage.name.length < 1" :saving="saving" @click="createPage()">{{ $t('form.save') }}</save-button>
    </div>
  </b-modal>
</template>

<script>
import config from '@/config/config'
import SaveButton from '@/components/shared/SaveButton'
export default {
  data: function() {
    return {
      showModal: false,
      saving: false,
      newPage: {},
    }
  },

  components: {
    SaveButton,
  },

  watch: {
    showModal(value) {
      if (value) {
        this.newPage = this.blankPage()
      }
    },
  },

  computed: {
    icons() {
      return config.pageIcons
    },
  },

  methods: {
    blankPage() {
      return {
        name: '',
      }
    },

    async createPage() {
      this.saving = true
      await this.$store.dispatch('createPage', this.newPage)
      this.$bvToast.toast(`${this.newPage.name}`, {
        title: this.$i18n.t('forms.page.page_added'),
        variant: 'success',
        solid: true,
        toaster: 'b-toaster-top-center',
      })
      this.saving = false
      this.showModal = false
    },
  },
}
</script>
