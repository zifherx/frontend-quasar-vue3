<script setup>
import { defineComponent } from "vue";
import FooterPage from "src/components/FooterPage.vue";
import HeaderPage from "src/components/HeaderPage.vue";

defineComponent({
    FooterPage,
    HeaderPage,
});
</script>
<template>
    <div class="q-pa-md">
        <q-layout view="hHr lpR fFf">
            <header-page />

            <q-page-container>
                <router-view />
            </q-page-container>

            <footer-page />
        </q-layout>
    </div>
</template>
