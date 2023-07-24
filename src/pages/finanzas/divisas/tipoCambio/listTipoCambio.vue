<script setup>
import { defineComponent, reactive, ref, computed, nextTick } from "vue";
import BaseCardStat from "src/components/base/BaseCardStat.vue";
import { useRoute } from "vue-router";
import * as pro from "src/plugins/helper";
import * as notif from "src/plugins/notification";
import { createItem, getAllItems } from "src/services";
import { useAuthStore } from "src/stores/auth.store";
import { storeToRefs } from "pinia";

defineComponent({
    BaseCardStat,
});

const useAuth = useAuthStore();
const { online } = storeToRefs(useAuth);

const route = useRoute();

const headerTable = ref([
    { label: "Fecha", field: "fecha_registro", name: "fecha_registro", align: "center", sortable: false, headerClasses: "text-uppercase" },
    { label: "Operaciones", field: "operation", name: "operation", align: "center", sortable: false, headerClasses: "text-uppercase" },
    { label: "TC", field: "tc", name: "tc", align: "center", sortable: false, headerClasses: "text-uppercase" },
    { label: "Creada el", field: "createdAt", name: "createdAt", align: "center", sortable: false, headerClasses: "text-uppercase" },
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
    rowsPerPage: 100,
});
const pagesMaxNumber = computed(() => Math.ceil(contentTable2.length / pagination.value.rowsPerPage));

// init Dialog
const dialogTC = ref(false);
const loading = ref([]);
const editedItemBBVA = ref({
    venta_vehiculos: 4.565,
    venta_repuestos: 3.365,
});
const editedItemBCP = ref({
    venta_vehiculos: 4.045,
    venta_repuestos: 3.89,
});

const fechaTC = computed(() => pro.formatDate(new Date(), "full", true));

const licitacionesBBVA = computed(() => {
    const subtotal = Number(editedItemBBVA.value.venta_vehiculos) + 0.05;
    return pro.round10(subtotal, -3);
});
const licitacionesBCP = computed(() => {
    const subtotal = Number(editedItemBCP.value.venta_vehiculos) + 0.05;
    return pro.round10(subtotal, -3);
});

const venta_vehiculosPROM = computed(() => {
    let suma = Number(editedItemBBVA.value.venta_vehiculos) + Number(editedItemBCP.value.venta_vehiculos);
    return pro.round10(suma / 2, -3);
});
const venta_repuestosPROM = computed(() => {
    let suma = Number(editedItemBBVA.value.venta_repuestos) + Number(editedItemBCP.value.venta_repuestos);
    return pro.round10(suma / 2, -3);
});
const licitacionesPROM = computed(() => {
    let suma = Number(licitacionesBBVA.value) + Number(licitacionesBCP.value);
    return pro.round10(suma / 2, -3);
});

function load(i) {
    loading.value[i] = true;
    setTimeout(() => {
        saveItem();
        loading.value[i] = false;
    }, 4000);
}

function closeDialog() {
    nextTick(() => {
        editedItemBBVA.value = Object.assign({}, editedItemBBVA.value);
        editedItemBCP.value = Object.assign({}, editedItemBCP.value);
        dialogTC.value = false;
    });
}

const saveItem = async () => {
    let objBBVA = [
        {
            ventaVehiculos: editedItemBBVA.value.venta_vehiculos,
            ventaRepuestos: editedItemBBVA.value.venta_repuestos,
            licitaciones: licitacionesBBVA.value,
        },
    ];
    let objBCP = [
        {
            ventaVehiculos: editedItemBCP.value.venta_vehiculos,
            ventaRepuestos: editedItemBCP.value.venta_repuestos,
            licitaciones: licitacionesBCP.value,
        },
    ];
    let obj = {
        codigo_interno: new Date().getTime(),
        fecha_registro: fechaTC.value,
        itemsBBVA: objBBVA,
        itemsBCP: objBCP,
        ventaVehiculosPromedio: venta_vehiculosPROM.value,
        ventaRepuestosPromedio: venta_repuestosPROM.value,
        licitacionesPromedio: licitacionesPROM.value,
        createdBy: online.value?.username,
    };

    console.log("OBJ:", obj);

    try {
        const query = await createItem("tcambio", obj);
        if (pro.askHTTPResponse__200(query.status)) {
            notif.alertPositive(query.data.message);
            closeDialog();
            inicializar();
        }
    } catch (err) {
        pro.handleError(err.response);
    }
};
// end Dialog

