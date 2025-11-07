import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const BASE_URL = "https://api.clashroyale.com/v1";

app.get("/api/cards", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/cards`, {
      headers: { Authorization: `Bearer ${process.env.TOKEN}` },
    });
    const data = await response.json();
    const items = data.items || data.cards || [];
    res.json(items);
  } catch (error) {
    console.error("Error al obtener las cartas:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

app.get("/api/cards", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/cards`, {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
    });
    

    const data = await response.json();

    // Siempre devolver array de cartas
    const cards = data.items || data;
    res.json(cards);
  } catch (error) {
    console.error("Error al obtener las cartas:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor Clash Royale corriendo en http://localhost:${PORT}`);
});
