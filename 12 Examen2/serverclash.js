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
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
    });

    const data = await response.json();
    res.json(data); 
  } catch (error) {
    console.error("Error al obtener las cartas:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

app.get("/card/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const response = await fetch(`${BASE_URL}/cards`, {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
    });

    const data = await response.json();

    const card = data.items.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );

    if (!card) {
      return res.status(404).json({ message: "Carta no encontrada" });
    }

    res.json(card);
  } catch (error) {
    console.error("Error al buscar la carta:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor Clash Royale corriendo en http://localhost:${PORT}`);
});
