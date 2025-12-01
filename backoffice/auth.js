const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";

async function registerUser(event) {
  event.preventDefault();

  const user = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    itsonId: document.getElementById("itsonId").value,
    password: document.getElementById("password").value,
  };

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await res.json();
    console.log("Registro:", data);

    if (!res.ok) throw new Error(data.message || "Error al registrar");

    alert("Usuario registrado con éxito");
    window.location.href = "Login.html";

  } catch (err) {
    console.error(err);
    alert("Error al registrar: " + err.message);
  }
}

async function loginUser(event) {
  event.preventDefault();

  const credentials = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();
    console.log("Login:", data);

    if (!res.ok) throw new Error(data.message || "Error al iniciar sesión");

    localStorage.setItem("authToken", data.token);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("userName", data.user?.name || "Edith");
    localStorage.setItem("userItsonId", data.user?.itsonId || "253003");

    alert("Login correcto, entrando...");
    window.location.href = "Home.html";

  } catch (err) {
    console.error(err);
    alert("Error al iniciar sesión: " + err.message);
  }
}

function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("userItsonId");
  window.location.href = "Login.html";
}
