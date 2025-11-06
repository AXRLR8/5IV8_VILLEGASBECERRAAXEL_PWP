// main.js - usa el proxy local en /api/cards
const API_URL = "http://localhost:3000/api/cards";

const searchBtn = document.getElementById("searchBtn");
const cardNameInput = document.getElementById("cardName");
const loading = document.getElementById("loading");
const cardContainer = document.getElementById("cardContainer");
const errorMsg = document.getElementById("errorMsg");

const cardImage = document.getElementById("cardImage");
const cardTitle = document.getElementById("cardTitle");
const cardRarity = document.getElementById("cardRarity");
const cardElixir = document.getElementById("cardElixir");
const cardMaxLevel = document.getElementById("cardMaxLevel");

function showLoading() {
  loading.classList.remove("hidden");
  cardContainer.classList.add("hidden");
  errorMsg.classList.add("hidden");
}
function hideLoading() {
  loading.classList.add("hidden");
}
function showError(text = "No se encontró la carta. Intenta otro nombre.") {
  errorMsg.textContent = `${text}`;
  errorMsg.classList.remove("hidden");
  cardContainer.classList.add("hidden");
}
function clearRarityClasses() {
  cardContainer.classList.remove("common", "rare", "epic", "legendary");
}
function applyRarityClass(rarity) {
  if (!rarity) return;
  const r = rarity.toLowerCase();
  if (r.includes("common")) cardContainer.classList.add("common");
  else if (r.includes("rare")) cardContainer.classList.add("rare");
  else if (r.includes("epic")) cardContainer.classList.add("epic");
  else if (r.includes("legendary")) cardContainer.classList.add("legendary");
  else cardContainer.classList.add("common");
}
function normalize(s = "") {
  return s
    .toString()
    .normalize("NFD")               // separa acentos
    .replace(/[\u0300-\u036f]/g, "")// quita acentos
    .replace(/[^a-z0-9]/gi, "")     // quita espacios y símbolos
    .toLowerCase();
}

async function buscarCarta() {
  const raw = cardNameInput.value || "";
  const q = raw.trim();
  if (!q) return alert("Escribe el nombre de la carta (ej. princess)");

  showLoading();

  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      const txt = await res.text();
      hideLoading();
      showError(`Error del servidor: ${res.status} ${txt}`);
      return;
    }

    const data = await res.json();
    const items = Array.isArray(data) ? data : (data.items || []);
    if (!items.length) {
      hideLoading();
      showError("La lista de cartas está vacía o el proxy no devolvió datos.");
      return;
    }

    const qNorm = normalize(q);
    let card = items.find(c => normalize(c.name) === qNorm);
    if (!card) {
      card = items.find(c => normalize(c.name).includes(qNorm));
    }
    if (!card) {
      // prueba un match por startsWith
      card = items.find(c => normalize(c.name).startsWith(qNorm));
    }

    hideLoading();

    if (!card) {
      showError("Carta no encontrada.");
      return;
    }

    // Mostrar solo campos que la API SI entrega
    const img = card.iconUrls?.medium || card.icon?.medium || "";
    cardImage.src = img;
    cardTitle.textContent = card.name || "—";
    cardRarity.textContent = card.rarity || "—";
    cardElixir.textContent = card.elixirCost ?? card.elixir ?? "—";
    cardMaxLevel.textContent = card.maxLevel ?? "—";

    // aplicar rareza (clases para CSS)
    clearRarityClasses();
    applyRarityClass(card.rarity);

    cardContainer.classList.remove("hidden");
    errorMsg.classList.add("hidden");
  } catch (err) {
    console.error("Error fetching cards:", err);
    hideLoading();
    showError("Error en la conexión al servidor. Revisa que el proxy esté corriendo.");
  }
}

searchBtn.addEventListener("click", buscarCarta);
cardNameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") buscarCarta();
});
