import { useState } from "react";

interface ViaCepResponse {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean | string;
}

function App() {
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [numero, setNumero] = useState("");

  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  async function buscarCep() {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      setMensagem("Digite um CEP válido com 8 números.");
      return;
    }

    setCarregando(true);
    setMensagem("");

    try {
      const resposta = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );

      if (!resposta.ok) {
        throw new Error("Erro na consulta.");
      }

      const dados: ViaCepResponse = await resposta.json();

      if (dados.erro) {
        setMensagem("CEP não encontrado.");
        setRua("");
        setBairro("");
        setCidade("");
        setUf("");
        return;
      }

      setRua(dados.logradouro ?? "");
      setBairro(dados.bairro ?? "");
      setCidade(dados.localidade ?? "");
      setUf(dados.uf ?? "");

      setMensagem("Endereço encontrado!");
    } catch {
      setMensagem(
        "Não foi possível consultar o CEP. Verifique sua conexão."
      );
    } finally {
      setCarregando(false);
    }
  }

  function formatarCep(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 8);

    if (numeros.length > 5) {
      return `${numeros.slice(0, 5)}-${numeros.slice(5)}`;
    }

    return numeros;
  }

  function enviarFormulario(event: React.FormEvent) {
    event.preventDefault();

    setMensagem(
      `Cadastro realizado para o endereço ${rua}, ${numero} - ${bairro}, ${cidade}/${uf}.`
    );
  }

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            'Segoe UI', Roboto, sans-serif;
        }

        body {
          background-color: #f0f2f5;
          color: #333;
          min-height: 100vh;
        }

        .pagina {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
        }

        .container {
          width: 100%;
          max-width: 480px;
        }

        .card {
          background: #ffffff;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        h2 {
          font-size: 1.5rem;
          color: #1a1a1a;
          margin-bottom: 0.25rem;
        }

        .subtitle {
          font-size: 0.875rem;
          color: #666;
          margin-bottom: 1.5rem;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
        }

        .field-row {
          display: flex;
          gap: 1rem;
        }

        .field-row .field-group {
          flex: 1;
        }

        label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.4rem;
        }

        input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.95rem;
          outline: none;
          background: white;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }

        input:read-only {
          background-color: #f8fafc;
          color: #555;
        }

        .cep-row {
          display: flex;
          gap: 0.5rem;
        }

        .cep-row input {
          flex: 1;
        }

        button {
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .buscar {
          background: #2563eb;
          color: white;
          white-space: nowrap;
        }

        .buscar:hover {
          background: #1d4ed8;
        }

        .buscar:disabled {
          background: #93c5fd;
          cursor: not-allowed;
        }

        .enviar {
          width: 100%;
          margin-top: 0.5rem;
          background: #16a34a;
          color: white;
        }

        .enviar:hover {
          background: #15803d;
        }

        .mensagem {
          margin: 1rem 0;
          padding: 0.75rem;
          border-radius: 8px;
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 0.875rem;
        }

        @media (max-width: 480px) {
          .card {
            padding: 1.5rem;
          }

          .field-row {
            flex-direction: column;
            gap: 0;
          }

          .cep-row {
            flex-direction: column;
          }
        }
      `}</style>

      <main className="pagina">
        <div className="container">
          <div className="card">
            <h2>Cadastro de endereço</h2>

            <p className="subtitle">
              Digite seu CEP para preencher o endereço automaticamente.
            </p>

            <form onSubmit={enviarFormulario}>
              <div className="field-group">
                <label htmlFor="cep">CEP</label>

                <div className="cep-row">
                  <input
                    id="cep"
                    type="text"
                    placeholder="00000-000"
                    value={cep}
                    onChange={(event) => {
                      setCep(formatarCep(event.target.value));
                      setMensagem("");
                    }}
                    maxLength={9}
                  />

                  <button
                    type="button"
                    className="buscar"
                    onClick={buscarCep}
                    disabled={carregando}
                  >
                    {carregando ? "Buscando..." : "Buscar CEP"}
                  </button>
                </div>
              </div>

              <div className="field-group">
                <label htmlFor="rua">Rua</label>

                <input
                  id="rua"
                  type="text"
                  placeholder="Nome da rua"
                  value={rua}
                  onChange={(event) => setRua(event.target.value)}
                />
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label htmlFor="numero">Número</label>

                  <input
                    id="numero"
                    type="text"
                    placeholder="123"
                    value={numero}
                    onChange={(event) => setNumero(event.target.value)}
                  />
                </div>

                <div className="field-group">
                  <label htmlFor="bairro">Bairro</label>

                  <input
                    id="bairro"
                    type="text"
                    placeholder="Bairro"
                    value={bairro}
                    onChange={(event) => setBairro(event.target.value)}
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label htmlFor="cidade">Cidade</label>

                  <input
                    id="cidade"
                    type="text"
                    placeholder="Cidade"
                    value={cidade}
                    onChange={(event) => setCidade(event.target.value)}
                  />
                </div>

                <div className="field-group">
                  <label htmlFor="uf">UF</label>

                  <input
                    id="uf"
                    type="text"
                    placeholder="UF"
                    value={uf}
                    maxLength={2}
                    onChange={(event) =>
                      setUf(event.target.value.toUpperCase())
                    }
                  />
                </div>
              </div>

              {mensagem && (
                <div className="mensagem">
                  {mensagem}
                </div>
              )}

              <button type="submit" className="enviar">
                Cadastrar endereço
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
