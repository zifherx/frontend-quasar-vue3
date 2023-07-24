<script setup>
import { useAuthStore } from "stores/auth.store";
import { ref, computed } from "vue";

const authStore = useAuthStore();
const { loginStore } = authStore;

const account = ref({
    username: "",
    password: "",
});

const inputFillCancelled = ref(false);
const isPwd = ref(true);
const loading = ref([]);

const inputShadowText = computed(() => {
    if (inputFillCancelled.value === true) {
        return "";
    }

    const placeHolder1 = "Ingrese Usuario";

    const empty = typeof account.value.username !== "string" || account.value.username.length === 0;

    if (empty === true) {
        return placeHolder1;
    } else if (placeHolder1.indexOf(account.value.username) !== 0) {
        return "";
    }

    return placeHolder1.split(account.value.username).slice(1).join(account.value.username);
});

function load(i) {
    this.loading[i] = true;

    setTimeout(() => {
        loginStore(account.value);
    }, 2000);

    setTimeout(() => {
        // console.log('Cuenta:',account.value);
        this.loading[i] = false;

    }, 5000);
}
</script>
<template>
    <div class="q-pa-lg vertical-middle">
        <q-card>
            <q-card-section>
                <div class="text-h4 text-uppercase text-primary text-weight-bold text-center">Login</div>
            </q-card-section>
            <q-form @submit.prevent="load(3)" class="q-gutter-sm">
                <q-card-section class="q-pa-md">
                    <q-input v-model="account.username" class="q-mb-md" color="primary" label="Usuario" outlined :shadow-text="inputShadowText" :disable="loading[3]" clearable autofocus>
                        <template v-slot:prepend>
                            <q-icon name="account_circle" color="primary"></q-icon>
                        </template>
                    </q-input>
                    <q-input v-model="account.password" :type="isPwd ? 'password' : 'text'" color="primary" label="Contraseña" :disable="loading[3]" outlined>
                        <template v-slot:prepend>
                            <q-icon name="lock" color="primary"></q-icon>
                        </template>
                        <template v-slot:append>
                            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" color="primary" @click="isPwd = !isPwd"></q-icon>
                        </template>
                    </q-input>
                </q-card-section>
                <q-card-actions class="q-pa-md">
                    <q-btn class="full-width" color="primary" type="submit" :disable="loading[3]" :loading="loading[3]">
                        <q-icon left name="login"></q-icon>
                        <div class="text-h5">LOGIN</div>
                        <template v-slot:loading>
                            <q-spinner-hourglass class="on-left" />
                            Creando sesión
                        </template>
                    </q-btn>
                </q-card-actions>
            </q-form>
        </q-card>
    </div>
</template>
