<script setup>
import { useRoute } from "vue-router";
import { useGeneralStore } from "stores/general.store";
import { storeToRefs } from "pinia";
import * as notif from "src/plugins/notification";
import { useAuthStore } from "src/stores/auth.store";

const route = useRoute();

const useGeneral = useGeneralStore();
const { drawer } = storeToRefs(useGeneral);

const authStore = useAuthStore();

const closeSession = () => {
    const question1 = notif.askQuestion("Estás seguro que deseas salir");
    question1.then((result) => {
        if (result.isConfirmed) {
            const alerta = notif.notifySuccesfull("¡Cerrando sesión!");
            alerta.then(async (result) => {
                if (result.isDismissed) await authStore.logoutStore();
            });
        }
    });
};
</script>
<template>
    <q-header>
        <q-toolbar class="bg-white">
            <q-btn dense flat round color="primary" @click="drawer = !drawer">
                <q-icon :name="drawer ? 'menu' : 'more_vert'"></q-icon>
            </q-btn>
            <q-toolbar-title class="text-weight-bold text-primary text-uppercase">{{ route.name }}</q-toolbar-title>
            <q-space></q-space>
            <q-btn class="q-mr-md" flat icon="dashboard" color="white" text-color="dark">
                <q-tooltip transition-show="flip-right" transition-hide="flip-left" class="bg-black text-body2" anchor="bottom start" self="top start" :offset="[10, 10]">
                    Dashboard Ventas
                </q-tooltip>
            </q-btn>
            <q-btn class="q-mr-md" flat icon="directions_bus" color="white" text-color="dark">
                <q-tooltip transition-show="flip-right" transition-hide="flip-left" class="bg-black text-body2" anchor="bottom start" self="top start" :offset="[10, 10]">
                    Stock Nuevos
                </q-tooltip>
            </q-btn>
            <q-btn class="q-mr-md" flat icon="local_taxi" color="white" text-color="dark">
                <q-tooltip transition-show="flip-right" transition-hide="flip-left" class="bg-black text-body2" anchor="bottom start" self="top start" :offset="[10, 10]">
                    Stock Seminuevos
                </q-tooltip>
            </q-btn>
            <q-btn flat icon="logout" color="white" text-color="dark" @click="closeSession()">
                <q-tooltip transition-show="flip-right" transition-hide="flip-left" class="bg-black text-body2" anchor="bottom start" self="top start" :offset="[10, 10]">
                    Cerrar Sesión
                </q-tooltip>
            </q-btn>
        </q-toolbar>
    </q-header>
</template>
