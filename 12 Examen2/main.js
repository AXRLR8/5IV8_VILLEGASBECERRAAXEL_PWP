const API_URL = "http://localhost:3000/api/cards";

const searchBtn = document.getElementById("searchBtn");
const cardNameInput = document.getElementById("cardName");
const loading = document.getElementById("loading");
const cardContainer = document.getElementById("cardContainer");
const cardError = document.getElementById("cardError");

const cardImage = document.getElementById("cardImage");
const cardTitle = document.getElementById("cardTitle");
const cardRarity = document.getElementById("cardRarity");
const cardElixir = document.getElementById("cardElixir");
const cardMaxLevel = document.getElementById("cardMaxLevel");

function showLoading() {
  loading.classList.remove("hidden");
  cardContainer.classList.add("hidden");
  cardError.classList.add("hidden");
}

function hideLoading() {
  loading.classList.add("hidden");
}

function showCard(card) {
  hideLoading();
  cardError.classList.add("hidden");

  const img = card.iconUrls?.medium || card.icon?.medium || "";
  cardImage.src = img;
  cardTitle.textContent = card.name || "—";
  cardRarity.textContent = card.rarity || "—";
  cardElixir.textContent = card.elixirCost ?? card.elixir ?? "—";
  cardMaxLevel.textContent = card.maxLevel ?? "—";

  clearRarityClasses();
  applyRarityClass(card.rarity);

  cardContainer.classList.remove("hidden");
}

function showError() {
  hideLoading();
  cardContainer.classList.add("hidden");
  cardError.classList.remove("hidden");
}

function clearRarityClasses() {
  cardContainer.classList.remove("common", "rare", "epic", "legendary");
  cardImage.classList.remove("common", "rare", "epic", "legendary");
}

function applyRarityClass(rarity) {
  if (!rarity) return;
  const r = rarity.toLowerCase();
  if (r.includes("common")) {
    cardContainer.classList.add("common");
    cardImage.classList.add("common");
  } else if (r.includes("rare")) {
    cardContainer.classList.add("rare");
    cardImage.classList.add("rare");
  } else if (r.includes("epic")) {
    cardContainer.classList.add("epic");
    cardImage.classList.add("epic");
  } else if (r.includes("legendary")) {
    cardContainer.classList.add("legendary");
    cardImage.classList.add("legendary");
  } else {
    cardContainer.classList.add("common");
    cardImage.classList.add("common");
  }
}

function normalize(s = "") {
  return s
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
}

async function buscarCarta() {
  const q = cardNameInput.value.trim();
  if (!q) return alert("Escribe el nombre de la carta (ej. princess)");

  showLoading();

  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      showError();
      return;
    }

    const data = await res.json();
    const items = Array.isArray(data) ? data : data.items || [];
    if (!items.length) {
      showError();
      return;
    }

    const qNorm = normalize(q);
    let card = items.find((c) => normalize(c.name) === qNorm)
      || items.find((c) => normalize(c.name).includes(qNorm))
      || items.find((c) => normalize(c.name).startsWith(qNorm));

    if (!card) {
      showError();
      return;
    }

    showCard(card);
  } catch (err) {
    console.error("Error fetching cards:", err);
    showError();
  }
}

searchBtn.addEventListener("click", buscarCarta);
cardNameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") buscarCarta();
});
