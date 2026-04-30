import React, { useMemo, useState } from 'react';

const featureNames = [
  { label: 'To-Do List', id: 'to-do-list' },
  { label: 'Contador de Cliques', id: 'contador-de-cliques' },
  { label: 'Jogo da Velha', id: 'jogo-da-velha' },
  { label: 'Calculadora', id: 'calculadora' },
  { label: 'Buscador de CEP', id: 'buscador-de-cep' },
];

const initialBoard = Array(9).fill(null);
const calculatorKeys = [
  '7', '8', '9', '/',
  '4', '5', '6', '*',
  '1', '2', '3', '-',
  '0', '.', '=', '+',
];

function getWinner(board) {
  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of winningLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

function ToDoList() {
  const [items, setItems] = useState([]);
  const [value, setValue] = useState('');

  function handleAddItem() {
    const nextItem = value.trim();

    if (!nextItem) {
      return;
    }

    setItems((currentItems) => [...currentItems, nextItem]);
    setValue('');
  }

  function handleRemoveItem(indexToRemove) {
    setItems((currentItems) => currentItems.filter((_, index) => index !== indexToRemove));
  }

  return (
    <section className="card feature-card" id="to-do-list">
      <div className="section-heading">
        <p className="eyebrow">1. Organização</p>
        <h2>To-Do List</h2>
      </div>

      <div className="row gap">
        <input
          className="text-input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Digite uma nova tarefa"
          aria-label="Nova tarefa"
        />
        <button className="primary-button" onClick={handleAddItem}>Adicionar</button>
      </div>

      <ul className="stack-list">
        {items.map((item, index) => (
          <li key={`${item}-${index}`} className="stack-item">
            <span>{item}</span>
            <button className="ghost-button" onClick={() => handleRemoveItem(index)}>Remover</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <section className="card feature-card" id="contador-de-cliques">
      <div className="section-heading">
        <p className="eyebrow">2. Estado e interação</p>
        <h2>Contador de Cliques</h2>
      </div>

      <div className="counter-panel">
        <strong className="counter-value">{count}</strong>
        <div className="row gap center">
          <button className="primary-button" onClick={() => setCount((current) => current + 1)}>Clique</button>
          <button className="ghost-button" onClick={() => setCount(0)}>Zerar</button>
        </div>
      </div>
    </section>
  );
}

function TicTacToe() {
  const [board, setBoard] = useState(initialBoard);
  const [isXNext, setIsXNext] = useState(true);

  const winner = useMemo(() => getWinner(board), [board]);
  const isDraw = !winner && board.every(Boolean);
  const status = winner ? `Vencedor: ${winner}` : isDraw ? 'Empate' : `Próximo jogador: ${isXNext ? 'X' : 'O'}`;

  function handlePlay(index) {
    if (board[index] || winner) {
      return;
    }

    const nextBoard = [...board];
    nextBoard[index] = isXNext ? 'X' : 'O';
    setBoard(nextBoard);
    setIsXNext((current) => !current);
  }

  function resetGame() {
    setBoard(initialBoard);
    setIsXNext(true);
  }

  return (
    <section className="card feature-card" id="jogo-da-velha">
      <div className="section-heading">
        <p className="eyebrow">3. Lógica de jogo</p>
        <h2>Jogo da Velha</h2>
      </div>

      <p className="status-line">{status}</p>
      <div className="tic-grid" role="grid" aria-label="Jogo da velha">
        {board.map((cell, index) => (
          <button key={index} className="tic-cell" onClick={() => handlePlay(index)}>
            {cell}
          </button>
        ))}
      </div>
      <button className="ghost-button" onClick={resetGame}>Reiniciar partida</button>
    </section>
  );
}

function Calculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');

  function calculate(nextValue) {
    if (nextValue === '=') {
      try {
        const sanitized = expression.replace(/[^-+*/().\d]/g, '');
        const output = Function(`"use strict"; return (${sanitized});`)();
        setResult(String(output));
        setExpression(String(output));
      } catch {
        setResult('Erro');
      }
      return;
    }

    const nextExpression = `${expression}${nextValue}`;
    setExpression(nextExpression);
    setResult(nextExpression);
  }

  function clearCalculator() {
    setExpression('');
    setResult('0');
  }

  return (
    <section className="card feature-card" id="calculadora">
      <div className="section-heading">
        <p className="eyebrow">4. Operações matemáticas</p>
        <h2>Calculadora</h2>
      </div>

      <div className="calculator-display">
        <span className="expression">{expression || '0'}</span>
        <strong className="result">{result}</strong>
      </div>

      <div className="calculator-grid">
        {calculatorKeys.map((key) => (
          <button
            key={key}
            className={key === '=' ? 'primary-button calculator-equals' : 'calculator-key'}
            onClick={() => calculate(key)}
          >
            {key}
          </button>
        ))}
      </div>

      <button className="ghost-button" onClick={clearCalculator}>Limpar</button>
    </section>
  );
}

function CepSearch() {
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch() {
    const onlyNumbers = cep.replace(/\D/g, '');

    if (onlyNumbers.length !== 8) {
      setAddress(null);
      setError('Digite um CEP com 8 números.');
      return;
    }

    setLoading(true);
    setError('');
    setAddress(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${onlyNumbers}/json/`);
      const data = await response.json();

      if (data.erro) {
        setError('CEP não encontrado.');
      } else {
        setAddress(data);
      }
    } catch {
      setError('Não foi possível consultar o CEP agora.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card feature-card" id="buscador-de-cep">
      <div className="section-heading">
        <p className="eyebrow">5. Consulta externa</p>
        <h2>Buscador de CEP</h2>
      </div>

      <div className="row gap">
        <input
          className="text-input"
          value={cep}
          onChange={(event) => setCep(event.target.value)}
          placeholder="00000-000"
          aria-label="CEP"
        />
        <button className="primary-button" onClick={handleSearch}>{loading ? 'Buscando...' : 'Buscar'}</button>
      </div>

      {error && <p className="error-text">{error}</p>}

      {address && (
        <div className="address-box">
          <p><strong>Logradouro:</strong> {address.logradouro}</p>
          <p><strong>Bairro:</strong> {address.bairro}</p>
          <p><strong>Cidade:</strong> {address.localidade}</p>
          <p><strong>UF:</strong> {address.uf}</p>
        </div>
      )}
    </section>
  );
}

export default function App() {
  return (
    <div className="page-shell">
      <header className="hero card">
        <div className="hero-copy">
          <p className="eyebrow">Tarefa 06</p>
          <h1>Projeto React com cinco funcionalidades interativas</h1>
          <p className="hero-text">
            Interface criada para reunir To-Do List, contador, jogo da velha, calculadora e buscador de CEP em um único projeto.
          </p>
        </div>

        <nav className="feature-nav" aria-label="Funcionalidades do projeto">
          {featureNames.map((feature) => (
            <a key={feature.id} href={`#${feature.id}`}>
              {feature.label}
            </a>
          ))}
        </nav>
      </header>

      <main className="feature-layout">
        <ToDoList />
        <Counter />
        <TicTacToe />
        <Calculator />
        <CepSearch />
      </main>
    </div>
  );
}
