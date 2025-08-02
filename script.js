// Get references to the display elements for expression and result
const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');

// Variables to track the current expression and number of open brackets
let expression = '';
let openBrackets = 0;

/**
 * Handles all calculator inputs—numbers, operators, brackets, clear, percent, and equals.
 * Updates display and calculator state accordingly.
 */
function handleInput(input, type) {
  if (type === 'number') {
    // Append number or decimal to the expression
    expression += input;
  } else if (type === 'operator') {
    // Map operator symbols to JS operators
    const map = { '×': '*', '÷': '/', '−': '-', '+': '+' };
    const op = map[input] || input;

    // Prevent consecutive operators (no double operators at the end)
    if (/[+\-*/]$/.test(expression)) return;
    expression += op;
  } else if (type === 'percent') {
    // Append percentage conversion (divide by 100)
    expression += '/100';
  } else if (type === 'brackets') {
    // Add or close brackets intelligently
    const lastChar = expression.slice(-1);
    if (openBrackets > 0 && (/\d|\)/.test(lastChar))) {
      expression += ')';
      openBrackets--;
    } else {
      expression += '(';
      openBrackets++;
    }
  } else if (type === 'clear') {
    // Reset everything on clear
    expression = '';
    resultEl.textContent = '0';
    openBrackets = 0;
  } else if (type === 'equals') {
    try {
      // Close all open brackets before evaluation
      expression += ')'.repeat(openBrackets);
      openBrackets = 0;

      // Use Function constructor to safely evaluate the expression
      const result = Function(`return (${expression})`)();
      resultEl.textContent = result.toLocaleString();
      expression = result.toString(); // Allow chaining calculations with result
    } catch {
      // Display error for invalid expressions
      resultEl.textContent = 'Error';
      expression = '';
    }
  }

  // Update the expression display, default to '0' if empty
  expressionEl.textContent = expression || '0';
}

// Add click event listeners to all calculator buttons
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Get action and value type from button dataset attributes
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

// Add keyboard support for calculator functions
document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (/^\d$/.test(key)) {
    // Numbers 0-9
    handleInput(key, 'number');
  } else if (key === '.') {
    // Decimal point
    handleInput('.', 'number');
  } else if (key === '+') {
    // Addition
    handleInput('+', 'operator');
  } else if (key === '-') {
    // Subtraction (use special minus sign for consistency)
    handleInput('−', 'operator');
  } else if (key === '*') {
    // Multiplication
    handleInput('×', 'operator');
  } else if (key === '/') {
    // Division
    handleInput('÷', 'operator');
  } else if (key === '%') {
    // Percent conversion
    handleInput(null, 'percent');
  } else if (key === '(' || key === ')') {
    // Bracket input (auto-manage open/close)
    handleInput(null, 'brackets'); 
  } else if (key === '=' || key === 'Enter') {
    // Evaluate expression
    handleInput(null, 'equals');
  } else if (key.toLowerCase() === 'c' || key === 'Escape') {
    // Clear expression with 'C' or 'Escape'
    handleInput(null, 'clear');
  } else if (key === 'Backspace') {
    // Backspace: remove last character and update openBrackets accordingly
    const lastChar = expression.slice(-1);
    expression = expression.slice(0, -1);
    if (lastChar === '(') openBrackets--;
    if (lastChar === ')') openBrackets++;
    expressionEl.textContent = expression || '0';
  }
});
