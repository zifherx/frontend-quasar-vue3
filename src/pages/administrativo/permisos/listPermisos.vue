<script setup>
import { reactive, ref, computed } from "vue";
import { useRoute } from "vue-router";
import * as pro from "src/plugins/helper";
import { getAllItems } from "src/services";

const route = useRoute();

const headerTable = ref([
    { label: "COD", field: "cod_interno", name: "cod_interno", align: "center", sortable: false, headerClasses: "text-uppercase" },
    { label: "Menú", field: "menuG", name: "menuG", align: "left", sortable: false, headerClasses: "text-uppercase" },
    { label: "Módulo", field: "moduloG", name: "moduloG", align: "center", sortable: false, headerClasses: "text-uppercase" },
    { label: "Submódulo", field: "submoduloG", name: "submoduloG", align: "center", sortable: false, headerClasses: "text-uppercase" },
    { label: "Roles", field: "rolesPermitidos", name: "rolesPermitidos", align: "center", sortable: false, headerClasses: "text-uppercase" },
    { label: "Acciones", field: "actions", name: "actions", align: "center", sortable: false, headerClasses: "text-uppercase" },
]);
const contentTable3 = reactive([]);
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
const pagesMaxNumber = computed(() => Math.ceil(contentTable3.length / pagination.value.rowsPerPage));

// Functions
const getData = async () => {
    loadingTable.value = true;
    try {
        const query = await getAllItems("permisos");
        if (pro.askHTTPResponse__200(query.status)) {
            await query.data.all.forEach((element) => {
                let obj = {};

                obj.codigo = element._id;
                obj.cod_interno = element.cod_interno;
                obj.menuG = element.submoduloG.moduloG.menuG.name;
                obj.menuGIcon = pro.checkNullOrUndefined(element.submoduloG.moduloG.menuG) ? "" : element.submoduloG.moduloG.menuG.icon;
                obj.moduloG = pro.checkNullOrUndefined(element.submoduloG.moduloG) ? "" : element.submoduloG.moduloG.name;
                obj.moduloGIcon = pro.checkNullOrUndefined(element.submoduloG.moduloG) ? "" : element.submoduloG.moduloG.icon;
                obj.submoduloG = pro.checkNullOrUndefined(element.submoduloG) ? "" : element.submoduloG.name;
                obj.rolesPermitidos = pro.checkNullOrUndefined(element.rolesPermitidos) ? "" : element.rolesPermitidos.map((a) => a.name);
                obj.estado = element.estado;

                contentTable3.push(obj);
            });
            loadingTable.value = false;
        }
    } catch (err) {
        // console.log(err);
        // console.log(err.response);
        pro.handleError(err.response);
        loadingTable.value = false;
    }
};

const exportarTabla = () => {
    pro.exportToExcel(contentTable3, `Reporte_Permisos_${pro.formatDate(new Date(), "full", false)}`, "Permisos");
};

const inicializar = async () => {
    if (contentTable3.length > 0) {
        pro.cleanTable(contentTable3);
        getData();
    } else {
        getData();
    }
};

inicializar();
</script>

<template>
    <q-page>
        <div class="q-pa-md">
            <div class="row q-mt-lg">
                <div class="col">
                    <q-table
                        bordered
                        :title="route.name"
                        title-class="text-h4 text-primary text-uppercase"
                        :columns="headerTable"
                        :rows="contentTable3"
                        :filter="searchTable"
                        :grid="$q.screen.xs"
                        :no-data-label="noDataTable"
                        :no-results-label="noFilterTable"
                        :loading="loadingTable"
                        row-key="codigo"
                        separator="cell"
                        hide-pagination
                        v-model:pagination="pagination"
                    >
                        <template v-slot:top-right>
                            <q-input outlined dense label="Buscar" debounce="300" v-model="searchTable" placeholder="Filtrar por...">
                                <template v-slot:append>
                                    <q-icon name="search" />
                                </template>
                            </q-input>
                            <q-btn fab-mini color="primary" class="q-ml-md" @click="inicializar()">
                                <q-icon name="refresh"></q-icon>
                                <q-tooltip>Refrescar</q-tooltip>
                            </q-btn>
                            <q-btn fab-mini color="primary" class="q-ml-md" no-caps @click="exportarTabla()">
                                <q-icon name="mdi-microsoft-excel"></q-icon>
                                <q-tooltip>Exportar</q-tooltip>
                            </q-btn>
                            <q-btn fab-mini color="primary" class="q-ml-md">
                                <q-icon name="person_add"></q-icon>
                                <q-tooltip>Nuevo</q-tooltip>
                            </q-btn>
                        </template>

                        <template v-slot:body-cell-rolesPermitidos="item">
                            <q-td>
                                <div v-for="(a, index) in item.row.rolesPermitidos" :key="index" class="text-center">
                                    <q-chip color="primary" size="sm" text-color="white">
                                        {{ a }}
                                    </q-chip>
                                </div>
                            </q-td>
                        </template>

                        <template v-slot:body-cell-actions="item">
                            <div class="text-center">
                                <q-btn flat round color="edicion">
                                    <q-icon name="visibility"></q-icon>
                                    <q-tooltip>Ver permiso</q-tooltip>
                                </q-btn>
                                <q-btn flat round color="primary">
                                    <q-icon name="delete"></q-icon>
                                    <q-tooltip>Eliminar permiso</q-tooltip>
                                </q-btn>
                            </div>
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
                </div>
            </div>
        </div>
    </q-page>
</template>
