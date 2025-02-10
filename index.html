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

// Edit/Delete items
function editItem(index, listType) {
  // Implementation for edit (similar to previous but enhanced)
  // Add proper edit modals/inputs as needed
}

function deleteItem(index, listType) {
  const data = weeksData[currentWeek];
  const list = listType === 'fixedCostList' ? data.fixedExpensesList : data.variableExpensesList;
  const item = list[index];
  
  if (listType === 'fixedCostList') {
    data.fixedCosts -= item.weeklyAmount;
    data.remainingBalance += item.weeklyAmount;
  } else {
    data.variableExpenses -= item.amount * item.times;
    data.remainingBalance += item.amount * item.times;
  }
  
  list.splice(index, 1);
  saveToStorage();
  updateDisplay();
}

// Reset data
function resetData() {
  if (confirm('Are you sure you want to reset ALL data?')) {
    weeksData = {};
    localStorage.removeItem('budgetData');
    localStorage.removeItem('headerImage');
    location.reload();
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  document.getElementById('weekDate').value = new Date().toISOString().split('T')[0];
  loadWeek();
});
