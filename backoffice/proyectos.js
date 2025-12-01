const API = "https://portfolio-api-three-black.vercel.app/api/v1";
const token = localStorage.getItem("authToken");
const userId = localStorage.getItem("userId");

const userInfoDiv = document.querySelector("#user-name");
const name = localStorage.getItem("userName") || "Edith";
const itsonId = localStorage.getItem("userItsonId") || "253003";

if (userInfoDiv) {
  userInfoDiv.textContent = `${name} — ${itsonId}`;
}

const panel = document.getElementById("lista-proyectos");
const modal = document.getElementById("modal-form");
const btnAgregar = document.getElementById("btn-agregar");
const btnCancelar = document.getElementById("btn-cancelar");
const formTitle = document.getElementById("form-title");
const form = document.getElementById("form-proyecto");
const logoutBtn = document.getElementById("logout");

let editId = null;

logoutBtn.addEventListener("click", logout);

async function cargarProyectos() {
  try {
    const res = await fetch(`${API}/projects`, {
      headers: { "auth-token": token }
    });

    if (!res.ok) throw new Error("Error al obtener proyectos");

    const data = await res.json();
    renderProyectos(data);

  } catch (err) {
    console.error(err);
    alert("No se pudieron cargar los proyectos.");
  }
}

function renderProyectos(proyectos) {
  panel.innerHTML = "";

  if (!proyectos || proyectos.length === 0) {
    panel.innerHTML = `<p style="grid-column:1/-1; color:#4a3b2a;">No hay proyectos aún. Agrega tu primero.</p>`;
    return;
  }

  proyectos.forEach(p => {
    const imgSrc = (p.images && p.images.length) ? p.images[0] : "img/default.png";

    const card = document.createElement("div");
    card.classList.add("proyecto-item");
    card.innerHTML = `
      <div>
        <img src="${imgSrc}" alt="${escapeHtml(p.title)}">
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.description)}</p>
        <div class="meta"><strong>Tecnologías:</strong> ${p.technologies?.join(", ") || "-"}</div>
        ${p.repository ? `<div class="meta"><strong>Repositorio:</strong> <a href="${p.repository}" target="_blank">${p.repository}</a></div>` : ""}
      </div>
      <div class="actions">
        <button class="btn-small" onclick="abrirEditar('${p._id}')">Editar</button>
        <button class="btn-small" onclick="eliminarProyecto('${p._id}')">Eliminar</button>
      </div>
    `;
    panel.appendChild(card);
  });
}

function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

btnAgregar.addEventListener("click", () => {
  editId = null;
  form.reset();
  formTitle.textContent = "Agregar Proyecto";
  modal.style.display = "flex";
  confetti({ particleCount: 20, spread: 50, origin: { y: 0.6 }, colors: ['#d9a679', '#f6e7d8'] });
});

async function abrirEditar(id) {
  try {
    const res = await fetch(`${API}/projects/${id}`, { headers: { "auth-token": token } });
    if (!res.ok) throw new Error("Proyecto no encontrado");
    const p = await res.json();

    editId = id;
    formTitle.textContent = "Editar Proyecto";
    form.titulo.value = p.title || "";
    form.descripcion.value = p.description || "";
    form.repository.value = p.repository || "";
    form.tecnologias.value = p.technologies?.join(", ") || "";
    form.imagenes.value = p.images?.join(", ") || "";

    modal.style.display = "flex";
  } catch (err) {
    console.error(err);
    alert("No se pudo cargar el proyecto para editar.");
  }
}
window.abrirEditar = abrirEditar;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const proyecto = {
    title: form.titulo.value.trim(),
    description: form.descripcion.value.trim(),
    repository: form.repository.value.trim() || "",
    technologies: form.tecnologias.value.split(",").map(t => t.trim()).filter(t => t !== ""),
    images: form.imagenes.value.split(",").map(i => i.trim()).filter(i => i !== "")
  };

  try {
    if (!proyecto.title || !proyecto.description) {
      alert("Debes completar título y descripción.");
      return;
    }

    if (editId === null) {
      const res = await fetch(`${API}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "auth-token": token },
        body: JSON.stringify(proyecto)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ message: "" }));
        throw new Error(errData.message || "Error al crear proyecto");
      }

      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 }, colors: ['#d9a679', '#f6e7d8', '#8b5e3c'] });

    } else {
      const res = await fetch(`${API}/projects/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "auth-token": token },
        body: JSON.stringify(proyecto)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ message: "" }));
        throw new Error(errData.message || "Error al actualizar proyecto");
      }
    }

    modal.style.display = "none";
    form.reset();
    editId = null;
    cargarProyectos();
  } catch (err) {
    console.error(err);
    alert(err.message || "Ocurrió un error al guardar el proyecto.");
  }
});

async function eliminarProyecto(id) {
  if (!confirm("¿Seguro que deseas eliminar este proyecto?")) return;

  try {
    const res = await fetch(`${API}/projects/${id}`, {
      method: "DELETE",
      headers: { "auth-token": token }
    });
    if (!res.ok) throw new Error("Error al eliminar proyecto");
    cargarProyectos();
  } catch (err) {
    console.error(err);
    alert("No se pudo eliminar el proyecto.");
  }
}
window.eliminarProyecto = eliminarProyecto;

btnCancelar.addEventListener("click", () => { modal.style.display = "none"; });
modal.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

cargarProyectos();
