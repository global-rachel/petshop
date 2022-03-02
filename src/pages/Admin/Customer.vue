<template>
  <div>
    <AdminTitle :items="breadcrumbItems" />
    <v-divider class="my-6"></v-divider>
    <v-data-table
      :headers="headers"
      :items="formatedData"
      :loading="isLoading"
      :options.sync="options"
      :server-items-length="totalLength"
      :footer-props="{ 'items-per-page-options': perPageDropdown }"
      loading-text="Loading... Please wait"
      class="table"
    >
      <!-- Table Top -->
      <template v-slot:top>
        <v-toolbar flat :height="'fit-content'">
          <div>All Customers</div>
          <div
            class="d-flex"
            :class="{
              'w-100 justify-space-between my-2 flex-wrap':
                $vuetify.breakpoint.mobile,
              'ml-auto': !$vuetify.breakpoint.mobile,
            }"
          >
            <v-btn
              color="primary"
              dark
              class="mr-3"
              @click="() => (isAddCustomer = true)"
            >
              <v-icon class="x-button" size="14px"> mdi-plus </v-icon>
              Add New Customers
            </v-btn>
            <v-divider class="mx-4" inset vertical></v-divider>
            <a
              href="#"
              class="filter-icon mx-7 d-flex align-center"
              @click="() => (isFilterOpen = !isFilterOpen)"
              >Filter
              <v-icon class="ml-5">
                {{
                  isFilterOpen ? "mdi-chevron-up" : "mdi-chevron-down"
                }}</v-icon
              ></a
            >
          </div>
        </v-toolbar>
        <!--  Filter Area -->
        <v-row
          transition="scroll-y-transition"
          v-if="isFilterOpen"
          class="filter-container"
        >
          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>
          <v-col
            cols="12"
            md="4"
            sm="6"
            v-for="filter in filterInputeText"
            :key="filter.key"
          >
            <v-text-field
              v-model="filterValue[filter.key]"
              append-icon="mdi-magnify"
              :label="`Customer ${$capitalizeString(filter.label)}`"
              single-line
              hide-details
              outlined
              dense
              color="rgba(0, 0, 0, 0.54)"
            />
          </v-col>
          <!-- Date Picker & Dropdown-->
          <v-col cols="12" md="4" sm="6" class="d-flex">
            <v-menu class="w-50">
              <v-date-picker
                v-model="filterValue.created_at"
                no-title
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">
                  Cancel
                </v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(date)">
                  OK
                </v-btn>
              </v-date-picker>
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  width="40px"
                  dense
                  v-model="filterValue.created_at"
                  label="Picker in menu"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  class="dateInput relative"
                  outlined
                ></v-text-field>
              </template>
            </v-menu>

            <!-- Dropdown -->
            <div class="w-50 ml-3">
              <v-select
                v-model="filterValue.marketing"
                :items="marketingFilter"
                label="Marketing Preference"
                item-text="title"
                item-value="value"
                dense
                outlined
              ></v-select>
            </div>
          </v-col>
          <v-col>
            <v-btn
              color="orange"
              class="mr-3 white--text"
              depressed
              :disabled="!isFilterActive"
              height="40"
              @click="resetFilter()"
            >
              Reset
            </v-btn>
          </v-col>
        </v-row>

        <!-- Pop up -->
        <EditCustomer
          ref="editCustomerModal"
          v-if="isEditCustomer"
          @closeModal="isEditCustomer = false"
          @modalBtnClick="sendEditUserAPI"
          :modalTitle="'Edit Customer'"
          :btnText="'Edit Customer'"
          :editedItem="editedItem"
          :isModalLoading="isModalLoading"
          :alert="modalAlert"
        />
        <EditCustomer
          ref="addCustomerModal"
          v-if="isAddCustomer"
          @closeModal="isAddCustomer = false"
          @modalBtnClick="sendEditUserAPI"
          :modalTitle="'Add Customer'"
          :btnText="'Add New Customer'"
          :isModalLoading="isModalLoading"
          :alert="modalAlert"
        />
      </template>

      <!-- Customized Columns -->
      <!-- Name -->
      <template v-slot:item.name="{ item }">
        <v-avatar v-if="item.avatar" size="44" color="white" class="my-5 mr-6">
          <img
            src="https://cdn.vuetifyjs.com/images/john.jpg"
            alt="item.name"
          />
        </v-avatar>
        <v-btn
          v-if="!item.avatar"
          small
          fab
          color="primary"
          elevation="0"
          class="my-5 mr-6"
        >
          <span class="white--text avatar-text">
            {{ item.name[0] }}
          </span>
        </v-btn>
        {{ item.name }}
      </template>

      <!-- Date -->
      <template v-slot:item.created_at="{ item }">
        {{ item.created_at_date }} <br />
        <span class="small-text">{{ item.created_at_time }}</span>
      </template>

      <!-- Marketing Preference -->
      <template v-slot:item.is_marketing="{ item }">
        <v-chip :color="getColor(item.is_marketing)" dark>
          {{ getMktText(item.is_marketing) }}
        </v-chip>
      </template>

      <!-- Setting -->
      <template v-slot:item.actions="{ item }">
        <IconButton
          v-if="isShowIcon && !isShowDelete && item.uuid === clickedItem"
          @btnClick="editItem(item)"
          class="mr-4"
          :color="'white'"
          :icon="'mdi-pencil'"
        />
        <IconButton
          v-if="isShowDelete && isShowIcon && item.uuid === clickedItem"
          @btnClick="deleteItem(item)"
          class="mr-4"
          :color="'white'"
          :classString="'success--text'"
          :icon="'mdi-check'"
        />
        <IconButton
          v-if="isShowDelete && isShowIcon && item.uuid === clickedItem"
          @btnClick="() => (isShowDelete = false)"
          class="mr-4"
          :classString="'red--text'"
          :color="'white'"
          :icon="'mdi-window-close'"
        />
        <IconButton
          v-if="isShowIcon && item.uuid === clickedItem"
          @btnClick="() => (isShowDelete = true)"
          :color="'white'"
          class="mr-4"
          :icon="'mdi-delete'"
          :btnStyle="
            item.isShowDelete ? 'border: 2px solid #4EC690!important' : ''
          "
        />
        <IconButton
          @btnClick="handleIconClick(item)"
          :icon="'mdi-dots-vertical'"
          :color="item.isShowIcon ? 'primary' : ''"
        />
      </template>

      <!-- No Data -->
      <template v-slot:no-data> No Data </template>
    </v-data-table>
  </div>
