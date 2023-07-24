<script setup>
import { reactive, ref, computed, defineComponent } from "vue";
import { useRoute } from "vue-router";
import * as pro from "src/plugins/helper";
import { getActiveItems, getAllItems } from "src/services";
import BaseCardStat from "src/components/base/BaseCardStat.vue";

defineComponent({
    BaseCardStat,
});

const route = useRoute();

const totalPrimary = ref(0);
const totalSecondary = ref(0);

const headerTable = ref([
    { label: "Asesor", field: "name", name: "name", align: "left", sortable: false, headerClasses: "text-uppercase" },
    { label: "DNI", field: "document", name: "document", align: "center", sortable: false, headerClasses: "text-uppercase" },
    { label: "Email", field: "email", name: "email", align: "center", sortable: false, headerClasses: "text-uppercase" },
    { label: "Sucursal", field: "sucursalE", name: "sucursalE", align: "center", sortable: false, headerClasses: "text-uppercase" },
    { label: "Marca", field: "marcaE", name: "marcaE", align: "center", sortable: false, headerClasses: "text-uppercase" },
    { label: "Estado", field: "estado", name: "estado", align: "center", sortable: false, headerClasses: "text-uppercase" },
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
        const query = await getAllItems("seller");
        if (pro.askHTTPResponse__200(query.status)) {
            totalPrimary.value = query.data.total;
            await query.data.all.forEach((element) => {
                let obj = {};

                obj.codigo = element._id;
                obj.name = element.name;
                obj.document = element.document;
                obj.email = element.email;
                obj.telefono = element.telefono;
                obj.sucursalE = pro.checkNullOrUndefined(element.sucursalE) ? "" : element.sucursalE.name;
                obj.marcaE = pro.checkNullOrUndefined(element.marcaE) ? "" : element.marcaE.name;
                obj.marcaEAvatar = pro.checkNullOrUndefined(element.marcaE) ? "" : element.marcaE.avatar;
                obj.estado = element.estado;
                obj.avatar = element.avatar;

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

const colorTextStatus = (item) => {
    return pro.colorTextStatus(item);
};

const getDataActive = async () => {
    try {
        const query = await getActiveItems("seller");
        if (pro.askHTTPResponse__200(query.status)) {
            totalSecondary.value = query.data.total;
        }
    } catch (err) {
        console.log(err);
        console.log(err.response);
        // pro.handleError(err.response);
    }
};

const exportarTabla = () => {
    pro.exportToExcel(contentTable3, `Reporte_Permisos_${pro.formatDate(new Date(), "full", false)}`, "Permisos");
};

const inicializar = async () => {
    if (contentTable3.length > 0) {
        pro.cleanTable(contentTable3);
        getData();
        getDataActive();
    } else {
        getData();
        getDataActive();
    }
};

inicializar();
</script>

<template>
    <q-page>
        <div class="q-pa-md">
            <q-card class="bg-transparent no-shadow no-border">
                <q-card-section class="q-pa-none">
                    <div class="row q-col-gutter-sm">
                        <div class="col-md-3 col-sm-12 col-xs-12"></div>
                        <div class="col-md-3 col-sm-12 col-xs-12"></div>
                        <div class="col-md-3 col-sm-12 col-xs-12">
                            <base-card-stat icon="label" title="Total" :value="totalPrimary" color1="#5064b5" color2="#3e51b5" />
                        </div>
                        <div class="col-md-3 col-sm-12 col-xs-12">
                            <base-card-stat icon="person" title="Activos" :value="totalSecondary" color1="#f37169" color2="#f34636" />
                        </div>
                    </div>
                </q-card-section>
            </q-card>
            <div class="row q-mt-lg">
                <div class="col">
                    <q-table
                        bordered
                        :title="route.name"
                        title-class="text-h4 text-primary text-uppercase"
                        :columns="headerTable"
                        :rows="contentTable3"
                        :filter="searchTable"
                        :no-data-label="noDataTable"
                        :no-results-label="noFilterTable"
                        :loading="loadingTable"
                        :grid="$q.screen.xs"
                        row-key="codigo"
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

                        <template v-slot:body-cell-name="item">
                            <q-td>
                                <div class="text-left text-weight-bolder">
                                    {{ item.row.name }}
                                    <q-tooltip class="bg-transparent" anchor="center right" self="center start" transition-show="slide-down" transition-hide="slide-down">
                                        <q-avatar size="15rem">
                                            <q-img loading :src="item.row.avatar"></q-img>
                                        </q-avatar>
                                    </q-tooltip>
                                </div>
                            </q-td>
                        </template>

                        <template v-slot:body-cell-estado="item">
                            <q-td>
                                <div class="text-center">
                                    <q-chip size="sm" :color="item.row.estado ? 'secondary' : 'primary'" text-color="white">
                                        {{ colorTextStatus(item.row.estado).text }}
                                    </q-chip>
                                </div>
                            </q-td>
                        </template>

                        <template v-slot:body-cell-actions="item">
                            <div class="text-center">
                                <q-btn flat round color="edicion">
                                    <q-icon name="visibility"></q-icon>
                                    <q-tooltip>Ver vendedor</q-tooltip>
                                </q-btn>
                                <q-btn flat round color="primary">
                                    <q-icon name="delete"></q-icon>
                                    <q-tooltip>Eliminar vendedor</q-tooltip>
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
