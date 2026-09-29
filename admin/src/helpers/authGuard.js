const token = localStorage.getItem("accessToken");

if (!token) {
  window.location.href = "../../../index.html";
}