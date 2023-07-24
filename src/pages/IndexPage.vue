<script setup>
import { ref } from "vue";
import PortadaPage from "components/PortadaPage.vue";
import LoginPage from "components/LoginPage.vue";
import { getActiveItems } from "../services";
import * as pro from "../plugins/helper";

const imagesLinks = ref([]);

async function getPortadas() {
    try {
        const query = await getActiveItems("portada");
        if (pro.askHTTPResponse__200(query.status)) {
            // console.log(query);
            await query.data.all.forEach((element) => {
                let a = {};
                a.name = element.name;
                a.src = element.avatar;

                imagesLinks.value.push(a);
            });
        }
    } catch (err) {
        console.log(err);
        console.log(err.response);
    }
}
getPortadas();
</script>
<template>
    <div class="q-pa-md">
        <div class="row">
            <div v-if="!$q.screen.xs" class="col-12 col-md-8">
                <!-- <Suspense> -->
                    <portada-page :urlImages="imagesLinks" />
                <!-- </Suspense> -->
            </div>
            <div class="col-12 col-md-4 q-my-auto">
                <login-page />
            </div>
        </div>
    </div>
</template>
