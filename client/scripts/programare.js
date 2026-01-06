document.addEventListener("DOMContentLoaded", function () {
  const phoneInput = document.getElementById("telefon-cifre-strict");

  if (!phoneInput) return;

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
});

/*pentru rubrica data si ora*/
document.addEventListener("DOMContentLoaded", function () {
  const dataOraInput = document.getElementById("data-ora-programare");
  if (dataOraInput) {
    const acum = new Date().toISOString().slice(0, 16);
    dataOraInput.min = acum;
  }

  // Auto-completează emailul dacă utilizatorul este logat
  const loggedUserStr = sessionStorage.getItem("petjoy_user");
  const emailInput = document.getElementById("email");

  if (loggedUserStr && emailInput) {
    const loggedUser = JSON.parse(loggedUserStr);
    emailInput.value = loggedUser.email;

    // Opțional: pre-completează și numele dacă există
    const numeInput = document.getElementById("nume");
    if (numeInput && loggedUser.nume) {
      const numeParts = loggedUser.nume.split(" ");
      if (numeParts.length > 0) {
        numeInput.value = numeParts[0];
      }
      if (numeParts.length > 1) {
        const prenumeInput = document.getElementById("prenume");
        if (prenumeInput) {
          prenumeInput.value = numeParts.slice(1).join(" ");
        }
      }
    }
  }
});

/* Gestionarea formularului de programare */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("appointmentForm");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const nume = document.getElementById("nume").value;
      const prenume = document.getElementById("prenume").value;
      const email = document.getElementById("email").value;
      const telefon = document.getElementById("telefon-cifre-strict").value;
      const clinica = document.getElementById("clinica").value;
      const dataOraInput = document.getElementById("data-ora-programare").value;

      // Validare clinică
      if (!clinica) {
        alert("Te rog să selectezi o clinică!");
        return;
      }

      // Convertim datetime-local la format ISO
      const dataOra = new Date(dataOraInput).toISOString();

      const appointmentData = {
        nume,
        prenume,
        email,
        telefon,
        clinica,
        dataOra,
      };

      try {
        const response = await fetch("http://localhost:8000/api/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(appointmentData),
        });

        const message = document.getElementById("message");
        if (response.ok) {
          const appointment = await response.json();
          message.style.color = "green";
          message.textContent = `✅ Programare creată cu succes pentru ${nume} ${prenume} la ${clinica}!`;
          form.reset();

          // Resetează data minimă
          const dataOraInput = document.getElementById("data-ora-programare");
          if (dataOraInput) {
            const acum = new Date().toISOString().slice(0, 16);
            dataOraInput.min = acum;
          }
        } else {
          const error = await response.text();
          message.style.color = "red";
          message.textContent = `❌ Eroare: ${error}`;
        }
      } catch (error) {
        const message = document.getElementById("message");
        message.style.color = "red";
        message.textContent = `❌ Eroare la conectarea cu serverul: ${error.message}`;
      }
    });
  }
});
