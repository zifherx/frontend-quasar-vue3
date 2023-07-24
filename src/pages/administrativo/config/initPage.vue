<script setup>
import { getAllItems } from "src/services";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { createItem } from "../../../services";
import * as pro from "src/plugins/helper";
import * as notif from "src/plugins/notification";
import { nextTick } from "process";

const route = useRoute();

const headerTable = ref([
    { label: "Submódulo", name: "submodule", field: (row) => row.submodule, align: "center", sortable: true, headerClasses: "text-uppercase" },
    { label: "Descripción", name: "description", field: "description", align: "left", sortable: false, headerClasses: "text-uppercase" },
    { label: "Ruta", name: "route", field: "route", align: "left", sortable: false, headerClasses: "text-uppercase" },
]);
const contentTable = ref([]);
const searchTable = ref("");
const noDataTable = ref("No existen registros");
const noFilterTable = ref("La búsqueda no encontró resultados");
const loadingTable = ref(false);
const pagination = ref({
    sortBy: "desc",
    descending: false,
    page: 1,
    rowsPerPage: 30,
});

const pagesMaxNumber = computed(() => Math.ceil(contentTable.value.length / pagination.value.rowsPerPage));

// Start Dialog
const editedIndex = ref(-1);
const editedItem = ref({
    submodule: "",
    description: "",
    icon: "",
    route: "/",
    status: true,
});
const defaultItem = ref({
    submodule: "",
    description: "",
    icon: "",
    route: "/",
    status: false,
});
const dialogSettings = ref(false);
const titleItem = ref("Submódulo");
const titleCard = computed(() => (editedIndex.value === -1 ? `Nuevo ${titleItem.value}` : `Actualizar ${titleItem.value}`));
const loading = ref([]);

const saveItem = async () => {
    if (editedIndex > -1) {
        console.log("Modificar Item");
    } else {
        let newObj = {
            submodule: editedItem.value.submodule,
            description: editedItem.value.description,
            icon: editedItem.value.icon,
            route: editedItem.value.route,
            status: editedItem.value.status,
        };

        if (pro.checkNullOrUndefined(newObj.submodule)) {
            alert("Falta campos importantes");
        } else {
            try {
                const query = await createItem("submodule", newObj);
                // console.log(query);
                if (pro.askHTTPResponse__200(query.status)) {
                    // console.log("Exitoso");
                    notif.notifySuccesfull(query.data.message);
                    closeDialog();
                    inicializar();
                }
            } catch (err) {
                pro.handleError(err.response);
            }
        }
    }
};

function closeDialog() {
    nextTick(()=>{
        editedItem.value = Object.assign({}, defaultItem);
        dialogSettings.value = false;
    })
}

function load(i) {
    loading.value[i] = true;
    setTimeout(() => {
        saveItem();
        loading.value[i] = false;
    }, 5000);
}
// End Dialog

const getData = async () => {
    loadingTable.value = true;

    try {
        const query = await getAllItems("submodule");
        // console.log(query);
        if (pro.askHTTPResponse__200(query.status)) {
            await query.data.all.forEach((element) => {
                let obj = {};

                obj.codigo = element._id;
                obj.submodule = element.submodule;
                obj.description = element.description;
                obj.icon = element.icon;
                obj.route = element.route;
                obj.status = element.status;

                contentTable.value.push(obj);
            });
            loadingTable.value = false;
        }
    } catch (err) {
        pro.handleError(err.response);
        loadingTable.value = false;
        // console.log(err);
        // console.log(err.response);
    }
};

const inicializar = () => {
    if (contentTable.value.length > 0) {
        pro.cleanTable(contentTable.value);
        getData();
    } else {
        getData();
    }
};

