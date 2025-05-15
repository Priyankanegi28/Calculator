let history = [];
let currentExpression = '';
let isScientificMode = false;
let isDegreeMode = true;

const display = document.getElementById('display');
const expressionDisplay = document.getElementById('expression');
const historyList = document.getElementById('history-list');
const sidebar = document.getElementById('sidebar');
const themeIcon = document.getElementById('themeIcon');

document.addEventListener('DOMContentLoaded', function() {
    loadHistory();
    setupEventListeners();
    initializeUnitConverter();
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fromDate').value = today;
    document.getElementById('toDate').value = today;
    
    if (localStorage.getItem('theme') === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.className = 'fas fa-sun';
    }
    
    showStandardCalculator();
});

function openSidebar() {
    sidebar.style.width = '250px';
    document.addEventListener('click', closeSidebarOnClickOutside);
}

function closeSidebar() {
    sidebar.style.width = '0';
    document.removeEventListener('click', closeSidebarOnClickOutside);
}

function closeSidebarOnClickOutside(event) {
    if (!sidebar.contains(event.target) && !document.querySelector('.top-bar i').contains(event.target)) {
        closeSidebar();
    }
}

function showStandardCalculator() {
    document.getElementById('calculator-container').style.display = 'flex';
    document.getElementById('dateCalculationPage').style.display = 'none';
    document.getElementById('unitConverterPage').style.display = 'none';
    document.getElementById('scientific-buttons').style.display = 'none';
    isScientificMode = false;
    closeSidebar();
}

function showScientificCalculator() {
    document.getElementById('calculator-container').style.display = 'flex';
    document.getElementById('dateCalculationPage').style.display = 'none';
    document.getElementById('unitConverterPage').style.display = 'none';
    document.getElementById('scientific-buttons').style.display = 'flex';
    isScientificMode = true;
    closeSidebar();
}

function showDateCalculation() {
    document.getElementById('calculator-container').style.display = 'none';
    document.getElementById('dateCalculationPage').style.display = 'block';
    document.getElementById('unitConverterPage').style.display = 'none';
    updateDateDifference();
    closeSidebar();
}

function showUnitConverter() {
    document.getElementById('calculator-container').style.display = 'none';
    document.getElementById('dateCalculationPage').style.display = 'none';
    document.getElementById('unitConverterPage').style.display = 'block';
    closeSidebar();
}

function appendToDisplay(value) {
    if (display.value === 'Error' || display.value === 'Infinity') {
        clearDisplay();
    }
    display.value += value;
    currentExpression += value;
    expressionDisplay.textContent = currentExpression;
}

function clearDisplay() {
    display.value = '';
}

function clearAll() {
    clearDisplay();
    currentExpression = '';
    expressionDisplay.textContent = '';
}

function clearEntry() {
    display.value = display.value.slice(0, -1);
    currentExpression = currentExpression.slice(0, -1);
    expressionDisplay.textContent = currentExpression;
}

function backspace() {
    clearEntry();
}

function calculateResult() {
    try {
        let expression = display.value.replace(/×/g, '*');
        
        expression = expression.replace(/(\d+)%/g, function(match, p1) {
            return `(${p1}/100)`;
        });
        
        const result = eval(expression);
        
        if (isNaN(result) || !isFinite(result)) {
            throw new Error('Invalid result');
        }
        
        const formattedResult = Number.isInteger(result) ? result : parseFloat(result.toFixed(8));
        
        addToHistory(display.value, formattedResult);
        display.value = formattedResult;
        currentExpression = formattedResult.toString();
    } catch (error) {
        display.value = 'Error';
        currentExpression = '';
    }
}

function addToHistory(expression, result) {
    const historyItem = { expression, result, timestamp: new Date() };
    history.unshift(historyItem);
    
    if (history.length > 50) {
        history.pop();
    }
    
    updateHistoryDisplay();
    saveHistory();
}