</template>
<script>
import AdminTitle from "@/components/Admin/AdminTitle.vue";
import IconButton from "@/components/IconButton.vue";
import EditCustomer from "@/components/Admin/EditCustomer.vue";
export default {
  components: { AdminTitle, IconButton, EditCustomer },
  data: () => ({
    breadcrumbItems: [
      {
        text: "Dashboard",
        disabled: false,
        href: "breadcrumbs_dashboard",
      },
      {
        text: "",
        disabled: false,
        href: "",
      },
    ],
    filterInputeText: [
      { label: "name", key: "first_name" },
      { label: "email", key: "email" },
      { label: "phone", key: "phone_number" },
      { label: "address", key: "address" },
    ],
    filterValue: {
      first_name: "",
      email: "",
      phone_number: "",
      address: "",
      created_at: "",
      marketing: "",
    },
    isFilterOpen: false,
    marketingFilter: [
      { title: "Yes", value: "1" },
      { title: "No", value: "0" },
    ],
    isAddCustomer: false,
    isEditCustomer: false,
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Email", value: "email", sortable: false },
      { text: "Phone", value: "phone_number", sortable: false },
      { text: "Address", value: "address", sortable: false },
      {
        text: "Date Created",
        value: "created_at",
        sortable: false,
      },
      {
        text: "Marketing Preferences",
        value: "is_marketing",
        sortable: false,
      },
      {
        text: "",
        align: "end",
        value: "actions",
        sortable: false,
        width: "240px",
      },
    ],
    resData: [],
    editedItem: null,
    clickedItem: null,
    isShowIcon: false,
    isShowDelete: false,
    isLoading: false,
    isModalLoading: false,
    modalAlert: false,
    totalLength: null,
    perPageDropdown: [8, 16, 30],
    options: {
      page: 1,
      itemsPerPage: null,
    },
    timoutId: null,
    callAPItimes: 0,
  }),
  computed: {
    isFilterActive() {
      let isFiltering = false;
      Object.keys(this.filterValue).forEach((key) => {
        if (this.filterValue[key].length > 0) isFiltering = true;
      });
      return isFiltering;
    },
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    formatedData() {
      return this.resData.map((item) => {
        return {
          uuid: item.uuid,
          address: item.address,
          avatar: item.avatar,
          created_at_date: this.$getGeneralDate(item.created_at),
          created_at_time: this.$toLocaleTimeString(item.created_at),
          email: item.email,
          name: `${item.first_name} ${item.last_name}`,
          is_marketing: item.is_marketing + "",
          first_name: item.first_name,
          last_name: item.last_name,
          phone_number: item.phone_number,
          isShowIcon: false,
          isShowDelete: false,
        };
      });
    },
  },
  watch: {
    options: {
      handler() {
        this.getUserListingAPI();
      },
      deep: true,
    },
    filterValue: {
      handler() {
        // Avoid double API calling with watch/options
        if (!this.callAPItimes) return;
        clearTimeout(this.timoutId);
        this.options.page = 1;
        // Will auto-search if the user is not typing for 2 secs
        this.timoutId = setTimeout(() => this.getUserListingAPI(), 2000);
      },
      deep: true,
    },
  },
  methods: {
    async getUserListingAPI() {
      this.isLoading = true;
      let payload = {
        page: this.options.page,
        limit: this.options.itemsPerPage,
      };
      if (this.isFilterActive) payload = { ...payload, ...this.filterValue };
      this.callAPItimes += 1;
      const { data } = await this.$store.dispatch("getAllUsersAPI", payload);
      this.resData = data.data;
      this.totalLength = data.total;
      this.isLoading = false;
    },
    async sendEditUserAPI(payload) {
      this.clickedItem = null;
      try {
        this.isModalLoading = true;
        if (this.isAddCustomer) {
          await this.$store.dispatch("createUserAPI", payload);
          this.isAddCustomer = false;
        }
        if (this.isEditCustomer) {
          await this.$store.dispatch("editUserAPI", payload);
          this.isEditCustomer = false;
        }
        this.getUserListingAPI();
      } catch (error) {
        if (this.isAddCustomer) this.$refs.addCustomerModal.alert = true;
        this.$refs.addCustomerModal.msg = error.response?.data?.error;

        // Show error for a few secs
        setTimeout(() => {
          this.isAddCustomer = false;
          this.isEditCustomer = false;
        }, 3000);
      } finally {
        this.isModalLoading = false;
      }
    },
    handleIconClick(item) {
      if (this.clickedItem === item.uuid) this.isShowIcon = !this.isShowIcon;
      else this.isShowIcon = true;

      this.clickedItem = item.uuid;
      this.isShowDelete = false;
    },
    getColor(value) {
      if (value === "1") return "primary";
      else return "orange";
    },
    getMktText(value) {
      if (value === "1") return "Yes";
      else return "No";
    },
    editItem(item) {
      this.editedItem = item;
      this.isEditCustomer = true;
    },
    async deleteItem(item) {
      await this.$store.dispatch("deleteUserAPI", item.uuid);
      this.isShowDelete = false;

      // After deleting, need some time to wait DB to update
      setTimeout(() => {
        this.getUserListingAPI();
        this.clickedItem = false;
      }, 2000);
    },
    resetFilter() {
      Object.keys(this.filterValue).forEach((key) => {
        this.filterValue[key] = "";
      });
    },
  },
  created() {
    this.options.itemsPerPage = this.perPageDropdown[0];
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/common";
$secondary-black: rgba(0, 0, 0, 0.87);
$tertiary-black: rgba(0, 0, 0, 0.54);
$fourth-black: rgba(0, 0, 0, 0.23);

.table {
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  font-size: 14px;
  color: $secondary-black;

  .filter-icon {
    font-size: 14px;
    color: $tertiary-black;
  }

  .small-text {
    font-size: 12px;
    color: $tertiary-black;
  }

  .filter-container {
    background: white;
    border-radius: 0 0 4px 4px;
    width: 100%;
    top: 100%;
    left: 0%;
    box-shadow: 0px 3px 3px rgb(0 0 0 / 12%);
  }

  .avatar-text {
    font-size: 20px;
  }
}

::v-deep tr:hover {
  background: $lightGreen !important;
}

::v-deep .row {
  margin: 0px;
}

::v-deep .v-input__prepend-outer {
  position: absolute;
  right: 0;
}

::v-deep button {
  text-transform: initial;
}

::v-deep .v-toolbar__content {
  position: relative;
  width: 100%;
  flex-wrap: wrap;
}

.filterDropdown {
  border: 1px solid $tertiary-black;
  padding: 0 12px !important;

  ::v-deep span {
    width: 100%;
    white-space: pre-wrap;
    text-align: left;
  }

  ::v-deep .v-btn__content {
    color: $tertiary-black;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: normal;
  }
}
</style>
