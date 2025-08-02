const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');

let expression = '';
let openBrackets = 0;

function handleInput(input, type) {
  if (type === 'number') {
    expression += input;
  } else if (type === 'operator') {
    const map = { '×': '*', '÷': '/', '−': '-', '+': '+' };
    const op = map[input] || input;

    if (/[+\-*/]$/.test(expression)) return;
    expression += op;
  } else if (type === 'percent') {
    expression += '/100';
  } else if (type === 'brackets') {
    const lastChar = expression.slice(-1);
    if (openBrackets > 0 && (/\d|\)/.test(lastChar))) {
      expression += ')';
      openBrackets--;
    } else {
      expression += '(';
      openBrackets++;
    }
  } else if (type === 'clear') {
    expression = '';
    resultEl.textContent = '0';
    openBrackets = 0;
  } else if (type === 'equals') {
    try {
      expression += ')'.repeat(openBrackets);
      openBrackets = 0;

      const result = Function(`return (${expression})`)();
      resultEl.textContent = result.toLocaleString();
      expression = result.toString();
    } catch {
      resultEl.textContent = 'Error';
      expression = '';
    }
  }

  expressionEl.textContent = expression || '0';
}

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    const number = btn.dataset.number;
    const text = btn.textContent;

    if (number !== undefined) {
      handleInput(number, 'number');
    } else if (action === 'clear') {
      handleInput(null, 'clear');
    } else if (action === 'operator') {
      handleInput(text, 'operator');
    } else if (action === 'percent') {
      handleInput(null, 'percent');
    } else if (action === 'brackets') {
      handleInput(null, 'brackets');
    } else if (action === 'equals') {
      handleInput(null, 'equals');
    }
  });
});

document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (/^\d$/.test(key)) {
    handleInput(key, 'number');
  } else if (key === '.') {
    handleInput('.', 'number');
  } else if (key === '+') {
    handleInput('+', 'operator');
  } else if (key === '-') {
    handleInput('−', 'operator');
  } else if (key === '*') {
    handleInput('×', 'operator');
  } else if (key === '/') {
    handleInput('÷', 'operator');
  } else if (key === '%') {
    handleInput(null, 'percent');
  } else if (key === '(' || key === ')') {
    handleInput(null, 'brackets'); // smart toggle
  } else if (key === '=' || key === 'Enter') {
    handleInput(null, 'equals');
  } else if (key.toLowerCase() === 'c' || key === 'Escape') {
    handleInput(null, 'clear');
  } else if (key === 'Backspace') {
    const lastChar = expression.slice(-1);
    expression = expression.slice(0, -1);5
    if (lastChar === '(') openBrackets--;
    if (lastChar === ')') openBrackets++;
    expressionEl.textContent = expression || '0';
  }
});
