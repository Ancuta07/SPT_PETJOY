// Funcție pentru afișarea modalului
function showModal(type, title, message) {
  const overlay = document.getElementById("modalOverlay");
  const icon = document.getElementById("modalIcon");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const button = document.getElementById("modalButton");

  // Setează conținutul în funcție de tip
  if (type === "success") {
    icon.innerHTML = "✓";
    icon.className = "modal-icon success";
    button.className = "modal-button";
  } else {
    icon.innerHTML = "✕";
    icon.className = "modal-icon error";
    button.className = "modal-button error";
  }

  modalTitle.textContent = title;
  modalMessage.textContent = message;

  // Afișează modalul
  overlay.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {
  // Verifică autentificarea
  const user = sessionStorage.getItem("petjoy_user");
  const authButton = document.getElementById("authButton");
  const profileButton = document.getElementById("profileButton");

  if (user) {
    authButton.style.display = "none";
    profileButton.style.display = "block";
  } else {
    authButton.style.display = "block";
    profileButton.style.display = "none";
  }

  // Închide modalul cu butonul OK
  document.getElementById("modalButton").addEventListener("click", function () {
    document.getElementById("modalOverlay").style.display = "none";
  });

  // Închide modalul la click pe overlay
  document
    .getElementById("modalOverlay")
    .addEventListener("click", function (e) {
      if (e.target === this) {
        this.style.display = "none";
      }
    });

  // Validare telefon în timp real
  const phoneInput = document.getElementById("telefon-cifre-strict");

  if (phoneInput) {
    const showError = (message) => {
      const oldValue = phoneInput.value;
      const oldPlaceholder = phoneInput.placeholder;

      // Curăță conținutul și arată mesajul de eroare în placeholder
      phoneInput.value = "";
      phoneInput.placeholder = message;
      phoneInput.classList.add("error");

      // După 1,5 secunde revine la starea normală
      setTimeout(() => {
        phoneInput.classList.remove("error");
        phoneInput.placeholder = oldPlaceholder;
        phoneInput.value = oldValue;
      }, 1500);
    };

    // Blochează tastarea non-cifrelor
    phoneInput.addEventListener("keypress", function (e) {
      const char = String.fromCharCode(e.which);
      if (!/[0-9]/.test(char)) {
        e.preventDefault();
        showError("❌ Doar cifrele sunt permise!");
      }
    });

    // Blochează lipirea textului nevalid
    phoneInput.addEventListener("paste", function (e) {
      const paste = (e.clipboardData || window.clipboardData).getData("text");
      if (/[^0-9]/.test(paste)) {
        e.preventDefault();
        showError("❌ Doar cifrele sunt permise!");
      }
    });
  }

  // Configurare data și ora minimă
  const dataOraInput = document.getElementById("data-ora-programare");
  if (dataOraInput) {
    // Setează minimul la acum
    const now = new Date();
    const acum = now.toISOString().slice(0, 16);
    dataOraInput.min = acum;

    // Validare în timp real - previne selectarea datelor din trecut
    dataOraInput.addEventListener("change", function () {
      const selectedDate = new Date(this.value);
      const currentDate = new Date();

      if (selectedDate < currentDate) {
        showModal(
          "error",
          "Dată invalidă",
          "Nu poți selecta o dată din trecut. Te rugăm să alegi o dată viitoare."
        );
        this.value = "";
      }
    });
  }

  // Auto-completează emailul și prenumele dacă utilizatorul este logat
  const loggedUserStr = sessionStorage.getItem("petjoy_user");
  const emailInput = document.getElementById("email");

  if (loggedUserStr && emailInput) {
    const loggedUser = JSON.parse(loggedUserStr);
    emailInput.value = loggedUser.email;

    // Pre-completează prenumele cu numele utilizatorului (username)
    const prenumeInput = document.getElementById("prenume");
    if (prenumeInput && loggedUser.nume) {
      prenumeInput.value = loggedUser.nume;
    }
  }

  // Încarcă clinicile din baza de date
  loadClinics();

  // Gestionează formularul de programare
  const form = document.getElementById("appointmentForm");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const nume = document.getElementById("nume").value.trim();
      const prenume = document.getElementById("prenume").value.trim();
      const email = document.getElementById("email").value.trim();
      const telefon = document
        .getElementById("telefon-cifre-strict")
        .value.trim();
      const clinica = document.getElementById("clinica").value;
      const dataOraInput = document.getElementById("data-ora-programare").value;

      // Validare clinică
      if (!clinica) {
        showModal(
          "error",
          "Eroare la validare",
          "Te rog să selectezi o clinică!"
        );
        return;
      }

      // Validare telefon
      const telefonRegex = /^07\d{8}$/;
      if (!telefonRegex.test(telefon)) {
        showModal(
          "error",
          "Eroare la validare",
          "Numărul de telefon trebuie să înceapă cu 07 și să conțină exact 10 cifre."
        );
        return;
      }

      // Validare dată (nu poate fi în trecut)
      const selectedDate = new Date(dataOraInput);
      const now = new Date();
      if (selectedDate < now) {
        showModal(
          "error",
          "Eroare la validare",
          "Nu poți selecta o dată din trecut. Te rugăm să alegi o dată viitoare."
        );
        return;
      }

      // Convertim datetime-local la format ISO
      const dataOra = selectedDate.toISOString();

      const appointmentData = {
        nume,
        prenume,
        email,
        telefon,
        clinica,
        dataOra,
      };

      try {
        // Verifică disponibilitatea înainte de a crea programarea
        const checkResponse = await fetch(
          `http://localhost:8000/api/appointments/check-availability?clinica=${encodeURIComponent(
            clinica
          )}&dataOra=${encodeURIComponent(dataOra)}`
        );

        if (checkResponse.status === 409) {
          // Ora e ocupată
          showModal(
            "error",
            "Interval ocupat",
            "Ora selectată nu este disponibilă! Te rog alege altă dată și oră."
          );
          return;
        }

        if (!checkResponse.ok) {
          // Altă eroare
          showModal(
            "error",
            "Eroare",
            "Eroare la verificarea disponibilității."
          );
          return;
        }

        // Dacă e disponibil, creează programarea
        const response = await fetch("http://localhost:8000/api/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(appointmentData),
        });

        if (response.ok) {
          const appointment = await response.json();

          // Succes
          showModal(
            "success",
            "Programare confirmată!",
            `Bună ${nume} ${prenume}! Programarea ta la ${clinica} pentru data de ${selectedDate.toLocaleString(
              "ro-RO"
            )} a fost înregistrată cu succes.`
          );

          // Resetează formularul după 2 secunde
          setTimeout(() => {
            form.reset();
            // Resetează data minimă și reîncarcă clinicile
            if (dataOraInput) {
              const acum = new Date().toISOString().slice(0, 16);
              dataOraInput.min = acum;
            }
            loadClinics();
          }, 2000);
        } else {
          const error = await response.text();
          showModal(
            "error",
            "Eroare la programare",
            error || "Eroare la crearea programării"
          );
        }
      } catch (error) {
        showModal(
          "error",
          "Eroare de conexiune",
          `Eroare la conectarea cu serverul: ${error.message}`
        );
      }
    });
  }
});

// Funcție pentru încărcarea clinicilor din baza de date
async function loadClinics() {
  try {
    const response = await fetch(
      "http://localhost:8000/api/locations?tip=CLINICA"
    );
    if (!response.ok) throw new Error("Eroare la încărcarea clinicilor");

    const locations = await response.json();
    const clinicSelect = document.getElementById("clinica");

    if (clinicSelect) {
      // Păstrăm prima opțiune (placeholder)
      clinicSelect.innerHTML =
        '<option value="" disabled selected>Alege clinica</option>';

      // Adăugăm clinicile din baza de date
      locations.forEach((location) => {
        const option = document.createElement("option");
        option.value = location.adresa; // sau location.id, în funcție de preferință
        option.textContent = `${location.oras} - ${location.adresa}`;
        clinicSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Eroare la încărcarea clinicilor:", error);
    showModal(
      "error",
      "Eroare",
      "Eroare la încărcarea clinicilor. Te rog reîncearcă."
    );
  }
}
