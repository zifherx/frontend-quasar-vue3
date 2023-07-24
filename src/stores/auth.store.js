import { defineStore } from "pinia";
import { getItemById, loginService, logoutService } from "src/services";
import { ref } from "vue";
import { useRouter } from "vue-router";
import * as pro from 'src/plugins/helper';
import * as notif from 'src/plugins/notification';

export const useAuthStore = defineStore("Auth", () => {
    let usuario = ref(null);
    let online = ref(null);

    const router = useRouter();

    const loginStore = async (userX) => {
        try {
            const query = await loginService(userX);
            if(pro.askHTTPResponse__200(query.status)){
                // console.log(query);
                let userLogged = {
                    token: query.data.token,
                    userId: query.data.codigo,
                };

                usuario.value = userLogged;
                console.log("Usuario conectado ♥");
                localStorage.setItem("data-token", usuario.value.token);
                localStorage.setItem("data-user", usuario.value.userId);

                const sucessLogin = notif.notifySuccesfull('¡Login Exitoso!')
                sucessLogin.then(() => {
                    router.push('/dashboard');

                })

            }
        } catch (err) {
            pro.handleError(err.response)
        }
    };

    const detectUser = () => {
        const userLocalStorage = localStorage.getItem('data-token');
        if(pro.checkNullOrUndefined(userLocalStorage)){
            usuario.value = null;
        }else{
            let userConnected = {
                token: localStorage.getItem("data-token"),
                userId: localStorage.getItem("data-user"),
            };
            usuario.value = userConnected;
        }
    };

    const getUserConnected = async () => {
        detectUser();
        try {
            const query = await getItemById('users', usuario.value.userId);
            if(pro.askHTTPResponse__200(query.status)){
                online.value = query.data.one;
            }
        } catch (err) {
            pro.handleError(err.response);
        }
    };

    const logoutStore = async () => {
        if(!pro.checkNullOrUndefined(usuario)){
            try {
                const query = await logoutService();
                if(pro.askHTTPResponse__200(query.status)){
                    usuario.value = null;
                    online.value = null;
                    console.log("Usuario desconectado ♠");
                }
            } catch (err) {
                pro.handleError(err.response)
            }
            localStorage.removeItem("data-token");
            localStorage.removeItem("data-user");
            router.push("/");
        }
    };

    return {
        usuario,
        online,
        loginStore,
        detectUser,
        getUserConnected,
        logoutStore,
    };
});
