document.addEventListener("DOMContentLoaded", function () {
  const display = document.getElementById("display");
  const buttons = document.querySelector(".buttons");
  const historyList = document.getElementById("history-list");

  buttons.addEventListener("click", handleButtonClick);

  let currentInput = "";
  let previousInput = "";
  let operator = "";

  const history = loadHistoryFromCookies();
  renderHistory(history);

  function handleButtonClick(event) {
    const target = event.target;
    if (target.matches("button")) {
      const value = target.textContent;
      processInput(value);
    }
  }

  function processInput(value) {
    if (isNumber(value)) {
      currentInput += value;
      updateDisplay(currentInput);
    } else if (isOperator(value)) {
      if (currentInput !== "") {
        performCalculation();
        operator = value;
        previousInput = currentInput;
        currentInput = "";
      }
    } else if (value === "=") {
      performCalculation();
      operator = "";
      previousInput = "";
      updateHistory(previousInput + operator + currentInput);
      saveHistoryToCookies(history);
    } else if (value === "C") {
      currentInput = "";
      previousInput = "";
      operator = "";
      updateDisplay(currentInput);
    }
  }

  function performCalculation() {
    const num1 = parseFloat(previousInput);
    const num2 = parseFloat(currentInput);
    if (operator === "+") {
      currentInput = (num1 + num2).toString();
    } else if (operator === "-") {
      currentInput = (num1 - num2).toString();
    } else if (operator === "*") {
      currentInput = (num1 * num2).toString();
    } else if (operator === "/") {
      currentInput = (num1 / num2).toString();
    }
    updateDisplay(currentInput);
  }

  function updateDisplay(value) {
    display.value = value;
  }

  function isNumber(value) {
    return !isNaN(value) && value !== ".";
  }

  function isOperator(value) {
    return value === "+" || value === "-" || value === "*" || value === "/";
  }

  function updateHistory(entry) {
    history.push(entry);
    renderHistory(history);
  }

  function renderHistory(historyArray) {
    historyList.innerHTML = "";
    historyArray.forEach((entry) => {
      const listItem = document.createElement("li");
      listItem.textContent = entry;
      listItem.classList.add("history-entry");
      historyList.appendChild(listItem);
    });
  }

  function saveHistoryToCookies(historyArray) {
    const historyJSON = JSON.stringify(historyArray);
    document.cookie = `calculator_history=${historyJSON}`;
  }

  function loadHistoryFromCookies() {
    const cookies = document.cookie;
    const historyCookie = cookies
      .split(";")
      .find((cookie) => cookie.trim().startsWith("calculator_history="));
    if (historyCookie) {
      const historyJSON = historyCookie.split("=")[1];
      return JSON.parse(historyJSON);
    }
    return [];
  }
});
