const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";

async function registerUser(event) {
  event.preventDefault();

  const user = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    itsonId: document.getElementById("itsonId").value,
    password: document.getElementById("password").value,
  };

  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  const data = await res.json();
  console.log(data);

  if (!res.ok) {
    alert("Error al registrar: " + data.message);
    return;
  }

  alert("Usuario registrado con éxito");
  window.location.href = "Login.html";
}

async function loginUser(event) {
  event.preventDefault();

  const credentials = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();
  console.log(data);

  if (!res.ok) {
    alert("Error al iniciar sesión: " + data.message);
    return;
  }

  localStorage.setItem("authToken", data.token);
  alert("Login correcto, entrando...");

  window.location.href = "Home.html";  
}

function logout() {
  localStorage.removeItem("authToken");
  window.location.href = "Login.html";
}
