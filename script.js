function calculateBudget() {
  const income = parseFloat(document.getElementById("income").value);
  const marital = document.getElementById("marital").value;
  const primary50 = document.getElementById("primary50").value;
  const loan = parseFloat(document.getElementById("loan").value) || 0;

  if (isNaN(income) || income <= 0) {
    alert("Please enter a valid income.");
    return;
  }

  if (loan > income) {
    alert("Loan/EMI exceeds income.");
    return;
  }

  // 1. EMI as a fixed category
  let rawExpenses = {
    "EMIs (Home + Car) / Loan/EMI": loan
  };

  // 2. Distribute remaining income among other categories
  const availableIncome = income - loan;
  let housingValue;
  if (marital === "married") {
    if (primary50 === "other") {
      housingValue = parseFloat(document.getElementById("accommodation").value) || 0;
    } else {
      housingValue = 0.3 * availableIncome;
    }
    Object.assign(rawExpenses, {
      "Housing/Stay": housingValue,
      "Long Term Investments": 0.15 * availableIncome,
      "Health Insurance": 0.03 * availableIncome,
      "Term Insurance": 0.03 * availableIncome,
      "Short Term (Debt Funds)": 0.07 * availableIncome,
      "Medium Term (Hybrid Funds)": 0.07 * availableIncome,
      "Gold": 0.02 * availableIncome,
      "Utilities": 0.03 * availableIncome,
      "Groceries": 0.07 * availableIncome,
      "Maintenance": 0.03 * availableIncome,
      "Transport": 0.05 * availableIncome,
      "Fitness & Hobbies": 0.02 * availableIncome,
      "Entertainment": 0.04 * availableIncome,
      "Discretionary": 0.02 * availableIncome,
      "Short Term Savings": 0.02 * availableIncome,
      "Emergency Fund": 0.03 * availableIncome
    });
  } else {
    const housing = primary50 === "home" ? 0.24 : 0.24; // Always 24% for singles as per table
    if (primary50 === "other") {
      housingValue = parseFloat(document.getElementById("accommodation").value) || 0;
    } else {
      housingValue = housing * availableIncome;
    }
    Object.assign(rawExpenses, {
      "Housing (Rent)": housingValue,
      "Utilities (Electricity, Water, Gas)": 0.030 * availableIncome,
      "Groceries & Supplies": 0.06 * availableIncome,
      "Domestic Help & Maintenance": 0.03 * availableIncome,
      "Transportation": 0.07 * availableIncome,
      "Fitness & Hobbies": 0.04 * availableIncome,
      "Entertainment": 0.048 * availableIncome,
      "Discretionary Expenses": 0.050 * availableIncome,
      "Short Term Savings": 0.050 * availableIncome,
      "Long Term Investments": 0.15 * availableIncome,
      "Emergency Fund": 0.060 * availableIncome
    });
  }

  // 3. Output (total will match user input)
  let total = Object.values(rawExpenses).reduce((sum, val) => sum + val, 0);
  let output = `<h3>Breakdown for ₹${income.toLocaleString()}</h3>`;
  output += `<ul>`;
  for (const [key, value] of Object.entries(rawExpenses)) {
    output += `<li><strong>${key}</strong>: ₹${value.toFixed(2).toLocaleString()}</li>`;
  }
  output += `</ul>`;
  output += `<p><strong>Total:</strong> ₹${total.toFixed(2).toLocaleString()}</p>`;

  document.getElementById("result").innerHTML = output;

  const ctx = document.getElementById('budgetChart').getContext('2d');
  if (window.myChart) window.myChart.destroy();
  window.myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(rawExpenses),
      datasets: [{
        label: 'Budget Allocation',
        data: Object.values(rawExpenses),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#A0522D', '#20B2AA',
          '#4682B4', '#8FBC8F', '#D2691E', '#708090',
          '#FFD700', '#DC143C', '#2E8B57', '#00CED1', '#B0C4DE'
        ]
      }]
    },
    options: {
      responsive: true
    }
  });
}