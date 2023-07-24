import { axiosInstance_API } from "src/boot/axios";

const loginService = async (usuario) => await axiosInstance_API.post("auth/login", usuario);
const logoutService = async () => await axiosInstance_API.post("auth/logout");

export { loginService, logoutService };
