// Verifică autentificarea la încărcarea paginii
document.addEventListener("DOMContentLoaded", function () {
  checkUserAuth();
  loadUserData();
  loadUserOrders();
  loadUserAppointments();
});

// Verifică dacă utilizatorul este autentificat
function checkUserAuth() {
  const user = sessionStorage.getItem("petjoy_user");

  if (!user) {
    alert("Trebuie să fiți autentificat pentru a accesa această pagină!");
    window.location.href = "autentificare.html";
    return;
  }
}

// Încarcă datele utilizatorului
function loadUserData() {
  const user = sessionStorage.getItem("petjoy_user");

  if (user) {
    const userData = JSON.parse(user);

    // Actualizează informațiile din profil
    document.getElementById("userName").textContent = userData.nume;
    document.getElementById("profileName").textContent = userData.nume;
    document.getElementById("profileEmail").textContent = userData.email;
    document.getElementById("profileRole").textContent =
      userData.rol || "Utilizator";
  }
}

// Schimbă secțiunea activă
function showSection(sectionId, event) {
  // Ascunde toate secțiunile
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => {
    section.classList.remove("active");
  });

  // Afișează secțiunea selectată
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add("active");
  }

  // Actualizează butoanele din menu
  const buttons = document.querySelectorAll(".menu-btn");
  buttons.forEach((button) => {
    button.classList.remove("active");
  });

  // Adaugă clasa active pe butonul apăsat
  event.target.closest(".menu-btn").classList.add("active");
}

// Deconectare
function logout() {
  if (confirm("Sigur doriți să vă deconectați?")) {
    sessionStorage.removeItem("petjoy_user");
    window.location.href = "autentificare.html";
  }
}

// Încarcă comenzile utilizatorului (din backend)
async function loadUserOrders() {
  const user = sessionStorage.getItem("petjoy_user");
  if (!user) return;

  const userData = JSON.parse(user);

  try {
    const response = await fetch(
      `http://localhost:8000/api/orders/user/${encodeURIComponent(
        userData.email
      )}`
    );

    if (!response.ok) {
      throw new Error("Eroare la încărcarea comenzilor: " + response.status);
    }

    const orders = await response.json();
    displayOrders(orders);
  } catch (error) {
    console.error("Eroare la încărcarea comenzilor:", error);

    const ordersGrid = document.querySelector("#comenzi .cards-grid");
    if (ordersGrid) {
      ordersGrid.innerHTML = `
        <div class="empty-state" style="display: block;">
          <p>⚠️ Eroare la încărcarea comenzilor (backend indisponibil)</p>
        </div>
      `;
    }
  }
}

// Încarcă programările utilizatorului
async function loadUserAppointments() {
  const user = sessionStorage.getItem("petjoy_user");
  if (!user) return;

  const userData = JSON.parse(user);

  try {
    // Cerere către server pentru a obține programările utilizatorului
    const response = await fetch(
      `http://localhost:8000/api/appointments/user/${encodeURIComponent(
        userData.email
      )}`
    );

    if (!response.ok) {
      throw new Error("Eroare la încărcarea programărilor");
    }

    const appointments = await response.json();

    // Actualizează interfața cu programările primite
    displayAppointments(appointments);
  } catch (error) {
    console.error("Eroare la încărcarea programărilor:", error);
    // Afișează mesajul de empty state în caz de eroare
    const appointmentsGrid = document.querySelector("#programari .cards-grid");
    if (appointmentsGrid) {
      appointmentsGrid.innerHTML = `
        <div class="empty-state">
          <p>⚠️ Eroare la încărcarea programărilor</p>
        </div>
      `;
    }
  }
}

// Afișează comenzile în interfață
function displayOrders(orders) {
  const ordersGrid = document.querySelector("#comenzi .cards-grid");
  if (!ordersGrid) return;

  ordersGrid.innerHTML = "";

  if (!orders || orders.length === 0) {
    ordersGrid.innerHTML = `
      <div class="empty-state" style="display: block;">
        <p>Nu aveți comenzi înregistrate</p>
      </div>
    `;
    return;
  }

  orders.forEach((order) => {
    const card = createOrderCard(order);
    ordersGrid.appendChild(card);
  });
}

