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
          <v-col cols="4" v-for="filter in filterInputeText" :key="filter">
            <v-text-field
              v-model="filterValue[filter]"
              append-icon="mdi-magnify"
              :label="`Customer ${$capitalizeString(filter)}`"
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
              <v-date-picker v-model="date" no-title scrollable>
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
                  v-model="date"
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
            <div class="text-center ml-3 w-50">
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    width="100%"
                    v-bind="attrs"
                    v-on="on"
                    outlined
                    class="filterDropdown"
                    height="40"
                    >Marketing Preference
                    <v-icon class="ml-3"> mdi-menu-down </v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item v-for="(item, index) in items" :key="index">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-col>
          <v-col>
            <v-btn
              color="primary"
              class="mr-3"
              v-bind="attrs"
              v-on="on"
              depressed
              disabled
              height="40"
            >
              Reset
            </v-btn>
          </v-col>
        </v-row>

        <!-- Pop up -->
        <EditCustomer
          v-if="isEditCustomer"
          @closeModal="isEditCustomer = false"
          :title="'Edit Customer'"
          :btnText="'Edit Customer'"
        />
        <EditCustomer
          v-if="isAddCustomer"
          @closeModal="isAddCustomer = false"
          :title="'Add Customer'"
          :btnText="'Add New Customer'"
        />

        <v-dialog max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.name"
                      label="Dessert name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.calories"
                      label="Calories"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.fat"
                      label="Fat (g)"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.carbs"
                      label="Carbs (g)"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.protein"
                      label="Protein (g)"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
              <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
          @btnClick="editItem(item)"
          class="mr-4"
          :color="'white'"
          :classString="'success--text'"
          :icon="'mdi-check'"
        />
        <IconButton
          v-if="item.isShowDelete && item.isShowIcon"
          @btnClick="editItem(item)"
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
    filterInputeText: ["name", "email", "phone", "address"],
    filterValue: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    isFilterOpen: false,
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
    editedIndex: -1,
    editedItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
    defaultItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    formatedData() {
      return this.desserts.map((item) => {
        return {
          address: item.address,
          avatar: item.avatar,
          created_at_date: this.$getGeneralDate(item.created_at),
          created_at_time: this.$toLocaleTimeString(item.created_at),
          email: item.email,
          name: `${item.first_name} ${item.last_name}`,
          is_marketing: item.is_marketing,
          last_name: item.last_name,
          phone_number: item.phone_number,
          isShowIcon: false,
          isShowDelete: false,
        };
      });
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  methods: {
    initialize() {
      this.desserts = [
        {
          address: "509 Leonor Common, West Karinaberg, AL",
          avatar: null,
          created_at: "2022-02-23T05:30:52.000000Z",
          email: "joenas@gmail.com",
          email_verified_at: null,
          first_name: "Joe",
          is_marketing: 0,
          last_login_at: "2022-02-23 11:11:24",
          last_name: "Nas",
          phone_number: "(218) 388-7126",
          updated_at: "2022-02-23T11:11:24.000000Z",
          uuid: "80df51a7-b8d1-460d-9edf-95516248c0f7",
        },
        {
          address: "509 Leonor Common, West Karinaberg, AL",
          avatar: null,
          created_at: "2022-02-23T05:30:52.000000Z",
          email: "joenas@gmail.com",
          email_verified_at: null,
          first_name: "Joe",
          is_marketing: 1,
          last_login_at: "2022-02-23 11:11:24",
          last_name: "Nas",
          phone_number: "(218) 388-7126",
          updated_at: "2022-02-23T11:11:24.000000Z",
          uuid: "80df51a7-b8d1-460d-9edf-95516248c0f7",
        },
      ];
    },
    handleIconClick(item) {
      item.isShowIcon = !item.isShowIcon;
      item.isShowDelete = false;
    },
    getColor(value) {
      if (value) return "primary";
      else return "orange";
    },
    getMktText(value) {
      if (value) return "Yes";
      else return "No";
    },
    editItem(item) {
      console.log("edit" + item);
      // this.editedIndex = this.desserts.indexOf(item);
      // this.editedItem = Object.assign({}, item);
      this.isEditCustomer = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    },
  },
  async created() {
    // const res = await this.$store.dispatch("getAllUsersAPI");
    // console.log(res);
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

// ::v-deep .v-btn {
//   position: inherit;
// }

// ::v-deep .v-chip {
//   position: inherit;
// }

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
