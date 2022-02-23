<template>
  <div>
    <AdminTitle :items="breadcrumbItems" />
    <v-divider class="my-6"></v-divider>
    <v-data-table
      :headers="headers"
      :items="desserts"
      sort-by="calories"
      class="table"
    >
      <template v-slot:top>
        <!-- Top Left -->
        <v-toolbar flat>
          <div>All Customers</div>
          <v-spacer></v-spacer>

          <v-btn color="primary" dark class="mr-3" v-bind="attrs" v-on="on">
            <v-icon class="x-button" size="14px"> mdi-plus </v-icon>
            Add New Customers
          </v-btn>
          <v-divider class="mx-4" inset vertical></v-divider>
          <a href="#" class="filter-icon mx-7"
            >Filter <v-icon class="ml-5"> mdi-chevron-down </v-icon></a
          >
        </v-toolbar>
        <v-dialog v-model="dialog" max-width="500px">
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
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <!-- Customized Columns -->
      <!-- Name -->
      <template v-slot:item.first_name="{ item }">
        <v-avatar size="44" color="white" class="my-5 mr-6">
          <img :src="item.avatar" alt="John" />
        </v-avatar>
        {{ item.name }}
      </template>

      <!-- Marketing Preference -->
      <template v-slot:item.is_marketing="{ item }">
        <v-chip :color="getColor(item.is_marketing)" dark>
          {{ getMktText(item.is_marketing) }}
        </v-chip>
      </template>

      <!-- Setting -->
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-dots-vertical
        </v-icon>
        <!-- <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon> -->
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
export default {
  components: { AdminTitle },
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
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "first_name",
      },
      { text: "Email", value: "email", sortable: false },
      { text: "Phone", value: "phone_number", sortable: false },
      { text: "Address", value: "address", sortable: false },
      { text: "Date Created", value: "created_at", sortable: false },
      {
        text: "Marketing Preferences",
        value: "is_marketing",
        sortable: false,
      },
      { text: "", value: "actions", sortable: false },
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
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
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
    getColor(value) {
      if (value) return "primary";
      else return "orange";
    },
    getMktText(value) {
      if (value) return "Yes";
      else return "No";
    },
    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
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
.table {
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.87);

  .filter-icon {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.54);
  }
}
</style>