// Creează card pentru o comandă
function createOrderCard(order) {
  const card = document.createElement("div");
  card.className = "order-card";

  const status = order.status || order.stare || "NECUNOSCUT";
  const total = order.total ?? order.pretTotal ?? 0;

  // Parse produse JSON string
  let items = [];
  try {
    if (typeof order.produse === "string") {
      items = JSON.parse(order.produse);
    } else if (Array.isArray(order.produse)) {
      items = order.produse;
    } else if (Array.isArray(order.items)) {
      items = order.items;
    }
  } catch (e) {
    console.error("Eroare la parsarea produselor:", e);
    items = [];
  }

  const itemsHtml = items.length
    ? `<ul class="order-items">
        ${items
          .map((it) => {
            const name = it.productName || it.numeProdus || "Produs";
            const qty = it.quantity ?? it.cantitate ?? it.qty ?? 1;
            const price = it.priceAtOrder ?? it.pret ?? 0;
            return `<li>${name} — ${qty}x (${price} RON)</li>`;
          })
          .join("")}
      </ul>`
    : `<p style="opacity:0.8">Produse indisponibile în răspuns (backend)</p>`;

  card.innerHTML = `
    <h3>Comanda #${order.id}</h3>
    <p><strong>Status:</strong> ${status}</p>
    <p><strong>Data:</strong> ${new Date(order.createdAt).toLocaleDateString(
      "ro-RO"
    )}</p>
    <p><strong>Total:</strong> ${total} lei</p>
    ${itemsHtml}
    <div class="order-actions" style="margin-top:12px;">
      <button class="btn-danger" onclick="deleteOrder(${
        order.id
      })">Șterge</button>
    </div>
  `;

  return card;
}

// Șterge o comandă (backend)
async function deleteOrder(orderId) {
  if (!confirm("Sigur doriți să ștergeți această comandă?")) return;

  try {
    const response = await fetch(
      `http://localhost:8000/api/orders/${orderId}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      throw new Error("Eroare la ștergere");
    }

    alert("✅ Comanda a fost ștearsă!");
    loadUserOrders();
  } catch (error) {
    console.error("Eroare la ștergerea comenzii:", error);
    alert("❌ Nu am putut șterge comanda. Verifică backend-ul/endpoint-ul.");
  }
}

// Afișează programările în interfață
function displayAppointments(appointments) {
  const appointmentsGrid = document.querySelector("#programari .cards-grid");

  if (!appointmentsGrid) return;

  // Șterge conținutul existent
  appointmentsGrid.innerHTML = "";

  // Dacă nu există programări
  if (!appointments || appointments.length === 0) {
    appointmentsGrid.innerHTML = `
      <div class="empty-state" style="display: block;">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <p>Nu aveți programări înregistrate</p>
      </div>
    `;
    return;
  }

  // Creează card-uri pentru fiecare programare
  appointments.forEach((appointment) => {
    const appointmentCard = createAppointmentCard(appointment);
    appointmentsGrid.appendChild(appointmentCard);
  });
}

// Creează un card pentru o programare
function createAppointmentCard(appointment) {
  const card = document.createElement("div");
  card.className = "appointment-card";

  // Formatează data și ora
  const dateTime = new Date(appointment.dataOra);
  const formattedDate = dateTime.toLocaleDateString("ro-RO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = dateTime.toLocaleTimeString("ro-RO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Verifică dacă programarea este în viitor
  const now = new Date();
  const isUpcoming = dateTime > now;

  if (isUpcoming) {
    card.classList.add("upcoming");
  }

  card.innerHTML = `
    <div class="appointment-icon">${isUpcoming ? "📅" : "📋"}</div>
    <h3>Programare ${appointment.clinica}</h3>
    <p class="appointment-date">${formattedDate}, ${formattedTime}</p>
    <p class="appointment-location">${appointment.clinica}</p>
    <p class="appointment-pet"><strong>Pacient:</strong> ${appointment.nume} ${
    appointment.prenume
  }</p>
    <p class="appointment-contact"><strong>Telefon:</strong> ${
      appointment.telefon
    }</p>
    <div class="appointment-actions">
      ${
        isUpcoming
          ? `<button class="btn-danger" onclick="cancelAppointment(${appointment.id})">Anulează</button>`
          : `<span class="status-badge">Finalizată</span>`
      }
    </div>
  `;

  return card;
}

// Anulează o programare
async function cancelAppointment(appointmentId) {
  if (!confirm("Sigur doriți să anulați această programare?")) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8000/api/appointments/${appointmentId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Eroare la anularea programării");
    }

    alert("✅ Programare anulată cu succes!");

    // Reîncarcă programările
    loadUserAppointments();
  } catch (error) {
    console.error("Eroare la anularea programării:", error);
    alert("❌ Eroare la anularea programării. Vă rugăm încercați din nou.");
  }
}

// Deschide Google Maps cu locația
function openMap(address) {
  const apiKey = "AIzaSyBJNRBYaYIvzxX1_vSq69iV6YOEaImCMQs";
  const url = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(
    address
  )}`;
  window.open(url, "_blank", "width=800,height=600");
}
document.addEventListener("DOMContentLoaded", () => {
  const userStr = sessionStorage.getItem("petjoy_user");
  if (!userStr) {
    window.location.href = "autentificare.html";
    return;
  }

  let u;
  try {
    u = JSON.parse(userStr);
  } catch {
    sessionStorage.removeItem("petjoy_user");
    window.location.href = "autentificare.html";
    return;
  }

  const rol = (u.rol || "").toUpperCase();
  const adminBtn = document.getElementById("adminBtn");
  if (adminBtn) adminBtn.style.display = rol === "ADMIN" ? "block" : "none";
});
