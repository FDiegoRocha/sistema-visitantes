import { useState, useEffect } from 'react';


// Substitua pelo IP do seu computador na rede local
const BASE_URL = "http://192.168.0.21:3001";

function App() {
  const [visitantes, setVisitantes] = useState([]);
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    setor: "",
    nome_agendado: "",
    veiculo: "",
    modelo: "",
    observacoes: "",
  });

  const buscarVisitantes = async () => {
    try {
      const res = await fetch(`${BASE_URL}/visitantes`);
      const data = await res.json();
      setVisitantes(data);
    } catch (err) {
      console.error("Erro ao buscar visitantes:", err);
      alert("Não foi possível conectar ao backend. Verifique o IP e se o servidor está rodando.");
    }
  };

  useEffect(() => {
    buscarVisitantes();
  }, []);

 
  const atualizarForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  
  const enviarForm = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${BASE_URL}/visitantes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm({
        nome: "",
        cpf: "",
        setor: "",
        nome_agendado: "",
        veiculo: "",
        modelo: "",
        observacoes: "",
      });
      buscarVisitantes();
    } catch (err) {
      console.error("Erro ao enviar formulario:", err);
      alert("Não foi possível enviar formulario. Verifique a conexão.");
    }
  };

  
  const registrarSaida = async (id) => {
    try {
      await fetch(`${BASE_URL}/visitantes/${id}/saida`, { method: "PUT" });
      buscarVisitantes();
    } catch (err) {
      console.error("Erro ao registrar saída:", err);
      alert("Não foi possível registrar a saída.");
    }
  };

  
  const gerarRelatorio = async (tipo) => {
    try {
      const res = await fetch(`${BASE_URL}/relatorio/${tipo}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `relatorio_${tipo}.csv`;
      a.click();
    } catch (err) {
      console.error("Erro ao gerar relatório:", err);
      alert("Não foi possível gerar o relatório.");
    }
  };

  return (
    <div className="container">
      <h2>Controle de Visitantes e Veículos</h2>

      <form onSubmit={enviarForm}>
        <input name="nome" placeholder="Nome" value={form.nome} onChange={atualizarForm} required />
        <input name="cpf" placeholder="CPF" value={form.cpf} onChange={atualizarForm} required />
        <input name="setor" placeholder="Setor" value={form.setor} onChange={atualizarForm} />
        <input name="nome_agendado" placeholder="Agendado para" value={form.nome_agendado} onChange={atualizarForm} />
        <input name="veiculo" placeholder="Placa do veículo" value={form.veiculo} onChange={atualizarForm} />
        <input name="modelo" placeholder="Modelo" value={form.modelo} onChange={atualizarForm} />
        <textarea name="observacoes" placeholder="Observações" value={form.observacoes} onChange={atualizarForm} />
        <button type="submit">Registrar Entrada</button>
      </form>

      <h3>Visitantes Atuais</h3>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Setor</th>
            <th>Agendado para</th>
            <th>Entrada</th>
            <th>Saída</th>
          </tr>
        </thead>
        <tbody>
          {visitantes.filter(v => !v.horario_saida).map(v => (
            <tr key={v.id}>
              <td data-label="Nome">{v.nome}</td>
              <td data-label="Setor">{v.setor}</td>
              <td data-label="nome_agendado">{v.nome_agendado}</td>
              <td data-label="Entrada">{v.horario_entrada}</td>
              <td data-label="Saida">
                <button onClick={() => registrarSaida(v.id)}>Registrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button onClick={() => gerarRelatorio("diario")}>📅 Relatório Diário</button>
        <button onClick={() => gerarRelatorio("mensal")} style={{ marginLeft: "10px" }}>🗓️ Relatório Mensal</button>
      </div>
    </div>
  );
}

export default App
