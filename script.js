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

function updateList(listId, items, textFn) {
  const list = document.getElementById(listId);
  list.innerHTML = items.map((item, index) => textFn(item, index)).join('');
}

// Data manipulation
function addIncome() {
  const amount = parseFloat(document.getElementById('incomeInput').value);
  if (!amount) return;

  weeksData[currentWeek].income += amount;
  weeksData[currentWeek].remainingBalance += amount;
  document.getElementById('incomeInput').value = '';
  saveToStorage();
  updateDisplay();
}

function addFixedCost() {
  const name = document.getElementById('fixedCostName').value;
  const amount = parseFloat(document.getElementById('fixedCostAmount').value);
  const frequency = document.getElementById('fixedCostFrequency').value;
  
  if (!name || !amount) return;

  const weeklyAmount = calculateWeekly(amount, frequency);
  weeksData[currentWeek].fixedCosts += weeklyAmount;
  weeksData[currentWeek].remainingBalance -= weeklyAmount;
  weeksData[currentWeek].fixedExpensesList.push({ name, amount, frequency, weeklyAmount });
  
  clearInputs('fixedCostName', 'fixedCostAmount');
  saveToStorage();
  updateDisplay();
}

function addExpense() {
  const name = document.getElementById('expenseName').value;
  const amount = parseFloat(document.getElementById('expenseAmount').value);
  const times = parseInt(document.getElementById('expenseFrequency').value);
  
  if (!name || !amount || !times) return;

  const total = amount * times;
  weeksData[currentWeek].variableExpenses += total;
  weeksData[currentWeek].remainingBalance -= total;
  weeksData[currentWeek].variableExpensesList.push({ name, amount, times });
  
  clearInputs('expenseName', 'expenseAmount', 'expenseFrequency');
  saveToStorage();
  updateDisplay();
}

// Edit functions
function editFixedCost(index) {
  const item = weeksData[currentWeek].fixedExpensesList[index];
  const newAmount = parseFloat(prompt('Enter new amount:', item.amount));
  if (isNaN(newAmount)) return;

  const newFrequency = prompt('Enter frequency (weekly/fortnightly/monthly):', item.frequency);
  if (!['weekly', 'fortnightly', 'monthly'].includes(newFrequency)) return;

  const oldWeekly = item.weeklyAmount;
  item.amount = newAmount;
  item.frequency = newFrequency;
  item.weeklyAmount = calculateWeekly(newAmount, newFrequency);

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

  const oldTotal = item.amount * item.times;
  const newTotal = newAmount * newTimes;
  
  weeksData[currentWeek].variableExpenses += (newTotal - oldTotal);
  weeksData[currentWeek].remainingBalance += (oldTotal - newTotal);
  
  item.amount = newAmount;
  item.times = newTimes;
  
  saveToStorage();
  updateDisplay();
}

// Helper functions
function calculateWeekly(amount, frequency) {
  return {
    weekly: amount,
    fortnightly: amount / 2,
    monthly: amount / 4
  }[frequency];
}

function clearInputs(...ids) {
  ids.forEach(id => document.getElementById(id).value = '');
}

// Navigation
function previousWeek() {
  navigateWeek(-7);
}

function nextWeek() {
  navigateWeek(7);
}

function navigateWeek(days) {
  if (!currentWeek) return;
  
  const newDate = new Date(currentWeek);
  newDate.setDate(newDate.getDate() + days);
  document.getElementById('weekDate').value = newDate.toISOString().split('T')[0];
  loadWeek();
}

function carryOverBalance() {
  if (!currentWeek) return;
  const previousBalance = getPreviousBalance();
  weeksData[currentWeek].remainingBalance += previousBalance;
  weeksData[currentWeek].income += previousBalance;
  saveToStorage();
  updateDisplay();
}

// Delete items
function deleteItem(index, listType) {
  const data = weeksData[currentWeek];
  const list = listType === 'fixedCostList' ? data.fixedExpensesList : data.variableExpensesList;
  const item = list[index];
  
  if (listType
