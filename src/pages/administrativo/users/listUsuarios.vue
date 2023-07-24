<script setup>
import { defineComponent, ref, computed, reactive } from "vue";
import BaseCardStat from "src/components/base/BaseCardStat.vue";
import { useRoute } from "vue-router";
import * as pro from "src/plugins/helper";
import { getActiveItems, getAllItems, getItemsByParam } from "src/services";

defineComponent({
    BaseCardStat,
});

const route = useRoute();

const totalPrimary = ref(0);
const totalSecondary = ref(0);
const totalThird = ref(0);

const headerTable = ref([
    { name: "name", label: "Colaborador", field: "name", align: "left", sortable: false, headerClasses: "text-uppercase" },
    { name: "username", label: "Usuario", field: "username", align: "center", sortable: false, headerClasses: "text-uppercase" },
    { name: "roles", label: "Roles", field: "roles", align: "center", sortable: false, headerClasses: "text-uppercase" },
    { name: "estado", label: "Estado", field: "estado", align: "center", sortable: false, headerClasses: "text-uppercase" },
    { name: "online", label: "Online", field: "online", align: "center", sortable: false, headerClasses: "text-uppercase" },
    { name: "sucursalE", label: "Sucursal", field: "sucursalE", align: "center", sortable: false, headerClasses: "text-uppercase" },
    { name: "updatedAt", label: "Actividad", field: "updatedAt", align: "center", sortable: false, headerClasses: "text-uppercase" },
    { name: "actions", label: "Acciones", field: "actions", align: "center", sortable: false, headerClasses: "text-uppercase" },
]);
const contentTable2 = reactive([]);
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
const pagesMaxNumber = computed(() => Math.ceil(contentTable2.length / pagination.value.rowsPerPage));

// Start Dialog
const dialogUsers = ref(false);
// End Dialog

const getData = async () => {
    loadingTable.value = true;

    try {
        const query = await getAllItems("users");
        // console.log(query);
        if (pro.askHTTPResponse__200(query.status)) {
            totalPrimary.value = query.data.total;
            await query.data.all.forEach((element) => {
                let obj = {};

                obj.codigo = element._id;
                obj.name = element.name;
                // obj.avatar = pro.checkNullOrUndefined(element.avatar) ? "" : element.avatar;
                obj.username = element.username;
                // obj.email = element.email;
                // obj.phone = element.phone;
                obj.sucursalE = pro.checkNullOrUndefined(element.sucursalE) ? "" : element.sucursalE.name;
                obj.roles = element.roles.map((a) => a.name);
                // obj.sedeAcargo = pro.checkNullOrUndefined(element.sedeAcargo) ? "" : element.sedeAcargo.map((a) => a.name);
                obj.estado = element.estado;
                obj.online = element.online;
                obj.updatedAt = pro.formatDate(element.updatedAt, "full", true);

                contentTable2.push(obj);
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

const getDataActive = async () => {
    try {
        const query = await getActiveItems("users");
        if (pro.askHTTPResponse__200(query.status)) {
            totalSecondary.value = query.data.total;
        }
    } catch (err) {
        pro.handleError(err.response);
    }
};

const getDataOnline = async () => {
    try {
        const query = await getItemsByParam("users/count/by-online", { online: true });
        if (pro.askHTTPResponse__200(query.status)) {
            totalThird.value = query.data.total;
        }
    } catch (err) {
        pro.handleError(err.response);
    }
};

const colorTextStatus = (item) => {
    return pro.colorTextStatus(item);
};

const exportarTabla = () => {
    pro.exportToExcel(contentTable2, `Reporte_Usuarios_${pro.formatDate(new Date(), "full", false)}`, "Usuarios");
};

const inicializar = async () => {
    if (contentTable2.length > 0) {
        pro.cleanTable(contentTable2);
        getData();
        getDataActive();
        getDataOnline();
    } else {
        getData();
        getDataActive();
        getDataOnline();
    }
};

inicializar();
</script>

<template>
    <div>
        <q-page padding>
            <div class="q-pa-md">
                <q-card class="bg-transparent no-shadow no-border">
                    <q-card-section class="q-pa-none">
                        <div class="row q-col-gutter-sm">
                            <div class="col-md-3 col-sm-12 col-xs-12"></div>
                            <div class="col-md-3 col-sm-12 col-xs-12">
                                <base-card-stat icon="label" title="Total" :value="totalPrimary" color1="#5064b5" color2="#3e51b5" />
                            </div>
                            <div class="col-md-3 col-sm-12 col-xs-12">
                                <base-card-stat icon="person" title="Activos" :value="totalSecondary" color1="#f37169" color2="#f34636" />
                            </div>
                            <div class="col-md-3 col-sm-12 col-xs-12">
                                <base-card-stat icon="link" title="Online" :value="totalThird" color1="#a270b1" color2="#9f52b1" />
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
                            :rows="contentTable2"
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

                            <template v-slot:body-cell-roles="item">
                                <q-td>
                                    <div v-for="(a, index) in item.row.roles" :key="index" class="text-center">
                                        <q-chip color="primary" size="sm" text-color="white">
                                            {{ a }}
                                        </q-chip>
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

                            <template v-slot:body-cell-online="item">
                                <q-td>
                                    <div class="text-center">
                                        <q-icon :color="item.row.online ? 'secondary' : 'primary'" name="circle"></q-icon>
                                    </div>
                                </q-td>
                            </template>

                            <template v-slot:body-cell-actions="item">
                                <div class="text-center">
                                    <q-btn flat round color="edicion">
                                        <q-icon name="visibility"></q-icon>
                                        <q-tooltip>Ver usuario</q-tooltip>
                                    </q-btn>
                                    <q-btn flat round color="primary">
                                        <q-icon name="delete"></q-icon>
                                        <q-tooltip>Eliminar usuario</q-tooltip>
                                    </q-btn>
                                    <q-btn flat round color="purple">
                                        <q-icon name="logout"></q-icon>
                                        <q-tooltip>Forzar cierre</q-tooltip>
                                    </q-btn>
                                    <q-btn flat round color="cyan">
                                        <q-icon name="lock_reset"></q-icon>
                                        <q-tooltip>Resetear password</q-tooltip>
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

                        <q-dialog v-model="dialogUsers" persistent transition-show="slide-down" transition-hide="slide-down"> </q-dialog>
                    </div>
                </div>
            </div>
        </q-page>
    </div>
</template>
