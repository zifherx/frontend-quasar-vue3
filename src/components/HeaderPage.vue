<script setup>
import { storeToRefs } from "pinia";
import { useGeneralStore } from "src/stores/general.store";
import { ref } from "vue";

const generalStore = useGeneralStore();
const {nameCompletePlatform: appName, abbreviationPlatform: appAbrev} = storeToRefs(generalStore)

const urlLogo = ref("src/assets/logo-autonort-white.png");
</script>
<template>
    <q-header :reveal="false" class="text-white">
        <q-toolbar>
            <q-toolbar-title>
                {{ appAbrev }}
                <q-tooltip transition-show="flip-right" transition-hide="flip-left" class="bg-black text-body2" anchor="bottom start" self="top start" :offset="[10, 10]">
                    {{ appName  }}
                </q-tooltip>
            </q-toolbar-title>
            <q-space />
            <q-btn flat size="lg" icon="calculate">
                <q-tooltip transition-show="flip-right" transition-hide="flip-left" class="bg-black text-body2" anchor="bottom middle" self="top middle" :offset="[10, 10]">
                    Calculadora EPDP
                </q-tooltip>
            </q-btn>
            <q-btn flat>
                <!-- <q-avatar size="100px"> -->
                <q-img :src="urlLogo" style="width: 150px"></q-img>
                <!-- </q-avatar> -->
            </q-btn>
        </q-toolbar>
    </q-header>
</template>