getData();
</script>
<template>
    <q-page padding>
        <div class="q-pa-md">
            <q-table
                bordered
                :title="route.name"
                title-class="text-h4 text-primary text-uppercase"
                :columns="headerTable"
                :rows="contentTable"
                :filter="searchTable"
                :no-data-label="noDataTable"
                :no-results-label="noFilterTable"
                :grid="$q.screen.xs"
                row-key="codigo"
                separator="vertical"
                :loading="loadingTable"
                hide-pagination
                virtual-scroll
                v-model:pagination="pagination"
            >
                <template v-slot:top-right>
                    <q-input outlined dense label="Buscar" debounce="300" v-model="searchTable" placeholder="Filtrar por...">
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                    <q-btn class="q-ml-sm" fab-mini color="primary" @click="inicializar()">
                        <q-icon name="refresh"></q-icon>
                        <q-tooltip transition-show="flip-right" transition-hide="flip-left" class="bg-primary text-body2" anchor="center left" self="center end" :offset="[10, 10]">
                            Actualizar
                        </q-tooltip>
                    </q-btn>
                    <q-btn class="q-ml-sm" fab-mini color="primary">
                        <q-icon name="add" @click="dialogSettings = true">
                            <q-tooltip
                                transition-show="flip-right"
                                transition-hide="flip-left"
                                class="bg-primary text-body2"
                                anchor="bottom middle"
                                self="top middle"
                                :offset="[10, 10]"
                            >
                                Nuevo módulo
                            </q-tooltip>
                        </q-icon>
                    </q-btn>
                </template>

                <template v-slot:body-cell-submodule="item">
                    <div class="q-mx-lg text-left text-uppercase">
                        <q-icon :name="item.row.icon" size="md" left color="primary"></q-icon>
                        <span>{{ item.row.submodule }}</span>
                    </div>
                </template>

                <template v-slot:body-cell-route="item">
                    <q-td>
                        <div class="text-center">
                            <q-btn fab-mini color="primary" :to="item.row.route">
                                <q-icon :name="item.row.icon"></q-icon>
                                <q-tooltip
                                    transition-show="flip-right"
                                    transition-hide="flip-left"
                                    class="bg-primary text-body2"
                                    anchor="center left"
                                    self="center end"
                                    :offset="[10, 10]"
                                >
                                    Ir a {{ item.row.submodule }}
                                </q-tooltip>
                            </q-btn>
                        </div>
                    </q-td>
                </template>

                <template v-slot:no-data="{ icon, message, filter }">
                    <div class="full-width row flex-center text-primary q-gutter-sm">
                        <q-icon size="2em" name="sentiment_dissatisfied" />
                        <span> Lo sentimos... {{ message }} </span>
                        <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
                    </div>
                </template>

                <template v-slot:loading>
                    <q-inner-loading showing color="primary"></q-inner-loading>
                </template>
            </q-table>
            <div class="q-pa-lg flex flex-center">
                <q-pagination v-model="pagination.page" color="primary" :max="pagesMaxNumber" direction-links />
            </div>

            <q-dialog v-model="dialogSettings" persistent transition-show="slide-down" transition-hide="slide-down">
                <q-card style="width: 500px; max-width: 80vw">
                    <q-toolbar class="bg-primary text-white">
                        <q-toolbar-title :class="$q.screen.xs ? 'text-uppercase text-h7' : 'text-uppercase text-h4'">
                            <q-icon name="view_module" left></q-icon>
                            {{ titleCard }}
                        </q-toolbar-title>
                        <q-btn flat round dense icon="close" v-close-popup />
                    </q-toolbar>

                    <q-form @submit.preveent="load(3)">
                        <div class="q-mx-md q-mb-md">
                            <q-card-section style="max-height: 50vh">
                                <div class="row">
                                    <div class="col-12">
                                        <q-input v-model="editedItem.submodule" label="Submódulo" autofocus :disable="loading[3]" outlined dense class="q-mb-md">
                                            <template v-slot:prepend>
                                                <q-icon name="label" color="primary"></q-icon>
                                            </template>
                                        </q-input>
                                    </div>
                                    <div class="col-12">
                                        <q-input v-model="editedItem.icon" label="Icono" :disable="loading[3]" outlined dense class="q-mb-md">
                                            <template v-slot:prepend>
                                                <q-icon name="mood" color="primary"></q-icon>
                                            </template>
                                        </q-input>
                                    </div>
                                    <div class="col-12">
                                        <q-input v-model="editedItem.description" label="Descripción" :disable="loading[3]" outlined dense class="q-mb-md">
                                            <template v-slot:prepend>
                                                <q-icon name="description" color="primary"></q-icon>
                                            </template>
                                        </q-input>
                                    </div>
                                    <div class="col-12 col-md-7">
                                        <q-input v-model="editedItem.route" label="Ruta" :disable="loading[3]" outlined dense input>
                                            <template v-slot:prepend>
                                                <q-icon name="language" color="primary"></q-icon>
                                            </template>
                                        </q-input>
                                    </div>
                                    <div class="col-12 col-md-5">
                                        <q-toggle
                                            v-model="editedItem.status"
                                            :color="editedItem.status ? 'secondary' : 'primary'"
                                            keep-color
                                            :disable="loading[3]"
                                            checked-icon="check"
                                            unchecked-icon="clear"
                                            :label="editedItem.status ? 'Activo' : 'Inactivo'"
                                        />
                                    </div>
                                </div>
                            </q-card-section>
                        </div>

                        <q-separator />

                        <q-card-actions>
                            <q-space></q-space>
                            <q-btn flat color="primary" v-close-popup>
                                <q-icon name="close" left></q-icon>
                                Cancelar
                            </q-btn>
                            <q-btn color="secondary" type="submit" :disable="loading[3]" :loading="loading[3]">
                                Guardar
                                <q-icon name="save" right></q-icon>

                                <template v-slot:loading>
                                    <q-spinner-hourglass class="on-left" />
                                </template>
                            </q-btn>
                        </q-card-actions>
                    </q-form>
                </q-card>
            </q-dialog>
        </div>
    </q-page>
</template>