// Functions
const getData = async () => {
    loadingTable.value = true;
    try {
        const query = await getAllItems("t-cambio");
        if (pro.askHTTPResponse__200(query.status)) {
            await query.data.all.forEach((element) => {
                let obj = {};

                obj.codigo = element._id;
                obj.fecha_registro = pro.formatDate(element.fecha_registro, "min", false);
                obj.licitacionesPromedio = pro.formatCurrency(element.licitacionesPromedio, 2);
                obj.ventaRepuestosPromedio = pro.formatCurrency(element.ventaRepuestosPromedio, 2);
                obj.ventaVehiculosPromedio = pro.formatCurrency(element.ventaVehiculosPromedio, 2);
                obj.createdAt = pro.formatDate(element.createdAt, "full", true);

                contentTable2.push(obj);
            });
            loadingTable.value = false;
        }
    } catch (err) {
        pro.handleError(err.response);
        loadingTable.value = false;
    }
};

const exportarTabla = () => {
    pro.exportToExcel(contentTable2, `Reporte_Roles_${pro.formatDate(new Date(), "full", false)}`, "Roles");
};

const inicializar = async () => {
    if (contentTable2.length > 0) {
        pro.cleanTable(contentTable2);
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
                            <q-btn fab-mini color="primary" class="q-ml-md" @click="dialogTC = !dialogTC">
                                <q-icon name="add"></q-icon>
                                <q-tooltip>Nuevo</q-tooltip>
                            </q-btn>
                        </template>

                        <template v-slot:body-cell-operation="item">
                            <q-td>
                                <div class="row">
                                    Venta de Vehículos: <br />
                                    Venta de Repuestos y Accesorios: <br />
                                    Licitaciones:
                                </div>
                            </q-td>
                        </template>

                        <template v-slot:body-cell-tc="item">
                            <q-td>
                                <div class="row text-weight-bolder">
                                    {{ item.row.ventaVehiculosPromedio }} <br />
                                    {{ item.row.ventaRepuestosPromedio }} <br />
                                    {{ item.row.licitacionesPromedio }}
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

                    <q-dialog v-model="dialogTC" persistent transition-show="slide-down" transition-hide="slide-down">
                        <q-card style="width: 700px; max-width: 80vw">
                            <q-toolbar class="bg-primary text-white">
                                <q-toolbar-title :class="$q.screen.xs ? 'text-uppercase text-h7' : 'text-uppercase text-h4'">
                                    <q-icon name="currency_exchange" left />
                                    Nuevo Tipo de Cambio
                                </q-toolbar-title>
                                <q-btn flat round dense icon="close" v-close-popup />
                            </q-toolbar>

                            <q-card-section>
                                <div class="row">
                                    <q-space />
                                    <div class="col-lg-5 col-md-5 col-sm-12">
                                        <q-input v-model="fechaTC" label="Fecha" input-class="text-center text-weight-bold" disable outlined dense>
                                            <template v-slot:prepend>
                                                <q-icon name="event" color="primary"></q-icon>
                                            </template>
                                        </q-input>
                                    </div>
                                </div>
                            </q-card-section>

                            <q-form @submit.preveent="load(3)">
                                <div>
                                    <q-card-section style="max-height: 50vh">
                                        <div class="row">
                                            <div class="col-sm-12 col-md-4 col-lg-4">
                                                <div class="text-subtitle text-primary text-weight-bold">BBVA</div>
                                                <q-input
                                                    v-model="editedItemBBVA.venta_vehiculos"
                                                    label="Venta de vehículos"
                                                    outlined
                                                    dense
                                                    input-class="text-center text-weight-bolder"
                                                    class="q-mb-md"
                                                    :disable="loading[3]"
                                                >
                                                    <template v-slot:prepend>
                                                        <q-icon name="mdi-car-side" color="primary"></q-icon>
                                                    </template>
                                                </q-input>
                                                <q-input
                                                    v-model="editedItemBBVA.venta_repuestos"
                                                    label="Venta de repuestos y accesorios"
                                                    outlined
                                                    dense
                                                    input-class="text-center text-weight-bolder"
                                                    class="q-mb-md"
                                                    :disable="loading[3]"
                                                >
                                                    <template v-slot:prepend>
                                                        <q-icon name="construction" color="primary"></q-icon>
                                                    </template>
                                                </q-input>
                                                <q-input
                                                    v-model="licitacionesBBVA"
                                                    label="Licitaciones"
                                                    outlined
                                                    dense
                                                    input-class="text-center text-weight-bolder"
                                                    class="q-mb-md"
                                                    disable
                                                >
                                                    <template v-slot:prepend>
                                                        <q-icon name="domain" color="primary"></q-icon>
                                                    </template>
                                                </q-input>
                                            </div>
                                            <div class="col-sm-12 col-md-4 col-lg-4 q-px-sm">
                                                <div class="text-subtitle text-primary text-weight-bold">BCP</div>
                                                <q-input
                                                    v-model="editedItemBCP.venta_vehiculos"
                                                    label="Venta de vehículos"
                                                    outlined
                                                    dense
                                                    input-class="text-center text-weight-bolder"
                                                    class="q-mb-md"
                                                    :disable="loading[3]"
                                                >
                                                    <template v-slot:prepend>
                                                        <q-icon name="mdi-car-side" color="primary"></q-icon>
                                                    </template>
                                                </q-input>
                                                <q-input
                                                    v-model="editedItemBCP.venta_repuestos"
                                                    label="Venta de repuestos y accesorios"
                                                    outlined
                                                    dense
                                                    input-class="text-center text-weight-bolder"
                                                    class="q-mb-md"
                                                    :disable="loading[3]"
                                                >
                                                    <template v-slot:prepend>
                                                        <q-icon name="construction" color="primary"></q-icon>
                                                    </template>
                                                </q-input>
                                                <q-input
                                                    v-model="licitacionesBCP"
                                                    label="Licitaciones"
                                                    outlined
                                                    dense
                                                    input-class="text-center text-weight-bolder"
                                                    class="q-mb-md"
                                                    disable
                                                >
                                                    <template v-slot:prepend>
                                                        <q-icon name="domain" color="primary"></q-icon>
                                                    </template>
                                                </q-input>
                                            </div>
                                            <div class="col-sm-12 col-md-4 col-lg-4">
                                                <div class="text-subtitle text-primary text-weight-bold">Promedio</div>
                                                <q-input
                                                    v-model="venta_vehiculosPROM"
                                                    label="Venta de vehículos"
                                                    outlined
                                                    dense
                                                    input-class="text-center text-weight-bolder"
                                                    class="q-mb-md"
                                                    disable
                                                >
                                                    <template v-slot:prepend>
                                                        <q-icon name="mdi-car-side" color="primary"></q-icon>
                                                    </template>
                                                </q-input>
                                                <q-input
                                                    v-model="venta_repuestosPROM"
                                                    label="Venta de repuestos y accesorios"
                                                    outlined
                                                    dense
                                                    input-class="text-center text-weight-bolder"
                                                    class="q-mb-md"
                                                    disable
                                                >
                                                    <template v-slot:prepend>
                                                        <q-icon name="construction" color="primary"></q-icon>
                                                    </template>
                                                </q-input>
                                                <q-input
                                                    v-model="licitacionesPROM"
                                                    label="Licitaciones"
                                                    outlined
                                                    dense
                                                    input-class="text-center text-weight-bolder"
                                                    class="q-mb-md"
                                                    disable
                                                >
                                                    <template v-slot:prepend>
                                                        <q-icon name="domain" color="primary"></q-icon>
                                                    </template>
                                                </q-input>
                                            </div>
                                        </div>
                                    </q-card-section>
                                    <q-separator />
                                    <q-card-actions>
                                        <q-space />
                                        <q-btn flat color="primary" @click="closeDialog()">
                                            <q-icon left name="close"></q-icon>
                                            Cancelar
                                        </q-btn>
                                        <q-btn color="secondary" type="submit" :disable="loading[3]" :loading="loading[3]">
                                            Guardar
                                            <q-icon right name="save"></q-icon>
                                        </q-btn>
                                    </q-card-actions>
                                </div>
                            </q-form>
                        </q-card>
                    </q-dialog>
                </div>
            </div>
        </div>
    </q-page>
</template>
