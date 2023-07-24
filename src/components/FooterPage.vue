<script setup>
import { storeToRefs } from 'pinia';
import { useGeneralStore } from 'src/stores/general.store';
import { ref } from 'vue';

const generalStore = useGeneralStore();
const { abbreviationPlatform: appAbrev, versionPlatform: appVersion, designedByPlatform: appDesigned } = storeToRefs(generalStore);

const yearPlatform = ref(new Date().getFullYear())
</script>
<template>
    <q-footer bordered class="bg-primary text-white text-center">
        <q-toolbar>
            <q-toolbar-title class="text-weight-regular">
                <small> {{ appAbrev }} v{{ appVersion }} </small>

                <div>
                    <small class="text-weight-thin">
                        {{ appDesigned }} <strong>&copy; 2021 - {{ yearPlatform }}</strong>
                    </small>
                </div>
            </q-toolbar-title>
        </q-toolbar>
    </q-footer>
</template>
