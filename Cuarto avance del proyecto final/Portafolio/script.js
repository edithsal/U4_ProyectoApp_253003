const navLinks = document.querySelectorAll("nav a");
const teddy = document.getElementById("teddy");

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        const id = link.dataset.section;
        const target = document.getElementById(id);
        const position = target.offsetLeft;

        window.scrollTo({
            left: position,
            behavior: "smooth"
        });
    });
});


let lastScroll = 0;

window.addEventListener("scroll", () => {
    const current = window.scrollX;

    if (current > lastScroll) {
        teddy.classList.add("walking");
        teddy.style.transform = "scaleX(1)";
    } else if (current < lastScroll) {
        teddy.classList.add("walking");
        teddy.style.transform = "scaleX(-1)";
    }

    clearTimeout(window.stopScrollTimer);
    window.stopScrollTimer = setTimeout(() => {
        teddy.classList.remove("walking");
    }, 150);

    lastScroll = current;
});

const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";
const ITSON_ID = "259998"; 

async function loadProjects() {
    try {
        const res = await fetch(`${API_BASE}/publicProjects/${ITSON_ID}`);
        if (!res.ok) throw new Error("No se pudieron cargar proyectos");

        const projects = await res.json();
        renderProjects(projects);

    } catch (err) {
        console.error(err);
        document.getElementById("lista-proyectos").innerHTML = "<p>Error al cargar proyectos.</p>";
    }
}

function renderProjects(projects) {
    const container = document.getElementById("lista-proyectos");
    container.innerHTML = "";

    projects.forEach(p => {
        const card = document.createElement("div");
        card.className = "proyecto-card";

        card.innerHTML = ` <img src="${p.images?.[0] || 'img/default.png'}" alt="img proyecto"> <h3>${p.title}</h3> <p>${p.description}</p>
            <div class="meta"><strong>Tecnologías:</strong> ${p.technologies.join(", ")}</div>

            ${p.repository ? `<a href="${p.repository}" target="_blank">Ver repositorio</a>` : ""}  `;

        container.appendChild(card);
    });
}

loadProjects();