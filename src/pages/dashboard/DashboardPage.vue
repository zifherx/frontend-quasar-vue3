<template>
  <q-page padding>
    <!-- content -->
  </q-page>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { axiosInstance_API } from 'src/boot/axios';
import { useAuthStore } from 'src/stores/auth.store';

const useAuth = useAuthStore();
const { usuario } = storeToRefs(useAuth);

const init = () => {
    useAuth.detectUser();
    asignarTokenAxios();
}

const asignarTokenAxios = () => {
    axiosInstance_API.defaults.headers['x-access-token'] = usuario.value.token;
}

init();

</script>
