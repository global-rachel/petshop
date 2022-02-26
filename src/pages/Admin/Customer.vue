<template>
  <div>
    <AdminTitle :items="breadcrumbItems" />
    <v-divider class="my-6"></v-divider>
    <v-data-table :headers="headers" :items="formatedData" class="table">
      <!-- Table Top -->
      <template v-slot:top>
        <v-toolbar flat style="position: relative">
          <div>All Customers</div>
          <v-spacer></v-spacer>

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
            class="filter-icon mx-7"
            @click="() => (isFilterOpen = !isFilterOpen)"
            >Filter
            <v-icon class="ml-5">
              {{ isFilterOpen ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon
            ></a
          >
        </v-toolbar>
        <!--  Filter Area -->
        <v-row
          transition="scroll-y-transition"
          v-if="isFilterOpen"
          class="elevation-1"
          style="background: white; width: 100%; top: 100%; left: 0%"
        >
          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>
          <v-col cols="4" v-for="filter in filterInputeText" :key="filter.key">
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
          <v-col cols="4 d-flex">
            <v-menu class="w-50">
              <v-date-picker
                v-model="filterValue.created_at_date"
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
                  v-model="filterValue.created_at_date"
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
                v-model="filterValue.is_marketing"
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
          v-if="isEditCustomer"
          @closeModal="isEditCustomer = false"
          @modalBtnClick="sendEditUserAPI"
          :title="'Edit Customer'"
          :btnText="'Edit Customer'"
          :editedItem="editedItem"
        />
        <EditCustomer
          v-if="isAddCustomer"
          @closeModal="isAddCustomer = false"
          @modalBtnClick="sendEditUserAPI"
          :title="'Add Customer'"
          :btnText="'Add New Customer'"
        />
      </template>

      <!-- Customized Columns -->
      <!-- Name -->
      <template v-slot:item.name="{ item }">
        <v-avatar v-if="item.avatar" size="44" color="white" class="my-5 mr-6">
          <img :src="item.avatar" alt="John" />
        </v-avatar>
        <v-btn
          v-if="!item.avatar"
          small
          fab
          color="primary"
          elevation="0"
          class="my-5 mr-6"
        >
          <span class="white--text" style="font-size: 20px">
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
          v-if="item.isShowIcon && !item.isShowDelete"
          @btnClick="editItem(item)"
          class="mr-4"
          :color="'white'"
          :icon="'mdi-pencil'"
        />
        <IconButton
          v-if="item.isShowDelete && item.isShowIcon"
          @btnClick="deleteItem(item)"
          class="mr-4"
          :color="'white'"
          :classString="'success--text'"
          :icon="'mdi-check'"
        />
        <IconButton
          v-if="item.isShowDelete && item.isShowIcon"
          @btnClick="() => (item.isShowDelete = false)"
          class="mr-4"
          :classString="'red--text'"
          :color="'white'"
          :icon="'mdi-window-close'"
        />
        <IconButton
          v-if="item.isShowIcon"
          @btnClick="() => (item.isShowDelete = true)"
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
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
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
      { label: "name", key: "name" },
      { label: "email", key: "email" },
      { label: "phone", key: "phone_number" },
      { label: "address", key: "address" },
    ],
    filterValue: {
      name: "",
      email: "",
      phone_number: "",
      address: "",
      created_at_date: "",
      is_marketing: "",
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
    desserts: [],
    editedItem: null,
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
      return this.desserts
        .map((item) => {
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
        })
        .filter((item) => {
          let pass = true;
          Object.keys(this.filterValue).forEach((filterKey) => {
            if (
              filterKey !== "created_at_date" &&
              this.filterValue[filterKey] !== "" &&
              !item[filterKey].includes(this.filterValue[filterKey])
            )
              pass = false;

            if (
              this.filterValue.created_at_date !== "" &&
              this.$getGeneralDate(this.filterValue.created_at_date) !==
                item.created_at_date
            ) {
              pass = false;
            }
          });

          return pass;
        });
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  methods: {
    async initialize() {
      const { data } = await this.$store.dispatch("getAllUsersAPI");
      this.desserts = data.data;
    },
    async sendEditUserAPI(payload) {
      try {
        if (this.isAddCustomer) {
          await this.$store.dispatch("createUserAPI", payload);
          this.isAddCustomer = false;
        }
        if (this.isEditCustomer) {
          await this.$store.dispatch("editUserAPI", payload);
          this.isEditCustomer = false;
        }
        this.initialize();
      } catch (error) {
        // TODO:
        // this.snackbar = true;
        this.msg = error;
      }
    },
    handleIconClick(item) {
      item.isShowIcon = !item.isShowIcon;
      item.isShowDelete = false;
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
    deleteItem(item) {
      this.$store.dispatch("deleteUserAPI", item.uuid);
      this.isShowDelete = false;
      this.initialize();
    },
    resetFilter() {
      Object.keys(this.filterValue).forEach((key) => {
        this.filterValue[key] = "";
      });
    },
  },
  created() {
    this.initialize();
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
