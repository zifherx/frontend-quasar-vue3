<script setup>
import AppBarCore from 'src/components/core/AppBarCore.vue'
import DrawerCore from 'src/components/core/DrawerCore.vue'
import ViewCore from 'src/components/core/ViewCore.vue'
import FooterPage from 'src/components/FooterPage.vue';
import { defineComponent } from "vue";

defineComponent({
    AppBarCore,
    // DrawerCore,
    ViewCore,
    FooterPage
})

</script>
<template>
    <q-layout view="lHh lpr lFf">
        <app-bar-core/>


        <drawer-core/>

        <view-core/>

        <footer-page :abbreviationPlatform="'Plataforma SCI'" :versionPlatform="'2.4.0'" :designedByPlatform="'Diseñado por Ziphonex'"/>

    </q-layout>
</template>
