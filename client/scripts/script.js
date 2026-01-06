function openMap(address) {
  const apiKey = "AIzaSyBJNRBYaYIvzxX1_vSq69iV6YOEaImCMQs";
  const url = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(
    address
  )}`;
  window.open(url, "_blank", "width=800,height=600");
}

function toggleChat() {
  const windowEl = document.getElementById("chatWindow");
  if (windowEl.style.display === "flex") {
    windowEl.style.display = "none";
  } else {
    windowEl.style.display = "flex";
    windowEl.style.flexDirection = "column";
  }
}

function handleChat(event) {
  if (event.key === "Enter") {
    const input = document.getElementById("chatInput");
    const msg = input.value.trim();
    if (msg === "") return;

    addMessage(msg, "user");
    input.value = "";

    setTimeout(() => {
      if (!window.botStep) window.botStep = 1;

      if (window.botStep === 1) {
        addMessage("Ce cabinet vă interesează?", "bot");
        window.botStep = 2;
      } else if (window.botStep === 2) {
        addMessage("O să vă contacteze un coleg în cel mai scurt timp.", "bot");
        window.botStep = 3;
      }
    }, 600);
  }
}

function addMessage(text, sender) {
  const chat = document.getElementById("chatMessages");
  const div = document.createElement("div");
  div.textContent = text;
  div.className = sender === "bot" ? "bot-message" : "user-message";
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

// ============ FUNCȚII DE AUTENTIFICARE ============

// Verifică statusul de autentificare
// Actualizează funcția checkAuth în script.js
function checkAuth() {
  const user = sessionStorage.getItem("petjoy_user");
  const loginLink = document.querySelector('a[href="autentificare.html"]');

  if (user && loginLink) {
    const userData = JSON.parse(user);
    const li = loginLink.parentElement;

    // Înlocuiește link-ul de login cu link către meniul utilizatorului
    li.innerHTML = `
      <a href="meniu.html" style="display: flex; align-items: center; gap: 5px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span style="font-size: 14px;">${userData.nume}</span>
      </a>
    `;
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
  if (confirm("Sigur doriți să vă deconectați?")) {
    sessionStorage.removeItem("petjoy_user");
    window.location.href = "autentificare.html";
  }
}

// Verifică dacă utilizatorul este autentificat (pentru pagini protejate)
function requireAuth() {
  const user = sessionStorage.getItem("petjoy_user");
  if (!user) {
    alert("Trebuie să fiți autentificat pentru a accesa această pagină!");
    window.location.href = "autentificare.html";
    return false;
  }
  return true;
}

// Obține datele utilizatorului curent
function getCurrentUser() {
  const user = sessionStorage.getItem("petjoy_user");
  return user ? JSON.parse(user) : null;
}

// Rulează verificarea la încărcarea paginii
document.addEventListener("DOMContentLoaded", checkAuth);
