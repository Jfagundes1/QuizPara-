

const questions = [
  { q: "Qual é a capital do estado do Pará?", options: ["Belém", "Santarém", "Marabá", "Altamira"], answer: 0 },
  { q: "Qual é o rio mais importante que corta o estado do Pará?", options: ["Rio Tocantins", "Rio Amazonas", "Rio Negro", "Rio Tapajós"], answer: 1 },
  { q: "Qual é o principal prato típico do Pará?", options: ["Tapioca", "Açaí com peixe e farinha", "Feijoada", "Cuscuz"], answer: 1 },
  { q: "Como é chamado o maior festival religioso do Pará?", options: ["Círio de Nazaré", "Festa do Divino", "Carnaval de Belém", "Procissão do Norte"], answer: 0 },
  { q: "Qual bioma cobre a maior parte do território paraense?", options: ["Cerrado", "Pantanal", "Mata Atlântica", "Amazônia"], answer: 3 },
  { q: "Qual fruta é símbolo da culinária e cultura paraense?", options: ["Cupuaçu", "Açaí", "Graviola", "Castanha-do-pará"], answer: 1 },
  { q: "Qual importante ferrovia liga o Pará ao Maranhão?", options: ["Ferrovia Norte-Sul", "Ferrovia Carajás", "Ferrovia Transamazônica", "Ferrovia Tocantins"], answer: 1 },
  { q: "Qual cidade paraense é conhecida como 'Pérola do Tapajós'?", options: ["Belém", "Santarém", "Castanhal", "Paragominas"], answer: 1 },
  { q: "Em que ano o Pará foi oficialmente criado como província do Brasil?", options: ["1616", "1823", "1750", "1889"], answer: 1 },
  { q: "Qual importante ilha pertence ao estado do Pará?", options: ["Ilha de Marajó", "Ilha de Fernando de Noronha", "Ilha do Bananal", "Ilha Grande"], answer: 0 },
  { q: "Qual destas danças é tradicional do Pará?", options: ["Carimbó", "Frevo", "Maracatu", "Bumba-meu-boi"], answer: 0 },
  { q: "O Pará faz fronteira com qual destes estados?", options: ["São Paulo", "Pernambuco", "Roraima", "Maranhão"], answer: 3 },
  { q: "Qual é o principal porto do Pará, importante para a exportação de minérios?", options: ["Porto de Itaqui", "Porto de Vila do Conde", "Porto de Santos", "Porto de Santarém"], answer: 1 },
  { q: "Qual destes produtos é uma grande riqueza mineral do Pará?", options: ["Carvão", "Petróleo", "Minério de ferro", "Ouro branco"], answer: 2 },
  { q: "Qual é o gentilício de quem nasce no Pará?", options: ["Parense", "Paraense", "Paráense", "Paranoense"], answer: 1 }
];

const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const usernameInput = document.getElementById('username');
const quizScreen = document.getElementById('quiz-screen');
const questionText = document.getElementById('question-text');
const optionsList = document.getElementById('options');
const currentIndexEl = document.getElementById('current-index');
const totalQuestionsEl = document.getElementById('total-questions');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const resultScreen = document.getElementById('result-screen');
const resultName = document.getElementById('result-name');
const correctCountEl = document.getElementById('correct-count');
const wrongCountEl = document.getElementById('wrong-count');
const percentEl = document.getElementById('percent');
const performanceMsg = document.getElementById('performance-message');
const restartBtn = document.getElementById('restart-btn');
const downloadBtn = document.getElementById('download-btn');
const ctx = document.getElementById('result-chart').getContext('2d');

let currentIndex = 0;
const total = questions.length;
let answers = new Array(total).fill(null);
let chartInstance = null;

totalQuestionsEl.textContent = total;


startBtn.addEventListener('click', () => {
  const name = usernameInput.value.trim();
  if (!name) return alert("Digite seu nome para começar!");
  startScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  renderQuestion();
});


function renderQuestion() {
  const q = questions[currentIndex];
  currentIndexEl.textContent = currentIndex + 1;
  questionText.textContent = q.q;
  optionsList.innerHTML = '';

  q.options.forEach((opt, i) => {
    const letter = String.fromCharCode(65 + i); // A, B, C, D
    const li = document.createElement('li');
    li.className = 'option';
    li.dataset.index = i;
    li.innerHTML = `
      <span class="radio"></span>
      <span class="letter">${letter})</span>
      <span class="option-text">${opt}</span>
    `;
    if (answers[currentIndex] === i) li.classList.add('selected');
    li.addEventListener('click', () => selectOption(i));
    optionsList.appendChild(li);
  });

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = answers[currentIndex] === null;
  nextBtn.textContent = currentIndex === total - 1 ? 'Finalizar' : 'Próxima';
}


function selectOption(i) {
  answers[currentIndex] = i;
  document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
  document.querySelector(`.option[data-index="${i}"]`).classList.add('selected');
  nextBtn.disabled = false;
}


prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
});
nextBtn.addEventListener('click', () => {
  if (answers[currentIndex] === null) return alert('Selecione uma opção!');
  if (currentIndex < total - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    finishQuiz();
  }
});


function finishQuiz() {
  const name = usernameInput.value.trim();
  let correct = 0;
  answers.forEach((a, i) => { if (a === questions[i].answer) correct++; });
  const wrong = total - correct;
  const percent = Math.round((correct / total) * 100);

  resultName.textContent = name;
  correctCountEl.textContent = correct;
  wrongCountEl.textContent = wrong;
  percentEl.textContent = percent + '%';

  performanceMsg.className = 'performance';
  if (percent >= 80) { performanceMsg.textContent = 'Excelente!'; performanceMsg.classList.add('excel'); }
  else if (percent >= 50) { performanceMsg.textContent = 'Bom desempenho'; performanceMsg.classList.add('bom'); }
  else { performanceMsg.textContent = 'Precisa melhorar'; performanceMsg.classList.add('frac'); }

  quizScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');
  renderChart(correct, wrong);
}


function renderChart(correct, wrong) {
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Acertos', 'Erros'],
      datasets: [{
        data: [correct, wrong],
        backgroundColor: ['#10b981', '#ef4444']
      }]
    }
  });
}


restartBtn.addEventListener('click', () => {
  answers.fill(null);
  currentIndex = 0;
  resultScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  renderQuestion();
});


downloadBtn.addEventListener('click', () => {
  const name = usernameInput.value.trim() || 'Participante';
  const correct = parseInt(correctCountEl.textContent);
  const wrong = parseInt(wrongCountEl.textContent);
  const percent = percentEl.textContent;

  const text = [
    `Resultado do Quiz - ${name}`,
    `Data: ${new Date().toLocaleString()}`,
    `Acertos: ${correct}`,
    `Erros: ${wrong}`,
    `Percentual: ${percent}`,
    '',
    'Gabarito:',
    ...questions.map((q, i) => `${i + 1}. ${q.q} - ${q.options[q.answer]}`)
  ].join('\n');

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `resultado_quiz_para_${name.replace(/\s+/g, '_')}.txt`;
  a.click();
  URL.revokeObjectURL(url);
});
