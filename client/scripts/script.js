// ================== HARTA ==================
function openMap(address) {
  const apiKey = "AIzaSyBJNRBYaYIvzxX1_vSq69iV6YOEaImCMQs";
  const url = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(
    address
  )}`;
  window.open(url, "_blank", "width=800,height=600");
}

// ================== LOGOUT ==================
function logout() {
  sessionStorage.removeItem("petjoy_user");
  window.location.href = "autentificare.html";
}

// ================== ACCOUNT ==================
function initAccountDropdown() {
  const userStr = sessionStorage.getItem("petjoy_user");

  const btn = document.getElementById("accountLink");
  const txt = document.getElementById("accountText");
  const logoutIcon = document.getElementById("logoutIcon");
  const loginIcon = document.querySelector(".lucide-log-in"); // SVG login

  if (!btn) return;

  // ===== NU e logat =====
  if (!userStr) {
    if (txt) txt.style.display = "none";
    if (loginIcon) loginIcon.style.display = "inline-block";
    if (logoutIcon) logoutIcon.style.display = "none";

    btn.href = "autentificare.html";
    btn.title = "Autentificare";
    return;
  }

  // ===== E logat =====
  let user;
  try {
    user = JSON.parse(userStr);
  } catch {
    sessionStorage.removeItem("petjoy_user");
    location.reload();
    return;
  }

  // Afiseaza numele
  if (txt) {
    txt.textContent = user.nume || user.email || "Cont";
    txt.style.display = "inline";
  }

  // Ascunde icon login
  if (loginIcon) loginIcon.style.display = "none";

  // Arata icon logout
  if (logoutIcon) {
    logoutIcon.style.display = "inline-block";
    logoutIcon.onclick = (e) => {
      e.preventDefault();
      logout();
    };
  }

  // Redirect dupa rol
  const rol = (user.rol || "").toUpperCase();
  btn.href = rol === "ADMIN" ? "admin.html" : "meniu.html";
  btn.title = rol === "ADMIN" ? "Panou Admin" : "Profilul meu";
}

// ================== INIT ==================
document.addEventListener("DOMContentLoaded", () => {
  initAccountDropdown();
});
