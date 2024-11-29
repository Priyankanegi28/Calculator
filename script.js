let history = [];

// Sidebar functionality
let isSidebarOpen = false;

function openSidebar() {
    document.getElementById('sidebar').style.width = '250px';
    isSidebarOpen = true;
    document.addEventListener('click', outsideClickListener);
}

function closeSidebar() {
    document.getElementById('sidebar').style.width = '0';
    isSidebarOpen = false;
    document.removeEventListener('click', outsideClickListener);
}

function outsideClickListener(event) {
    const sidebar = document.getElementById('sidebar');
    const sidebarButton = document.querySelector('.top-bar i');
    if (isSidebarOpen && !sidebar.contains(event.target) && event.target !== sidebarButton) {
        closeSidebar();
    }
}

// Calculator functionality
function appendToDisplay(value) {
    document.getElementById('display').value += value;
}

function clearDisplay() {
    document.getElementById('display').value = '';
}

function clearEntry() {
    const display = document.getElementById('display');
    display.value = display.value.slice(0, -1);
}

function calculateResult() {
    const display = document.getElementById('display');
    try {
        const result = eval(display.value.replace('%', '/100'));
        addToHistory(display.value, result);
        display.value = result;
    } catch (error) {
        display.value = 'Error';
    }
}

function addToHistory(expression, result) {
    const historyList = document.getElementById('history-list');
    const newHistoryItem = document.createElement('li');
    newHistoryItem.textContent = `${expression} = ${result}`;
    historyList.appendChild(newHistoryItem);
    history.push({ expression, result });
}

function clearHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    history = [];
}

function reciprocal() {
    const display = document.getElementById('display');
    const value = parseFloat(display.value);
    display.value = value !== 0 ? (1 / value).toFixed(4) : 'Error';
}

function square() {
    const display = document.getElementById('display');
    const value = parseFloat(display.value);
    display.value = (value * value).toFixed(4);
}

function squareRoot() {
    const display = document.getElementById('display');
    const value = parseFloat(display.value);
    display.value = Math.sqrt(value).toFixed(4);
}

function toggleSign() {
    const display = document.getElementById('display');
    const value = parseFloat(display.value);
    display.value = (value * -1).toFixed(4);
}

function backspace() {
    clearEntry();
}

// Keyboard functionality
document.addEventListener('keydown', function(event) {
    const key = event.key;
    const display = document.getElementById('display');

    if (!isNaN(key) || key === '.') appendToDisplay(key);
    if (key === '+') appendToDisplay('+');
    if (key === '-') appendToDisplay('-');
    if (key === '*') appendToDisplay('*');
    if (key === '/') appendToDisplay('/');
    if (key === '%') appendToDisplay('%');
    if (key === '(') appendToDisplay('(');
    if (key === ')') appendToDisplay(')');
    if (key === 'Enter' || key === '=') calculateResult();
    if (key === 'Backspace') clearEntry();
    if (key === 'Escape') clearDisplay();
});

// Date calculation
function showStandardCalculator() {
    document.getElementById('calculator-container').style.display = 'flex';
    document.getElementById('dateCalculationPage').style.display = 'none';
}

function showDateCalculation() {
    document.getElementById('dateCalculationPage').style.display = 'block';
    document.getElementById('calculator-container').style.display = 'none';
}

function updateDateDifference() {
    const fromDate = new Date(document.getElementById("fromDate").value);
    const toDate = new Date(document.getElementById("toDate").value);

    if (isNaN(fromDate) || isNaN(toDate)) {
        document.getElementById("dateDifferenceResult").textContent = "Please select valid dates.";
        return;
    }

    const timeDifference = toDate.getTime() - fromDate.getTime();
    const dayDifference = timeDifference / (1000 * 3600 * 24);
    document.getElementById("dateDifferenceResult").textContent = 
        dayDifference === 0 ? "Same dates" : `Difference: ${Math.abs(dayDifference)} days`;
}

document.getElementById("fromDate").addEventListener("input", updateDateDifference);
document.getElementById("toDate").addEventListener("input", updateDateDifference);
