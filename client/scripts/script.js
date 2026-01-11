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

  // Redirect la meniu.html pentru toți utilizatorii (inclusiv admin)
  btn.href = "meniu.html";
  btn.title = "Profilul meu";
}

// ================== INIT ==================
document.addEventListener("DOMContentLoaded", () => {
  initAccountDropdown();
  loadLocations();
});

// ================== LOAD LOCATIONS ==================
async function loadLocations() {
  try {
    const response = await fetch("http://localhost:8000/api/locations");
    if (!response.ok) throw new Error("Eroare la încărcarea locațiilor");

    const locations = await response.json();

    // Separă clinicile de centrele de adopție
    const clinici = locations.filter((loc) => loc.tip === "CLINICA");
    const centre = locations.filter((loc) => loc.tip === "CENTRU_ADOPTIE");

    // Afișează clinicile
    const cliniciContainer = document.getElementById("clinici-container");
    if (cliniciContainer) {
      cliniciContainer.innerHTML = "";
      clinici.forEach((clinica) => {
        const div = document.createElement("div");
        div.className = "clinici-l";
        div.onclick = () => openMap(`${clinica.oras}, ${clinica.adresa}`);
        div.innerHTML = `
          <img src="${clinica.imageUrl}" alt="Clinica ${clinica.oras}" />
          <div class="text">
            <h3>${clinica.oras.toUpperCase()}</h3>
            <p>${clinica.adresa}</p>
          </div>
        `;
        cliniciContainer.appendChild(div);
      });
    }

    // Afișează centrele de adopție
    const adoptieContainer = document.getElementById("adoptie-container");
    if (adoptieContainer) {
      adoptieContainer.innerHTML = "";
      centre.forEach((centru) => {
        const div = document.createElement("div");
        div.className = "adoptie-l";
        div.onclick = () => openMap(`${centru.oras}, ${centru.adresa}`);
        div.innerHTML = `
          <h3>${centru.oras.toUpperCase()}</h3>
          <img src="${centru.imageUrl}" alt="Adopție ${centru.oras}" />
          <p>${centru.adresa}</p>
        `;
        adoptieContainer.appendChild(div);
      });
    }
  } catch (error) {
    console.error("Eroare la încărcarea locațiilor:", error);
  }
}
