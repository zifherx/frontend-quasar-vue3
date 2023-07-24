import { Notify } from "quasar";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const counterTimer = 2500;

// export function notifySuccesful(message) {
//     return Notify.create({
//         type: "positive",
//         message,
//         timeout: 2500,
//         progress: true,
//         position: "top-right",
//     });
// }

export function notifySuccesfull(message) {
    // return this.$swal(message);
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: counterTimer,
        timerProgressBar: true,
        didOpen: (a) => {
            a.addEventListener("mouseenter", Swal.stopTimer);
            a.addEventListener("mouseleave", Swal.resumeTimer);
        },
    });

    return Toast.fire({
        icon: "success",
        title: message,
    });
}

// export function alertPositive(message) {
//     return Notify.create({
//         type: "positive",
//         message,
//         timeout: 0,
//         // progress: true,
//         badgeColor: "black",
//         position: "center",
//         actions: [
//             {
//                 label: "Cerrar",
//                 color: "white",
//                 handler: () => {
//                     console.log("Cerrando notification");
//                 },
//             },
//         ],
//     });
// }

export function alertPositive(title, text) {
    return Swal.fire({
        icon: "success",
        title,
        text,
        timer: 2500,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        timerProgressBar: true,
        timer: counterTimer,
        didOpen: (a) => {
            a.addEventListener("mouseenter", Swal.stopTimer);
            a.addEventListener("mouseleave", Swal.resumeTimer);
        },
    });
}

// export function alertNegative(message, caption) {
//     return Notify.create({
//         type: "negative",
//         message,
//         caption,
//         timeout: 0,
//         // progress: true,
//         badgeColor: "black",
//         position: "center",
//         actions: [
//             {
//                 label: "Cerrar",
//                 color: "white",
//                 handler: () => {
//                     console.log("Cerrando notification");
//                 },
//             },
//         ],
//     });
// }

export function alertNegative(title, text) {
    return Swal.fire({
        icon: "error",
        title,
        text,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        timerProgressBar: true,
        timer: counterTimer,
        didOpen: (a) => {
            a.addEventListener("mouseenter", Swal.stopTimer);
            a.addEventListener("mouseleave", Swal.resumeTimer);
        },
    });
}

export function askQuestion(question) {
    return Swal.fire({
        title: `¿${question}?`,
        icon: "question",
        text: "No podrás revertir la operación",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: true,
        confirmButtonColor: "#388e3c",
        cancelButtonColor: "#d50000",
        cancelButtonText: "Cancelar",
        confirmButtonText: `¡Sí!`,
    });
}
