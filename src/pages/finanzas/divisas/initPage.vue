<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const rutaImages = ref([{ src: "https://cdn.pixabay.com/photo/2012/12/11/21/28/currencies-69522_960_720.jpg" }]);

const irRutaTipoCambio = () => {
    router.push("/finances/divisas/tcambio");
};
</script>

<template>
    <q-page padding>
        <div class="row">
            <div class="col-lg-4 col-md-4 col-xs-6">
                <q-card class="my-card q-mx-md">
                    <q-img :src="rutaImages[0].src">
                        <div class="absolute-bottom">
                            <div class="text-h6">Tipo de Cambio</div>
                        </div>
                    </q-img>

                    <q-card-section>
                        <div class="text-subtitle2">Divisas</div>
                        <div>Se gestionará el tipo de cambio de la empresa</div>
                    </q-card-section>

                    <q-separator />

                    <q-card-actions>
                        <!-- <q-space/> -->
                        <q-btn color="cyan" dense @click="irRutaTipoCambio">
                            <q-icon left name="description"></q-icon>
                            Lista
                        </q-btn>
                    </q-card-actions>
                </q-card>
            </div>
        </div>
    </q-page>
</template>

<style scoped>
.my-card {
    width: 100%;
    max-width: 600px;
}
</style>
