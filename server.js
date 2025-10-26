import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
app.use(cors());
app.use(bodyParser.json());

let db;
(async () => {
    db = await open({
        filename: "./visitantes.db",
        driver: sqlite3.Database
    });
    await db.exec(`
        CREATE TABLE IF NOT EXISTS visitantes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        cpf TEXT,
        setor TEXT,
        nome_agendado TEXT,
        veiculo TEXT,
        modelo TEXT,
        observacoes TEXT,
        horario_entrada DATETIME DEFAULT CURRENT_TIMESTAMP,
        horario_saida DATETIME
        );
    `);
})();

app.get("/visitantes", async (_, res) => {
  const visitantes = await db.all("SELECT * FROM visitantes ORDER BY horario_entrada DESC");
  res.json(visitantes);
});

app.post("/visitantes", async (req, res) => {
  const { nome, cpf, setor, nome_agendado, veiculo, modelo, observacoes } = req.body;
  await db.run(
    "INSERT INTO visitantes (nome, cpf, setor, nome_agendado, veiculo, modelo, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [nome, cpf, setor, nome_agendado, veiculo, modelo, observacoes]
  );
  res.sendStatus(201);
});

app.put("/visitantes/:id/saida", async (req, res) => {
  await db.run("UPDATE visitantes SET horario_saida = CURRENT_TIMESTAMP WHERE id = ?", [req.params.id]);
  res.sendStatus(200);
});

app.get("/relatorio/:tipo", async (req, res) => {
  const { tipo } = req.params;
  const query = tipo === "mensal"
    ? "WHERE strftime('%Y-%m', horario_entrada) = strftime('%Y-%m', 'now')"
    : "WHERE date(horario_entrada) = date('now')";
  const dados = await db.all(`SELECT * FROM visitantes ${query}`);
  const csv = [
    "Nome,CPF,Setor,nome_agendado,Entrada,Saída,Veículo,Modelo,Observações",
    ...dados.map(v => `${v.nome},${v.cpf},${v.setor},${v.nome_agendado},${v.horario_entrada},${v.horario_saida || ""},${v.veiculo},${v.modelo},${v.observacoes}`)
  ].join("\n");

  const filename = `relatorio_${tipo}.csv`;
  fs.writeFileSync(filename, csv);
  res.download(filename, () => fs.unlinkSync(filename));
});

app.listen(3001, "0.0.0.0", () => console.log("✅ Servidor rodando na porta 3001"));