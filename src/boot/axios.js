import { boot } from "quasar/wrappers";
import axios from "axios";
import globalVariables from "src/Global";

const axiosInstance_API = axios.create({
    baseURL: globalVariables.URL_SCI_HEROKU_PUBLIC,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
});

const axiosInstance_PERUDEV = axios.create({
    baseURL: globalVariables.URL_API_PERU_DEV,
    params: {
        api_token: globalVariables.TOKEN_API_PERU_DEV,
    },
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
});

export default boot(({ app }) => {
    // for use inside Vue files (Options API) through this.$axios and this.$api

    app.config.globalProperties.$axios = axios;
    // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
    //       so you won't necessarily have to import axios in each vue file

    app.config.globalProperties.$api = axiosInstance_API;
    // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
    //       so you can easily perform requests against your app's API
});

export { axiosInstance_API, axiosInstance_PERUDEV };
