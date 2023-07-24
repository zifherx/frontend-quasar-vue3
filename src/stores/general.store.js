import { defineStore } from "pinia";
import { readonly, ref } from "vue";

export const useGeneralStore = defineStore("General", () => {
    const drawer = ref(true);

    const nameCompletePlatform = ref("Plataforma Integral Comercial");
    const abbreviationPlatform = ref("PIA");
    const versionPlatform = ref("3.0.0");
    const designedByPlatform = ref("Diseñado por Ziphonex");

    return {
        drawer,
        nameCompletePlatform: readonly(nameCompletePlatform),
        abbreviationPlatform: readonly(abbreviationPlatform),
        versionPlatform: readonly(versionPlatform),
        designedByPlatform: readonly(designedByPlatform),
    };
});
