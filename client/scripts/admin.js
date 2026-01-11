document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "";
  const content = document.getElementById("content");

  async function fetchJson(path, options) {
    const res = await fetch(`${API_BASE}${path}`, options);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`${path} -> ${res.status} ${text}`);
    }
    return res.json();
  }

  function renderTable(title, rows, options = {}) {
    if (!rows || rows.length === 0) {
      content.innerHTML = `<h2>${title}</h2><p>Nu există date.</p>`;
      return;
    }

    const cols = Object.keys(rows[0]);

    content.innerHTML = `
      <h2>${title}</h2>
      <table>
        <thead><tr>${cols.map((c) => `<th>${c}</th>`).join("")}${
      options.extraHeader || ""
    }</tr></thead>
        <tbody>
          ${rows
            .map(
              (r) => `
            <tr>
              ${cols.map((c) => `<td>${r[c] ?? ""}</td>`).join("")}
              ${options.rowExtra ? options.rowExtra(r) : ""}
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  async function loadTab(tab) {
    content.innerHTML = "Se încarcă...";

    try {
      if (tab === "appointments") {
        const data = await fetchJson("/api/appointments");
        renderTable("Appointments", data);
        return;
      }

      if (tab === "users") {
        const users = await fetchJson("/api/auth/users");

        renderTable("Users", users, {
          extraHeader: "<th>Rol</th>",
          rowExtra: (u) => `
            <td>${u.rol || "CLIENT"}</td>
          `,
        });

        return;
      }

      if (tab === "products") {
        const data = await fetchJson("/api/products");
        renderTable("Products", data);
        return;
      }

      if (tab === "orders") {
        const data = await fetchJson("/api/orders");
        renderTable("Orders", data);
        return;
      }
    } catch (e) {
      content.innerHTML = `
        <h2>Eroare</h2>
        <p style="color:red;">${e.message}</p>
        <p>Cel mai probabil endpoint-ul e blocat (403) sau nu există (404) sau încă nu ai tabelele în DB.</p>
      `;
      console.error(e);
    }
  }

  document.querySelectorAll(".tabs button").forEach((btn) => {
    btn.addEventListener("click", () => loadTab(btn.dataset.tab));
  });

  loadTab("appointments");
});
