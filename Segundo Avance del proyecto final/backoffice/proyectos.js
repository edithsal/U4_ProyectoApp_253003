const API = "https://portfolio-api-three-black.vercel.app/api/v1";
const token = localStorage.getItem("authToken");
const userId = localStorage.getItem("userId");
const lista = document.getElementById("lista-proyectos");

cargarProyectos();
document.getElementById("proyectoForm").addEventListener("submit", crearProyecto);

async function cargarProyectos() {
  const res = await fetch(`${API}/projects`, {
    headers: { "auth-token": token }
  });

  const data = await res.json();
  lista.innerHTML = "";

  data.forEach(p => {
    lista.innerHTML += `
      <div class="proyecto-item">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <button onclick="eliminarProyecto('${p._id}')"> Eliminar</button>
      </div>`;
  });
}

async function crearProyecto(e) {
  e.preventDefault();

  const proyecto = {
    title: document.getElementById("titulo").value,
    description: document.getElementById("descripcion").value,
    userId
  };

  await fetch(`${API}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "auth-token": token
    },
    body: JSON.stringify(proyecto)
  });

  cargarProyectos();
  e.target.reset();
}

async function eliminarProyecto(id){
  await fetch(`${API}/projects/${id}`,{
    method:"DELETE",
    headers:{ "auth-token": token }
  });

  cargarProyectos();
}
