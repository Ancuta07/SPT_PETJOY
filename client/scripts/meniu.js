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
function showSection(sectionId) {
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

// Încarcă comenzile utilizatorului (simulare - în realitate ar veni de la server)
async function loadUserOrders() {
  const user = sessionStorage.getItem("petjoy_user");
  if (!user) return;

  const userData = JSON.parse(user);

  try {
    // Aici ar fi cererea către server
    // const response = await fetch(`http://localhost:8000/api/comenzi/${userData.id}`);
    // const orders = await response.json();
    // Pentru moment, folosim date simulate
    // Dacă nu sunt comenzi, afișează mesajul corespunzător
    // const orderCards = document.querySelectorAll('.order-card');
    // if (orderCards.length === 0) {
    //   document.querySelector('#comenzi .empty-state').style.display = 'block';
    // }
  } catch (error) {
    console.error("Eroare la încărcarea comenzilor:", error);
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
