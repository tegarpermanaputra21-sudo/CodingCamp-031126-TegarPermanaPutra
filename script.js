let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const balanceEl = document.getElementById("balance");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeSelect = document.getElementById("type");
const addBtn = document.getElementById("add-transaction");
const historyList = document.getElementById("history-list");
const chartCtx = document.getElementById("chart").getContext("2d");

let myChart;

function initChart() {
  myChart = new Chart(chartCtx, {
    type: "pie",
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: ["#000000", "#444444", "#888888", "#cccccc"],
          borderColor: "#ffffff",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            font: {
              family: "'Roboto Mono', monospace",
              size: 11,
            },
            color: "#000000",
          },
        },
      },
    },
  });
}

function updateUI() {
  localStorage.setItem("transactions", JSON.stringify(transactions));

  const total = transactions.reduce((acc, item) => acc + item.amount, 0);
  balanceEl.textContent = `$${total.toFixed(2)}`;

  historyList.innerHTML = "";
  if (transactions.length === 0) {
    historyList.innerHTML = `
      <li class="history-item" style="border:none; justify-content:center; color:#888; font-size:0.75rem;">
        NO TRANSACTIONS YET
      </li>`;
  } else {
    transactions.forEach((item) => {
      const li = document.createElement("li");
      li.classList.add("history-item");
      li.innerHTML = `
        <div class="item-info">
          <span class="item-name">${item.name}</span>
          <span class="item-amount">$${item.amount.toFixed(2)}</span>
          <span class="item-badge">${item.category}</span>
        </div>
        <button class="btn-delete" onclick="deleteTransaction(${item.id})">Delete</button>
      `;
      historyList.appendChild(li);
    });
  }

  const categoryTotals = {};
  transactions.forEach((item) => {
    const cat = item.category.toUpperCase();
    categoryTotals[cat] = (categoryTotals[cat] || 0) + item.amount;
  });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  if (labels.length === 0) {
    myChart.data.labels = ["NO DATA"];
    myChart.data.datasets[0].data = [1];
    myChart.data.datasets[0].backgroundColor = ["#e5e5e5"];
  } else {
    myChart.data.labels = labels;
    myChart.data.datasets[0].data = data;
    myChart.data.datasets[0].backgroundColor = [
      "#000000",
      "#444444",
      "#888888",
      "#cccccc",
    ];
  }
  myChart.update();
}

function addTransaction() {
  const name = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = typeSelect.value;

  if (name === "" || isNaN(amount) || amount <= 0) {
    alert("Harap masukkan nama item dan jumlah nominal yang valid!");
    return;
  }

  const newTransaction = {
    id: Date.now(),
    name: name,
    amount: amount,
    category: category,
  };

  transactions.push(newTransaction);
  updateUI();

  descriptionInput.value = "";
  amountInput.value = "";
  descriptionInput.focus();
}

window.deleteTransaction = function (id) {
  transactions = transactions.filter((item) => item.id !== id);
  updateUI();
};

addBtn.addEventListener("click", addTransaction);

[descriptionInput, amountInput].forEach((input) => {
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTransaction();
    }
  });
});

initChart();
updateUI();
