<script setup>
import { storeToRefs } from "pinia";
import { computed } from "@vue/reactivity";
import { useAuthStore } from "src/stores/auth.store";
import { useGeneralStore } from "src/stores/general.store";
import { ref } from "vue";

const useGeneral = useGeneralStore();
const { drawer } = storeToRefs(useGeneral);

const useAuth = useAuthStore();
const { online } = storeToRefs(useAuth);

const init = async () => {
    await useAuth.getUserConnected();
};

init();

const urlLogo = ref("/src/assets/logo-autonort-white.png");

// Computed
const userOnline = computed(() => {
    return {
        username: online.value?.username,
        role: online.value?.roles.map((a) => a.name),
        name: online.value?.name,
        email: online.value?.email,
        avatar: online.value?.avatar,
    };
});

const rutaPrefixDashboard = ref("/dashboard");
const adminDashboard = ref([
    { title: "Dashboard Ventas", icon: "memory", to: "/ventas" },
    { title: "Dashboard CRM", icon: "share", to: "/crm" },
]);

const rutaPrefixAdmin = ref("/administrative");
const adminItems = ref([
    { title: "Configuraciones", icon: "settings_applications", to: "/settings" },
    { title: "Permisos", icon: "vpn_lock", to: "/license" },
    { title: "Roles", icon: "fingerprint", to: "/roles" },
    { title: "Usuarios", icon: "groups", to: "/users" },
    { title: "Vehículos", icon: "directions_car", to: "/vehicles" },
    { title: "Vendedores", icon: "diversity_3", to: "/sellers" },
]);

const rutaPrefixComercial = ref("/commercial");
const comercialItems = ref([
    { title: "ADV", icon: "inventory", to: "/adv" },
    { title: "Canal Digital", icon: "share", to: "/canal-digital" },
    { title: "Cadena de Valor", icon: "support_agent", to: "/cadena-valor" },
    { title: "Conexos", icon: "emergency", to: "/conexos" },
    { title: "Cierres", icon: "monitor", to: "/cierre" },
    { title: "PDS", icon: "thumb_up", to: "/pds" },
    { title: "Ventas", icon: "payments", to: "/ventas" },
]);

const rutaPrefixDC = ref("/dc");
const dcItems = ref([{ title: "Actividades", icon: "local_activity", to: "/activities" }]);

const rutaPrefixFinanzas = ref("/finances");
const finanzasItems = ref([{ title: "Divisas", icon: "currency_exchange", to: "/divisas" }]);

const rutaPrefixServicios = ref("/services");
const serviciosItems = ref([{ title: "Tunning", icon: "local_mall", to: "/tunning" }]);

const rutaPrefixReportes = ref("/reports");
const reportesItems = ref([
    { title: "Comercial", icon: "query_stats", to: "/comercial" },
    // {title: 'Servicios', icon: 'mdi-car', to: '/servicios'},
    // {title: 'Gerencial', icon: 'mdi-shield-account', to: '/gerencial'},
]);
</script>

<template>
    <q-drawer show-if-above :model-value="drawer" :width="280" :breakpoint="500" class="bg-black" side="left" bordered>
        <q-scroll-area style="height: calc(100% - 150px); margin-top: 100px; border-right: 1px solid #ddd">
            <q-list padding class="text-white">
                <q-separator dark class="q-mb-md" />

                <q-item dense v-ripple>
                    <q-item-section avatar>
                        <q-avatar size="5em">
                            <q-img :src="userOnline.avatar" fit="contain" />
                        </q-avatar>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label class="text-white text-weight-bold text-h6">
                            {{ userOnline.name }}
                        </q-item-label>
                        <q-item-label caption lines="2" class="text-white">
                            <div v-for="(item, index) in userOnline.role" :key="index">
                                <q-chip size="sm" color="primary" text-color="white">
                                    {{ item }}
                                </q-chip>
                            </div>
                        </q-item-label>
                        <q-item-label caption class="text-white">
                            {{ userOnline.email }}
                        </q-item-label>
                    </q-item-section>
                </q-item>

                <q-separator dark class="q-mt-md" />

                <q-expansion-item expand-separator icon="dashboard" label="Dashboard">
                    <q-item v-for="(item, index) in adminDashboard" :key="index" :to="rutaPrefixDashboard + item.to" :inset-level="0.5" clickable v-ripple active-class="primary">
                        <q-item-section avatar>
                            <q-icon color="white" :name="item.icon" />
                        </q-item-section>

                        <q-item-section>{{ item.title }}</q-item-section>
                    </q-item>
                </q-expansion-item>

                <q-expansion-item expand-separator icon="settings_suggest" label="Administración">
                    <q-item v-for="(item, index) in adminItems" :key="index" :to="rutaPrefixAdmin + item.to" :inset-level="0.5" clickable v-ripple active-class="primary">
                        <q-item-section avatar>
                            <q-icon color="white" :name="item.icon" />
                        </q-item-section>

                        <q-item-section>{{ item.title }}</q-item-section>
                    </q-item>
                </q-expansion-item>

                <q-expansion-item expand-separator icon="store" label="Comercial">
                    <q-item v-for="(item, index) in comercialItems" :key="index" :to="rutaPrefixComercial + item.to" :inset-level="0.5" clickable v-ripple active-class="primary">
                        <q-item-section avatar>
                            <q-icon color="white" :name="item.icon" />
                        </q-item-section>

                        <q-item-section>{{ item.title }}</q-item-section>
                    </q-item>
                </q-expansion-item>

                <q-expansion-item expand-separator icon="support_agent" label="DC" disable>
                    <q-item v-for="(item, index) in dcItems" :key="index" :to="rutaPrefixDC + item.to" :inset-level="0.5" clickable v-ripple active-class="primary">
                        <q-item-section avatar>
                            <q-icon color="white" :name="item.icon" />
                        </q-item-section>

                        <q-item-section>{{ item.title }}</q-item-section>
                    </q-item>
                </q-expansion-item>

                <q-expansion-item expand-separator icon="account_balance" label="Finanzas">
                    <q-item v-for="(item, index) in finanzasItems" :key="index" :to="rutaPrefixFinanzas + item.to" :inset-level="0.5" clickable v-ripple active-class="primary">
                        <q-item-section avatar>
                            <q-icon color="white" :name="item.icon" />
                        </q-item-section>

                        <q-item-section>{{ item.title }}</q-item-section>
                    </q-item>
                </q-expansion-item>

                <q-expansion-item expand-separator icon="build" label="Servicios" disable>
                    <q-item v-for="(item, index) in serviciosItems" :key="index" :to="rutaPrefixServicios + item.to" :inset-level="0.5" clickable v-ripple active-class="primary">
                        <q-item-section avatar>
                            <q-icon color="white" :name="item.icon" />
                        </q-item-section>

                        <q-item-section>{{ item.title }}</q-item-section>
                    </q-item>
                </q-expansion-item>

                <q-expansion-item expand-separator icon="donut_small" label="Reportes" disable>
                    <q-item v-for="(item, index) in reportesItems" :key="index" :to="rutaPrefixReportes + item.to" :inset-level="0.5" clickable v-ripple active-class="primary">
                        <q-item-section avatar>
                            <q-icon color="white" :name="item.icon" />
                        </q-item-section>

                        <q-item-section>{{ item.title }}</q-item-section>
                    </q-item>
                </q-expansion-item>
            </q-list>
        </q-scroll-area>

        <q-img class="fixed-top q-mx-auto q-mt-lg" :src="urlLogo" :placeholder-src="urlLogo" loading="lazy" spinner-color="white" style="max-width: 200px" fit="contain" />
    </q-drawer>
</template>
