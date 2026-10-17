const display = document.getElementById('display');
const message = document.getElementById('message');
let expression = '';

function render() {
  display.value = expression || '0';
}

function calculate() {
  if (!expression.trim()) return;
  // Only allow calculator characters; never evaluate arbitrary user input.
  if (!/^[0-9+\-×÷().\s]+$/.test(expression)) {
    message.textContent = 'عبارت نامعتبر است.';
    return;
  }
  const normalized = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
  if (!/^[0-9+\-*/().\s]+$/.test(normalized)) {
    message.textContent = 'عبارت نامعتبر است.';
    return;
  }
  try {
    const result = Function('"use strict"; return (' + normalized + ')')();
    if (typeof result !== 'number' || !Number.isFinite(result)) throw new Error('invalid');
    expression = String(Number(result.toPrecision(12)));
    message.textContent = '';
    render();
  } catch {
    message.textContent = 'محاسبه ممکن نیست؛ عبارت را بررسی کنید.';
  }
}

document.querySelector('.keys').addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  const action = button.dataset.action;
  message.textContent = '';
  if (action === 'clear') expression = '';
  else if (action === 'delete') expression = expression.slice(0, -1);
  else if (action === 'calculate') return calculate();
  else {
    const value = button.dataset.value;
    if (value) expression += value;
  }
  render();
});

document.addEventListener('keydown', (event) => {
  if (/^[0-9().]$/.test(event.key)) expression += event.key;
  else if (event.key === '+') expression += '+';
  else if (event.key === '-') expression += '−';
  else if (event.key === '*') expression += '×';
  else if (event.key === '/') { event.preventDefault(); expression += '÷'; }
  else if (event.key === 'Enter' || event.key === '=') { event.preventDefault(); calculate(); return; }
  else if (event.key === 'Backspace') expression = expression.slice(0, -1);
  else if (event.key === 'Escape') expression = '';
  else return;
  message.textContent = '';
  render();
});