function updateHistoryDisplay() {
    historyList.innerHTML = '';
    
    history.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.expression} = ${item.result}`;
        li.onclick = () => useHistoryItem(index);
        historyList.appendChild(li);
    });
}

function useHistoryItem(index) {
    const item = history[index];
    display.value = item.result;
    currentExpression = item.result.toString();
    expressionDisplay.textContent = item.expression;
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all history?')) {
        history = [];
        updateHistoryDisplay();
        saveHistory();
    }
}

function saveHistory() {
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
}

function loadHistory() {
    const savedHistory = localStorage.getItem('calculatorHistory');
    if (savedHistory) {
        history = JSON.parse(savedHistory);
        updateHistoryDisplay();
    }
}

function squareRoot() {
    const value = parseFloat(display.value);
    if (value >= 0) {
        const result = Math.sqrt(value);
        addToHistory(`√(${value})`, result);
        display.value = result;
        currentExpression = result.toString();
    } else {
        display.value = 'Error';
    }
}

function square() {
    const value = parseFloat(display.value);
    const result = value * value;
        addToHistory(`sqr(${value})`, result);
        display.value = result;
        currentExpression = result.toString();
}

function power() {
    appendToDisplay('^');
}

function reciprocal() {
    const value = parseFloat(display.value);
    if (value !== 0) {
        const result = 1 / value;
        addToHistory(`1/(${value})`, result);
        display.value = result;
        currentExpression = result.toString();
    } else {
        display.value = 'Error';
    }
}

function factorial() {
    const value = parseInt(display.value);
    if (value >= 0 && value <= 170) { 
        let result = 1;
        for (let i = 2; i <= value; i++) {
            result *= i;
        }
        addToHistory(`fact(${value})`, result);
        display.value = result;
        currentExpression = result.toString();
    } else {
        display.value = 'Error';
    }
}

function sin() {
    const value = parseFloat(display.value);
    const angle = isDegreeMode ? degreesToRadians(value) : value;
    const result = Math.sin(angle);
    addToHistory(`sin(${value}${isDegreeMode ? '°' : 'rad'})`, result);
    display.value = result;
    currentExpression = result.toString();
}

function cos() {
    const value = parseFloat(display.value);
    const angle = isDegreeMode ? degreesToRadians(value) : value;
    const result = Math.cos(angle);
    addToHistory(`cos(${value}${isDegreeMode ? '°' : 'rad'})`, result);
    display.value = result;
    currentExpression = result.toString();
}

function tan() {
    const value = parseFloat(display.value);
    const angle = isDegreeMode ? degreesToRadians(value) : value;
    const result = Math.tan(angle);
    addToHistory(`tan(${value}${isDegreeMode ? '°' : 'rad'})`, result);
    display.value = result;
    currentExpression = result.toString();
}

function log() {
    const value = parseFloat(display.value);
    if (value > 0) {
        const result = Math.log10(value);
        addToHistory(`log(${value})`, result);
        display.value = result;
        currentExpression = result.toString();
    } else {
        display.value = 'Error';
    }
}

function ln() {
    const value = parseFloat(display.value);
    if (value > 0) {
        const result = Math.log(value);
        addToHistory(`ln(${value})`, result);
        display.value = result;
        currentExpression = result.toString();
    } else {
        display.value = 'Error';
    }
}

function pi() {
    display.value = Math.PI;
    currentExpression = Math.PI.toString();
}

function e() {
    display.value = Math.E;
    currentExpression = Math.E.toString();
}

function tenPower() {
    const value = parseFloat(display.value) || 0;
    const result = Math.pow(10, value);
    addToHistory(`10^(${value})`, result);
    display.value = result;
    currentExpression = result.toString();
}

function exp() {
    const value = parseFloat(display.value) || 0;
    const result = Math.exp(value);
    addToHistory(`exp(${value})`, result);
    display.value = result;
    currentExpression = result.toString();
}

function degreesToRadians() {
    isDegreeMode = !isDegreeMode;
    const modeButton = document.getElementById('degRadBtn');
    modeButton.textContent = isDegreeMode ? 'deg' : 'rad';
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function toggleSign() {
    if (display.value.startsWith('-')) {
        display.value = display.value.substring(1);
        currentExpression = currentExpression.substring(1);
    } else if (display.value !== '') {
        display.value = '-' + display.value;
        currentExpression = '-' + currentExpression;
    }
}

function updateDateDifference() {
    const fromDate = new Date(document.getElementById("fromDate").value);
    const toDate = new Date(document.getElementById("toDate").value);

    if (isNaN(fromDate) || isNaN(toDate)) {
        document.getElementById("dateDifferenceResult").textContent = "Please select valid dates.";
        document.getElementById("weekdayResult").textContent = "";
        document.getElementById("daysUntilToday").textContent = "";
        return;
    }

    const timeDifference = toDate.getTime() - fromDate.getTime();
    const dayDifference = Math.abs(Math.floor(timeDifference / (1000 * 3600 * 24)));
    
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const fromWeekday = weekdays[fromDate.getDay()];
    const toWeekday = weekdays[toDate.getDay()];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let daysUntilToday = '';
    
    if (toDate > today) {
        const untilToday = Math.floor((toDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
        daysUntilToday = `${untilToday} day${untilToday !== 1 ? 's' : ''} from today`;
    }
    
    document.getElementById("dateDifferenceResult").textContent = 
        `Difference: ${dayDifference} day${dayDifference !== 1 ? 's' : ''}`;
    
    document.getElementById("weekdayResult").textContent = 
        `${fromDate.toLocaleDateString()} was a ${fromWeekday}, ${toDate.toLocaleDateString()} is a ${toWeekday}`;
    
    document.getElementById("daysUntilToday").textContent = daysUntilToday;
}

function initializeUnitConverter() {
    changeConverterType();
}

function changeConverterType() {
    const type = document.getElementById('converterType').value;
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';
    
    let units = [];
    let infoText = '';
    
    switch (type) {
        case 'length':
            units = ['millimeter', 'centimeter', 'meter', 'kilometer', 'inch', 'foot', 'yard', 'mile'];
            infoText = '1 inch = 2.54 cm, 1 foot = 12 inches, 1 mile = 5280 feet';
            break;
        case 'weight':
            units = ['milligram', 'gram', 'kilogram', 'ton', 'ounce', 'pound', 'stone'];
            infoText = '1 ounce ≈ 28.35 g, 1 pound = 16 ounces ≈ 453.59 g';
            break;
        case 'temperature':
            units = ['celsius', 'fahrenheit', 'kelvin'];
            infoText = '°F = °C × 9/5 + 32, K = °C + 273.15';
            break;
        case 'area':
            units = ['square millimeter', 'square centimeter', 'square meter', 'hectare', 'square kilometer', 
                    'square inch', 'square foot', 'square yard', 'acre', 'square mile'];
            infoText = '1 acre ≈ 4046.86 m², 1 hectare = 10,000 m²';
            break;
        case 'volume':
            units = ['milliliter', 'liter', 'cubic meter', 'cubic centimeter', 'cubic inch', 
                    'cubic foot', 'gallon (US)', 'gallon (UK)', 'fluid ounce (US)', 'fluid ounce (UK)'];
            infoText = '1 US gallon ≈ 3.785 liters, 1 UK gallon ≈ 4.546 liters';
            break;
        case 'time':
            units = ['nanosecond', 'microsecond', 'millisecond', 'second', 'minute', 'hour', 'day', 'week', 'month', 'year'];
            infoText = '1 minute = 60 seconds, 1 hour = 60 minutes, 1 day = 24 hours';
            break;
    }
    
    units.forEach(unit => {
        const option1 = document.createElement('option');
        option1.value = unit;
        option1.textContent = unit;
        fromUnit.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = unit;
        option2.textContent = unit;
        toUnit.appendChild(option2);
    });
    
    if (units.length > 1) {
        toUnit.selectedIndex = 1;
    }
    
    document.getElementById('converterInfo').textContent = infoText;
    convertUnits();
}

function convertUnits() {
    const type = document.getElementById('converterType').value;
    const inputValue = parseFloat(document.getElementById('converterInput').value) || 0;
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    
    let result;
    
    switch (type) {
        case 'length':
            result = convertLength(inputValue, fromUnit, toUnit);
            break;
        case 'weight':
            result = convertWeight(inputValue, fromUnit, toUnit);
            break;
        case 'temperature':
            result = convertTemperature(inputValue, fromUnit, toUnit);
            break;
        case 'area':
            result = convertArea(inputValue, fromUnit, toUnit);
            break;
        case 'volume':
            result = convertVolume(inputValue, fromUnit, toUnit);
            break;
        case 'time':
            result = convertTime(inputValue, fromUnit, toUnit);
            break;
        default:
            result = 0;
    }
    
    document.getElementById('converterOutput').value = result.toFixed(6);
}

function convertLength(value, fromUnit, toUnit) {
    const units = {
        millimeter: 1,
        centimeter: 10,
        meter: 1000,
        kilometer: 1000000,
        inch: 25.4,
        foot: 304.8,
        yard: 914.4,
        mile: 1609344
    };
    return (value * units[fromUnit]) / units[toUnit];
}

function convertWeight(value, fromUnit, toUnit) {
    const units = {
        milligram: 1,
        gram: 1000,
        kilogram: 1000000,
        ton: 1000000000,
        ounce: 28349.5,
        pound: 453592,
        stone: 6350290
    };
    return (value * units[fromUnit]) / units[toUnit];
}

function convertTemperature(value, fromUnit, toUnit) {
    let celsius;
    switch (fromUnit) {
        case 'celsius': celsius = value; break;
        case 'fahrenheit': celsius = (value - 32) * 5/9; break;
        case 'kelvin': celsius = value - 273.15; break;
    }
    switch (toUnit) {
        case 'celsius': return celsius;
        case 'fahrenheit': return celsius * 9/5 + 32;
        case 'kelvin': return celsius + 273.15;
    }
}

function convertArea(value, fromUnit, toUnit) {
    const units = {
        'square millimeter': 1,
        'square centimeter': 100,
        'square meter': 1000000,
        'hectare': 10000000000,
        'square kilometer': 1000000000000,
        'square inch': 645.16,
        'square foot': 92903,
        'square yard': 836127,
        'acre': 4046856422,
        'square mile': 2589988110336
    };
    return (value * units[fromUnit]) / units[toUnit];
}

function convertVolume(value, fromUnit, toUnit) {
    const units = {
        'milliliter': 1,
        'liter': 1000,
        'cubic meter': 1000000,
        'cubic centimeter': 1,
        'cubic inch': 16.387064,
        'cubic foot': 28316.846592,
        'gallon (US)': 3785.411784,
        'gallon (UK)': 4546.09,
        'fluid ounce (US)': 29.57353,
        'fluid ounce (UK)': 28.4130625
    };
    return (value * units[fromUnit]) / units[toUnit];
}

function convertTime(value, fromUnit, toUnit) {
    const units = {
        'nanosecond': 1,
        'microsecond': 1000,
        'millisecond': 1000000,
        'second': 1000000000,
        'minute': 60000000000,
        'hour': 3600000000000,
        'day': 86400000000000,
        'week': 604800000000000,
        'month': 2629800000000000,
        'year': 31557600000000000
    };
    return (value * units[fromUnit]) / units[toUnit];
}

function setupEventListeners() {
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        
        if (/[0-9+\-*/.%^=()]/.test(key) || 
            key === 'Enter' || key === 'Backspace' || key === 'Escape') {
            event.preventDefault();
        }
        
        if (/[0-9]/.test(key)) appendToDisplay(key);
        if (key === '+') appendToDisplay('+');
        if (key === '-') appendToDisplay('-');
        if (key === '*') appendToDisplay('×');
        if (key === '/') appendToDisplay('/');
        if (key === '%') appendToDisplay('%');
        if (key === '.') appendToDisplay('.');
        if (key === '(') appendToDisplay('(');
        if (key === ')') appendToDisplay(')');
        if (key === '^') power();
        if (key === 'Enter' || key === '=') calculateResult();
        if (key === 'Backspace') backspace();
        if (key === 'Escape') clearAll();
    });
    
    document.getElementById("fromDate").addEventListener("input", updateDateDifference);
    document.getElementById("toDate").addEventListener("input", updateDateDifference);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    if (currentTheme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        themeIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'light');
    }
}