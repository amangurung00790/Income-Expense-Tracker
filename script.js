// Initialize app
let weeksData = {};
let currentWeek = "";

// Load saved data on startup
function loadFromStorage() {
  const savedData = localStorage.getItem('budgetData');
  if (savedData) weeksData = JSON.parse(savedData);
  
  const savedImage = localStorage.getItem('headerImage');
  if (savedImage) {
    document.getElementById('headerImage').src = savedImage;
  }
}

// Save data to localStorage
function saveToStorage() {
  localStorage.setItem('budgetData', JSON.stringify(weeksData));
}

// Image handling
function previewImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const headerImage = document.getElementById('headerImage');
    headerImage.src = e.target.result;
    localStorage.setItem('headerImage', e.target.result);
  };
  reader.readAsDataURL(file);
}

// Week navigation
document.getElementById('weekDate').addEventListener('change', loadWeek);

function loadWeek() {
  const dateVal = document.getElementById('weekDate').value;
  if (!dateVal) return;

  currentWeek = dateVal;
  if (!weeksData[currentWeek]) {
    weeksData[currentWeek] = {
      income: 0,
      fixedCosts: 0,
      variableExpenses: 0,
      remainingBalance: getPreviousBalance(),
      fixedExpensesList: [],
      variableExpensesList: []
    };
  }
  updateDisplay();
  saveToStorage();
}

function getPreviousBalance() {
  const weeks = Object.keys(weeksData).sort();
  return weeks.length > 0 ? weeksData[weeks[weeks.length-1]].remainingBalance : 0;
}

// Update display
function updateDisplay() {
  const data = weeksData[currentWeek];
  if (!data) return;

  document.getElementById('incomeTotal').textContent = data.income.toFixed(2);
  document.getElementById('fixedCostsTotal').textContent = data.fixedCosts.toFixed(2);
  document.getElementById('expensesTotal').textContent = data.variableExpenses.toFixed(2);
  document.getElementById('balance').textContent = data.remainingBalance.toFixed(2);

  updateList('fixedCostList', data.fixedExpensesList, (item) => 
    `${item.name}: $${item.weeklyAmount.toFixed(2)}/wk (${item.frequency})`
  );

  updateList('expenseList', data.variableExpensesList, (item) => 
    `${item.name}: $${(item.amount * item.times).toFixed(2)} (${item.times}x)`
  );
}

function updateList(listId, items, textFn) {
  const list = document.getElementById(listId);
  list.innerHTML = items.map((item, index) => `
    <li>
      <span>${textFn(item)}</span>
      <div>
        <button onclick="editItem(${index}, '${listId}')">✏️</button>
        <button onclick="deleteItem(${index}, '${listId}')">🗑️</button>
      </div>
    </li>
  `).join('');
}

// ... (keep previous code until line 90)

// Update display
function updateDisplay() {
  const data = weeksData[currentWeek];
  if (!data) return;

  // Update summary numbers
  document.getElementById('incomeTotal').textContent = data.income.toFixed(2);
  document.getElementById('fixedCostsTotal').textContent = data.fixedCosts.toFixed(2);
  document.getElementById('expensesTotal').textContent = data.variableExpenses.toFixed(2);
  document.getElementById('balance').textContent = data.remainingBalance.toFixed(2);

  // Update lists with working edit buttons
  updateList('fixedCostList', data.fixedExpensesList, (item, index) => `
    <li>
      <span>${item.name}: $${item.weeklyAmount.toFixed(2)}/wk (${item.frequency})</span>
      <div>
        <button class="icon-btn" onclick="editFixedCost(${index})">✏️</button>
        <button class="icon-btn danger" onclick="deleteItem(${index}, 'fixedCostList')">🗑️</button>
      </div>
    </li>
  `);

  updateList('expenseList', data.variableExpensesList, (item, index) => `
    <li>
      <span>${item.name}: $${(item.amount * item.times).toFixed(2)} (${item.times}x)</span>
      <div>
        <button class="icon-btn" onclick="editVariableExpense(${index})">✏️</button>
        <button class="icon-btn danger" onclick="deleteItem(${index}, 'expenseList')">🗑️</button>
      </div>
    </li>
  `);
}

// Proper edit functions
function editFixedCost(index) {
  const item = weeksData[currentWeek].fixedExpensesList[index];
  const newAmount = parseFloat(prompt('Enter new amount:', item.amount));
  if (isNaN(newAmount)) return;

  const newFrequency = prompt('Enter frequency (weekly/fortnightly/monthly):', item.frequency);
  if (!['weekly', 'fortnightly', 'monthly'].includes(newFrequency)) return;

  // Update values
  const oldWeekly = item.weeklyAmount;
  item.amount = newAmount;
  item.frequency = newFrequency;
  item.weeklyAmount = calculateWeekly(newAmount, newFrequency);

  // Update totals
  weeksData[currentWeek].fixedCosts += (item.weeklyAmount - oldWeekly);
  weeksData[currentWeek].remainingBalance += (oldWeekly - item.weeklyAmount);
  
  saveToStorage();
  updateDisplay();
}

function editVariableExpense(index) {
  const item = weeksData[currentWeek].variableExpensesList[index];
  const newAmount = parseFloat(prompt('Enter new amount per occurrence:', item.amount));
  const newTimes = parseInt(prompt('Enter new frequency (times per week):', item.times));
  
  if (isNaN(newAmount) || isNaN(newTimes)) return;

  // Update totals
  const oldTotal = item.amount * item.times;
  const newTotal = newAmount * newTimes;
  
  weeksData[currentWeek].variableExpenses += (newTotal - oldTotal);
  weeksData[currentWeek].remainingBalance += (oldTotal - newTotal);
  
  // Update item
  item.amount = newAmount;
  item.times = newTimes;
  
  saveToStorage();
  updateDisplay();
}

// Add this in the navigation section
function carryOverBalance() {
  if (!currentWeek) return;
  const previousBalance = getPreviousBalance();
  weeksData[currentWeek].remainingBalance += previousBalance;
  weeksData[currentWeek].income += previousBalance;
  saveToStorage();
  updateDisplay();
}

// Update the initialize function
document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  const today = new Date();
  const nextMonday = new Date(today.setDate(today.getDate() + (1 + 7 - today.getDay()) % 7));
  document.getElementById('weekDate').value = nextMonday.toISOString().split('T')[0];
  loadWeek();
});
