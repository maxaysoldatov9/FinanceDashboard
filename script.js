const form = document.getElementById("transactionForm");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");

const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const savingsEl = document.getElementById("savings");

const transactionList = document.getElementById("transactionList");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function saveTransactions() {
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}

function updateStats() {

    let income = 0;
    let expense = 0;

    transactions.forEach(transaction => {

        if (transaction.type === "income") {
            income += transaction.amount;
        } else {
            expense += transaction.amount;
        }

    });

    const balance = income - expense;

    balanceEl.textContent = `${balance.toLocaleString()} ₸`;
    incomeEl.textContent = `${income.toLocaleString()} ₸`;
    expenseEl.textContent = `${expense.toLocaleString()} ₸`;
    savingsEl.textContent = `${Math.max(balance, 0).toLocaleString()} ₸`;

    updateChart(income, expense);
}

function renderTransactions() {

    transactionList.innerHTML = "";

    transactions.forEach(transaction => {

        const li = document.createElement("li");

        li.className = transaction.type;

        li.innerHTML = `
            <span>${transaction.title}</span>

            <div>
                ${transaction.amount.toLocaleString()} ₸

                <button onclick="deleteTransaction(${transaction.id})">
                    ✕
                </button>
            </div>
        `;

        transactionList.appendChild(li);

    });

}

function addTransaction(e) {

    e.preventDefault();

    const title = titleInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;

    if (!title || amount <= 0) {
        return;
    }

    const transaction = {
        id: Date.now(),
        title,
        amount,
        type
    };

    transactions.push(transaction);

    saveTransactions();
    renderTransactions();
    updateStats();

    form.reset();

}

function deleteTransaction(id) {

    transactions = transactions.filter(
        transaction => transaction.id !== id
    );

    saveTransactions();
    renderTransactions();
    updateStats();

}

let chart;

function updateChart(income, expense) {

    const ctx = document
        .getElementById("financeChart")
        .getContext("2d");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Доходы", "Расходы"],
            datasets: [{
                data: [income, expense]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: "#ffffff"
                    }
                }
            }
        }
    });

}

form.addEventListener("submit", addTransaction);

renderTransactions();
updateStats();