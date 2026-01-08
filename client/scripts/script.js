function openMap(address) {
  const apiKey = "AIzaSyBJNRBYaYIvzxX1_vSq69iV6YOEaImCMQs";
  const url = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(
    address
  )}`;
  window.open(url, "_blank", "width=800,height=600");
}

// ============ FUNCȚII DE AUTENTIFICARE ============
// ============ FUNCȚII DE AUTENTIFICARE ============

// Verifică statusul de autentificare
// Actualizează funcția checkAuth în script.js
function checkAuth() {
  const userStr = sessionStorage.getItem("petjoy_user");

  const accountLink = document.getElementById("accountLink");
  const accountText = document.getElementById("accountText");

  if (!accountLink) return;

  // NU e logat -> arată login
  if (!userStr) {
    accountLink.href = "autentificare.html";
    accountLink.title = "Autentificare";
    if (accountText) accountText.style.display = "none";
    return;
  }

  // E logat -> parse user
  let user;
  try {
    user = JSON.parse(userStr);
  } catch {
    sessionStorage.removeItem("petjoy_user");
    accountLink.href = "autentificare.html";
    accountLink.title = "Autentificare";
    if (accountText) accountText.style.display = "none";
    return;
  }

  const rol = (user.rol || "").toUpperCase();

  // Afișează numele lângă icon
  if (accountText) {
    accountText.textContent = user.nume || user.email || "Cont";
    accountText.style.display = "inline";
  }

  // Link-ul de cont duce unde trebuie, după rol
  if (rol === "ADMIN") {
    accountLink.href = "admin.html";
    accountLink.title = "Panou Admin";
  } else {
    accountLink.href = "meniu.html";
    accountLink.title = "Profilul meu";
  }
}


// Afișează/ascunde meniul utilizatorului
function showUserMenu(event) {
  event.preventDefault();
  const menu = document.getElementById("userMenu");
  if (menu) {
    menu.style.display = menu.style.display === "none" ? "block" : "none";
  }
}

// Ascunde meniul când se dă click în altă parte
document.addEventListener("click", function (event) {
  const menu = document.getElementById("userMenu");
  const userLink = document.querySelector('a[onclick="showUserMenu(event)"]');

  if (
    menu &&
    userLink &&
    !userLink.contains(event.target) &&
    !menu.contains(event.target)
  ) {
    menu.style.display = "none";
  }
});

// Funcție de logout
function logout() {
  sessionStorage.removeItem("petjoy_user");
  window.location.href = "autentificare.html";
}

function initAccountDropdown() {
  const userStr = sessionStorage.getItem("petjoy_user");
  const btn = document.getElementById("accountLink");
  const txt = document.getElementById("accountText");
  const icon = document.getElementById("accountIcon");
  const logoutIcon = document.getElementById("logoutIcon");

  if (!btn) return;

  // Nu e logat -> arată login
  if (!userStr) {
    if (txt) txt.style.display = "none";
    if (icon) icon.textContent = "🔐";
    btn.href = "autentificare.html";
    if (logoutIcon) logoutIcon.style.display = "none";
    return;
  }

  // E logat -> parse user
  let user;
  try {
    user = JSON.parse(userStr);
  } catch {
    sessionStorage.removeItem("petjoy_user");
    btn.href = "autentificare.html";
    if (logoutIcon) logoutIcon.style.display = "none";
    return;
  }

  const rol = (user.rol || "").toUpperCase();

  if (txt) {
    txt.textContent = user.nume || user.email || "Cont";
    txt.style.display = "inline";
  }
  if (icon) icon.textContent = "";

  // Link direct către profil (după rol)
  btn.href = rol === "ADMIN" ? "admin.html" : "meniu.html";

  // Arată și conectează iconița de logout
  if (logoutIcon) {
    logoutIcon.style.display = "inline-block";
    logoutIcon.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initAccountDropdown();
});
