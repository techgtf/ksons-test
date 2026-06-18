import Cookies from "js-cookie";

export function logoutUser() {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    window.location.href = "/admin/login";
}