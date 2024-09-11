import express, { Request, Response } from "express";
import path from "path";

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.get("/", function (request: Request, response: Response) {
  fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
    .then((res) => res.json())
    .then((data) => {
      const results = data.results.map((pokemon: any) => {
        const id = pokemon.url.split("/").filter(Boolean).pop();
        return { ...pokemon, id };
      });
      response.render("index", { results });
    });
});

app.get("/pokemon/:id", function (request: Request, response: Response) {
  const { id } = request.params;

  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then((res) => res.json())
    .then((pokemon) => {
      response.render("pokemon", { pokemon });
    })
    .catch((error) => {
      console.error("Erro ao buscar Pokémon:", error);
      response.status(500).send("Erro ao buscar Pokémon");
    });
});

app.get("/pokemon", function (request: Request, response: Response) {
  const { name } = request.query;
  const query = typeof name === "string" ? name.toLowerCase() : "";

  fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Pokémon não encontrado");
      }
    })
    .then((pokemon) => {
      response.render("pokemon", { pokemon });
    })
    .catch((error) => {
      console.error("Erro ao buscar Pokémon:", error);
      response.status(404).send("Pokémon não encontrado");
    });
});

app.listen(3000, function () {
  console.log("Server is running");
});
