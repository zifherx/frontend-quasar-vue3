import { axiosInstance_API } from "src/boot/axios";

const getAllItems = async (rutaAxios) => await axiosInstance_API.get(rutaAxios);
const getActiveItems = async (rutaAxios) => await axiosInstance_API.get(rutaAxios + "/activos");
const getItemById = async (rutaAxios, itemId) => await axiosInstance_API.get(rutaAxios + "/" + itemId);
const createItem = async(rutaAxios, item) => await axiosInstance_API.post(rutaAxios, item);
const getItemsByParam = async (rutaAxios, param) => await axiosInstance_API.post(rutaAxios, param);

export { getAllItems, getActiveItems, getItemById, createItem, getItemsByParam };
