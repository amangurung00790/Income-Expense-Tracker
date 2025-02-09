// Global object to store data per week
let weeksData = {};
let currentWeek = ""; // currently selected week (a date string)

// Load the selected week. If no data exists, initialize it.
function loadWeek() {
  let dateVal = document.getElementById("weekDate").value;
  if (!dateVal) {
    alert("Please select a week-ending date.");
    return;
  }
  currentWeek = dateVal;
  // Initialize week data if it doesn't exist
  if (!weeksData[currentWeek]) {
    weeksData[currentWeek] = {
      income: 0,
      fixedCosts: 0,
      variableExpenses: 0,
      remainingBalance: 0,
      fixedExpensesList: [],
      variableExpensesList: []
    };
    // Carry over remaining balance from the latest previous week if available
    let previousDate = null;
    for (let key in weeksData) {
      if (key < currentWeek) {
        if (!previousDate || key > previousDate) {
          previousDate = key;
        }
      }
    }
    if (previousDate) {
      weeksData[currentWeek].remainingBalance = weeksData[previousDate].remainingBalance;
    }
  }
  updateDisplay();
}

// Update the display with current week's data
function updateDisplay() {
  if (!currentWeek) return;
  let data = weeksData[currentWeek];
  document.getElementById("incomeTotal").innerText = data.income.toFixed(2);
  document.getElementById("fixedCostsTotal").innerText = data.fixedCosts.toFixed(2);
  document.getElementById("expensesTotal").innerText = data.variableExpenses.toFixed(2);
  document.getElementById("balance").innerText = data.remainingBalance.toFixed(2);
  document.getElementById("balance").style.color = data.remainingBalance < 0 ? "red" : "green";

  // Update fixed costs list with an Edit button for each item
  let fixedList = document.getElementById("fixedCostList");
  fixedList.innerHTML = "";
  data.fixedExpensesList.forEach((item, index) => {
    let li = document.createElement("li");
    li.innerHTML = `${item.name}: $${item.amount} (${item.frequency}) → Weekly: $${item.weeklyAmount.toFixed(2)}
      <button onclick="editFixedCost(${index})">Edit</button>`;
    fixedList.appendChild(li);
  });

  // Update variable expenses list with an Edit button for each item
  let varList = document.getElementById("expenseList");
  varList.innerHTML = "";
  data.variableExpensesList.forEach((item, index) => {
    let li = document.createElement("li");
    li.innerHTML = `${item.name}: $${item.amount} × ${item.times} = $${(item.amount * item.times).toFixed(2)}
      <button onclick="editVariableExpense(${index})">Edit</button>`;
    varList.appendChild(li);
  });
}

// Add income for the current week
function addIncome() {
  if (!currentWeek) {
    alert("Please select a week first!");
    return;
  }
  let incomeInput = document.getElementById("incomeInput").value;
  if (incomeInput) {
    let amount = parseFloat(incomeInput);
    weeksData[currentWeek].income += amount;
    // Increase the available balance by the added income
    weeksData[currentWeek].remainingBalance += amount;
    document.getElementById("incomeTotal").innerText = weeksData[currentWeek].income.toFixed(2);
    updateDisplay();
    document.getElementById("incomeInput").value = "";
  }
}

// Add a fixed cost to the current week
function addFixedCost() {
  if (!currentWeek) {
    alert("Please select a week first!");
    return;
  }
  let name = document.getElementById("fixedCostName").value;
  let amount = parseFloat(document.getElementById("fixedCostAmount").value);
  let frequency = document.getElementById("fixedCostFrequency").value;

  if (name && amount) {
    let weeklyAmount = amount;
    if (frequency === "fortnightly") {
      weeklyAmount = amount / 2;
    } else if (frequency === "monthly") {
      weeklyAmount = amount / 4;
    }
    // Add fixed expense to the list
    weeksData[currentWeek].fixedExpensesList.push({
      name: name,
      amount: amount,
      frequency: frequency,
      weeklyAmount: weeklyAmount
    });
    weeksData[currentWeek].fixedCosts += weeklyAmount;
    weeksData[currentWeek].remainingBalance -= weeklyAmount;
    updateDisplay();
    document.getElementById("fixedCostName").value = "";
    document.getElementById("fixedCostAmount").value = "";
  }
}

// Add a variable expense to the current week
function addExpense() {
  if (!currentWeek) {
    alert("Please select a week first!");
    return;
  }
  let name = document.getElementById("expenseName").value;
  let amount = parseFloat(document.getElementById("expenseAmount").value);
  let times = parseInt(document.getElementById("expenseFrequency").value);

  if (name && amount && times) {
    let totalExpense = amount * times;
    weeksData[currentWeek].variableExpensesList.push({
      name: name,
      amount: amount,
      times: times
    });
    weeksData[currentWeek].variableExpenses += totalExpense;
    weeksData[currentWeek].remainingBalance -= totalExpense;
    updateDisplay();
    document.getElementById("expenseName").value = "";
    document.getElementById("expenseAmount").value = "";
    document.getElementById("expenseFrequency").value = "";
  }
}

// Edit a fixed cost entry
function editFixedCost(index) {
  if (!currentWeek) return;
  let data = weeksData[currentWeek];
  let item = data.fixedExpensesList[index];
  let newAmount = parseFloat(prompt(`Enter new amount for ${item.name}:`, item.amount));
  if (isNaN(newAmount)) return;
  // Recalculate weekly cost based on frequency
  let oldWeeklyAmount = item.weeklyAmount;
  let newWeeklyAmount = newAmount;
  if (item.frequency === "fortnightly") {
    newWeeklyAmount = newAmount / 2;
  } else if (item.frequency === "monthly") {
    newWeeklyAmount = newAmount / 4;
  }
  // Update totals
  data.fixedCosts = data.fixedCosts - oldWeeklyAmount + newWeeklyAmount;
  data.remainingBalance = data.remainingBalance + oldWeeklyAmount - newWeeklyAmount;
  // Update item details
  item.amount = newAmount;
  item.weeklyAmount = newWeeklyAmount;
  updateDisplay();
}

// Edit a variable expense entry
function editVariableExpense(index) {
  if (!currentWeek) return;
  let data = weeksData[currentWeek];
  let item = data.variableExpensesList[index];
  let newAmount = parseFloat(prompt(`Enter new amount for ${item.name}:`, item.amount));
  if (isNaN(newAmount)) return;
  let newTimes = parseInt(prompt(`Enter new frequency (times) for ${item.name}:`, item.times));
  if (isNaN(newTimes)) return;
  let oldTotal = item.amount * item.times;
  let newTotal = newAmount * newTimes;
  data.variableExpenses = data.variableExpenses - oldTotal + newTotal;
  data.remainingBalance = data.remainingBalance + oldTotal - newTotal;
  item.amount = newAmount;
  item.times = newTimes;
  updateDisplay();
}

// Reset all stored data and clear the UI
function resetData() {
  if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
    weeksData = {};
    currentWeek = "";
    // Clear all displayed fields
    document.getElementById("incomeTotal").innerText = "0.00";
    document.getElementById("fixedCostsTotal").innerText = "0.00";
    document.getElementById("expensesTotal").innerText = "0.00";
    document.getElementById("balance").innerText = "0.00";
    document.getElementById("balance").style.color = "green";
    // Also clear the lists and reset the date picker
    document.getElementById("fixedCostList").innerHTML = "";
    document.getElementById("expenseList").innerHTML = "";
    document.getElementById("weekDate").value = "";
    alert("All data has been reset.");
  }
}
