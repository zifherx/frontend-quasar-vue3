<template>
    <router-view />
</template>

<script setup>
import { useQuasar, QSpinnerGears } from "quasar";
import { onBeforeUnmount } from "vue";

const $q = useQuasar();
let timer;

onBeforeUnmount(() => {
    if (timer !== void 0) {
        clearTimeout(timer);
        $q.loading.hide();
    }
});

function showLoading() {
    $q.loading.show({
        message: "Cargando componentes...",
    });

    timer = setTimeout(() => {
        $q.loading.show({
            spinner: QSpinnerGears,
            spinnerColor: "red",
            spinnerSize: '5.5em',
            messageColor: "black",
            backgroundColor: "grey",
            message: "Iniciando SCI...",
        });

        timer = setTimeout(() => {
            $q.loading.hide();
            timer = void 0;
        }, 3000);
    }, 3000);
}

showLoading();
</script>
