import * as notif from "./notification";
import { read, writeFileXLSX, utils } from "xlsx";

export function askHTTPResponse__200(response) {
    return response === 200 ? true : false;
}

export function askHTTPResponse__201(response) {
    return response === 201 ? true : false;
}

export function askHTTPResponse__TRUE(response) {
    return response ? true : false;
}

export function handleError(err) {
    let obj = {};

    switch (err.status) {
        case 400:
            obj.code = err.status;
            obj.title = "¡Sesión caducada!";
            obj.text = err.data.message;
            break;
        case 401:
            obj.code = err.status;
            obj.title = "¡No Autorizado!";
            obj.text = err.data.message;
            break;
        case 403:
            obj.code = err.status;
            obj.title = "Acceso Prohibido";
            obj.text = err.data.message;
            break;
        case 404:
            obj.code = err.status;
            obj.title = "No Encontrado";
            obj.text = err.data.message;
            break;
        case 409:
            obj.code = err.status;
            obj.title = "Error con Token";
            obj.text = err.data.message;
            break;
        case 500:
            obj.code = err.status;
            obj.title = "Error en Servidor";
            obj.text = err.data.message;
            break;
        case 503:
            obj.code = err.status;
            obj.title = "Error en Servidor";
            obj.text = err.data.message;
            break;
        default:
            obj.code = 0;
            obj.title = "Error";
            obj.text = err.data.message;
            break;
    }

    return notif.alertNegative(obj.title, obj.text);
}

export function checkNullOrUndefined(field) {
    const map = {
        null: true,
        undefined: true,
        "": true,
    };
    return map[field] ?? false;
}

export function cleanTable(table) {
    let rows = table.length;
    table.splice(table, rows);
}

export function formatDate(date, type, hourOwn) {
    let hour = null;
    let newDate = new Date(date);
    let year = newDate.getUTCFullYear();
    let month = newDate.getUTCMonth() + 1;
    let day = newDate.getUTCDate();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    if (hourOwn) {
        hour = newDate.getHours() + ":" + newDate.getMinutes() + ":" + newDate.getMilliseconds();
    } else {
        let hourTime = new Date();
        hour = hourTime.getHours() + ":" + hourTime.getMinutes() + ":" + hourTime.getMilliseconds();
    }

    if (type === "min") {
        return year + "-" + month + "-" + day;
    } else if (type === "full") {
        return year + "-" + month + "-" + day + " " + hour;
    }
}

export function colorTextStatus(item) {
    if (item) {
        return {
            color: "#1B5E20",
            text: "Activo",
        };
    } else {
        return {
            color: "#D50000",
            text: "Inactivo",
        };
    }
}

export function exportToExcel(data, filename, sheetname) {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, sheetname);

    return writeFileXLSX(workbook, `${filename}.xlsx`, { compression: true });
}

export function formatCurrency(amount, formatType) {
    let monto = 0;

    const formattersDollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumSignificantDigits: 4 });
    const formattersSoles = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", maximumSignificantDigits: 4 });

    if (formatType === 1) {
        monto = formattersDollars.format(amount);
    } else if (formatType === 2) {
        monto = formattersSoles.format(amount);
    }

    return monto;
}

function decimalAdjust(type, value, exp) {
    // Si el exp no está definido o es cero...
    if (typeof exp === "undefined" || +exp === 0) {
        return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // Si el valor no es un número o el exp no es un entero...
    if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
        return NaN;
    }
    // Shift
    value = value.toString().split("e");
    value = Math[type](+(value[0] + "e" + (value[1] ? +value[1] - exp : -exp)));
    // Shift back
    value = value.toString().split("e");
    return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp));
}

export function round10(value, exp) {
    return decimalAdjust("round", value, exp);
}
