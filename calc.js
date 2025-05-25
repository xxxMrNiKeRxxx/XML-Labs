// Ожидаем полной загрузки DOM перед выполнением скрипта
document.addEventListener('DOMContentLoaded', function() {
    // Текущее значение на экране калькулятора
    let currentInput = '0';
    // Предыдущее введенное значение (для операций)
    let previousInput = '';
    // Текущая операция (+, -, *, /)
    let operation = null;
    // Флаг для сброса экрана после операции
    let resetScreen = false;
    // Последняя выполненная операция (для повторения)
    let lastOperation = null;
    // Последнее число в операции (для повторения)
    let lastNumber = null;
    // Флаг для повторения операции с последним числом
    let shouldRepeatWithLastNumber = false;
    // Режим физических расчетов (включен/выключен)
    let physicsMode = false;
    // Масса тела для физических расчетов
    let bodyMass = 0;
    // Накопленное значение в режиме накопления
    let accumulatedValue = 0;
    // Флаг режима накопления (включен/выключен)
    let isAccumulateMode = false;

    // Получаем элементы DOM
    const resultDisplay = document.getElementById('result');
    const instructionElement = document.getElementById('physics-instruction');
    // Устанавливаем начальное значение на экране
    resultDisplay.textContent = currentInput;

    // Массив цветов для смены фона дисплея
    const resultColors = ['#f8f9fa', '#ffeeba', '#b8daff', '#c3e6cb', '#f5c6cb'];
    // Текущий индекс цвета
    let currentColorIndex = 0;

    // Назначаем обработчики для всех цифровых кнопок
    document.querySelectorAll('[id^="btn_digit_"]').forEach(button => {
        button.addEventListener('click', function() {
            appendNumber(button.textContent);
        });
    });

    // Назначаем обработчики для остальных кнопок
    document.getElementById('btn_digit_dot').addEventListener('click', appendDecimal);
    document.getElementById('btn_triple_zero').addEventListener('click', appendTripleZero);
    document.getElementById('btn_op_clear').addEventListener('click', clear);
    document.getElementById('btn_op_back').addEventListener('click', backspace);
    document.getElementById('btn_op_plus').addEventListener('click', () => setOperation('+'));
    document.getElementById('btn_op_minus').addEventListener('click', () => setOperation('-'));
    document.getElementById('btn_op_mult').addEventListener('click', () => setOperation('*'));
    document.getElementById('btn_op_div').addEventListener('click', () => setOperation('/'));
    document.getElementById('btn_op_equal').addEventListener('click', calculate);
    document.getElementById('btn_op_sqrt').addEventListener('click', sqrt);
    document.getElementById('btn_op_square').addEventListener('click', square);
    document.getElementById('btn_op_factorial').addEventListener('click', factorial);
    document.getElementById('btn_physics').addEventListener('click', handlePhysicsCalculation);
    document.getElementById('btn_accumulate').addEventListener('click', toggleAccumulateMode);

    // Обработчик для кнопки смены цвета фона результата
    document.querySelector('.theme-button[onclick="changeResultColor()"]').addEventListener('click', changeResultColor);

    // Функция добавления цифры к текущему значению
    function appendNumber(number) {
        // Если текущее значение 0 или нужно сбросить экран
        if (currentInput === '0' || resetScreen) {
            currentInput = number;
            resetScreen = false;
        } else {
            // Иначе добавляем цифру к текущему значению
            currentInput += number;
        }
        updateDisplay();
    }

    // Функция добавления десятичной точки
    function appendDecimal() {
        if (resetScreen) {
            currentInput = '0.';
            resetScreen = false;
            return;
        }
        // Добавляем точку, если ее еще нет
        if (!currentInput.includes('.')) {
            currentInput += '.';
        }
        updateDisplay();
    }

    // Функция добавления трех нулей
    function appendTripleZero() {
        if (currentInput === '0' || resetScreen) {
            currentInput = '000';
            resetScreen = false;
        } else {
            currentInput += '000';
        }
        updateDisplay();
    }

    // Функция удаления последнего символа (backspace)
    function backspace() {
        // Если осталась одна цифра или минус и одна цифра
        if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
            currentInput = '0';
        } else {
            // Удаляем последний символ
            currentInput = currentInput.slice(0, -1);
        }
        updateDisplay();
    }

    // Функция установки операции
    function setOperation(op) {
        // Если уже есть операция - вычисляем
        if (operation !== null) calculate();
        // Сохраняем текущее значение как предыдущее
        previousInput = currentInput;
        operation = op;
        resetScreen = true;
        shouldRepeatWithLastNumber = false;
        
        // Если включен режим накопления - вычисляем накопленное значение
        if (isAccumulateMode) {
            calculateAccumulated();
        }
    }

    // Основная функция вычисления
    function calculate() {
        // Если включен режим физики - вычисляем физическую формулу
        if (physicsMode) {
            const fallHeight = parseFloat(currentInput);
            if (isNaN(fallHeight)) {
                currentInput = "Error";
                updateDisplay();
                return;
            }
            calculateMoonAngularMomentum(bodyMass, fallHeight);
            physicsMode = false;
            return;
        }

        // Если нет текущей и последней операции - выходим
        if (operation === null && lastOperation === null) return;
        
        // Если нет текущей операции, но есть последняя - используем последнюю
        if (operation === null && lastOperation !== null) {
            previousInput = currentInput;
            operation = lastOperation;
            if (shouldRepeatWithLastNumber && lastNumber !== null) {
                currentInput = lastNumber.toString();
            }
        }

        let computation;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        // Проверка на ошибки ввода
        if (isNaN(prev) || isNaN(current)) {
            currentInput = "Error";
            updateDisplay();
            return;
        }

        // Выполнение операции в зависимости от выбранного знака
        switch (operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                computation = prev / current;
                break;
            default:
                return;
        }

        // Сохраняем операцию и число для возможного повторения
        lastOperation = operation;
        if (!shouldRepeatWithLastNumber) {
            lastNumber = current;
        }
        shouldRepeatWithLastNumber = true;
        
        // Устанавливаем результат как текущее значение
        currentInput = computation.toString();
        operation = null;
        resetScreen = true;
        updateDisplay();
    }

    // Функция вычисления в режиме накопления
    function calculateAccumulated() {
        const current = parseFloat(currentInput);
        if (isNaN(current)) return;

        // В зависимости от операции либо добавляем, либо вычитаем
        accumulatedValue = operation === '+' ? 
            accumulatedValue + current : 
            accumulatedValue - current;

        currentInput = accumulatedValue.toString();
        resetScreen = true;
        updateDisplay();
    }

    // Функция переключения режима накопления
    function toggleAccumulateMode() {
        isAccumulateMode = !isAccumulateMode;
        // Устанавливаем начальное накопленное значение
        accumulatedValue = parseFloat(currentInput) || 0;
        // Меняем цвет кнопки для индикации режима
        document.getElementById('btn_accumulate').style.backgroundColor = 
            isAccumulateMode ? '#28a745' : '';
    }

    // Функция вычисления квадратного корня
    function sqrt() {
        const num = parseFloat(currentInput);
        if (num < 0) {
            currentInput = "Error";
        } else {
            currentInput = Math.sqrt(num).toString();
        }
        resetScreen = true;
        updateDisplay();
    }

    // Функция возведения в квадрат
    function square() {
        const num = parseFloat(currentInput);
        currentInput = (num * num).toString();
        resetScreen = true;
        updateDisplay();
    }

    // Функция вычисления факториала
    function factorial() {
        let num = parseInt(parseFloat(currentInput));
        if (num < 0 || num > 100) {
            currentInput = "Error";
        } else {
            let result = 1;
            for (let i = 2; i <= num; i++) {
                result *= i;
            }
            currentInput = result.toString();
        }
        resetScreen = true;
        updateDisplay();
    }

    // Функция обработки физического расчета (подготовка)
    function handlePhysicsCalculation() {
        bodyMass = parseFloat(currentInput);
        if (isNaN(bodyMass)) {
            currentInput = "Error: mass";
            updateDisplay();
            return;
        }
        
        // Активируем режим физики
        physicsMode = true;
        currentInput = '0';
        resetScreen = true;
        // Показываем инструкцию пользователю
        instructionElement.textContent = `Масса: ${bodyMass} кг. Введите высоту и нажмите "="`;
        updateDisplay();
    }

    // Функция расчета момента импульса на Луне
    function calculateMoonAngularMomentum(mass, height) {
        // Константы для расчетов
        const moonGravity = 1.62; // Ускорение свободного падения на Луне (м/с²)
        const moonRadius = 1737100; // Радиус Луны (м)
        
        // Расчет скорости при падении с высоты
        const velocity = Math.sqrt(2 * moonGravity * height);
        // Расчет момента импульса
        const angularMomentum = mass * velocity * moonRadius;
        
        // Вывод результата в экспоненциальной форме
        currentInput = angularMomentum.toExponential(4);
        resetScreen = true;
        
        // Формирование подробной информации о расчете
        instructionElement.innerHTML = `
            <div>Результат для:</div>
            <div>Масса: ${mass} кг</div>
            <div>Высота: ${height} м</div>
            <div>Скорость: ${velocity.toFixed(2)} м/с</div>
            <div>Момент импульса: ${angularMomentum.toExponential(4)} кг·м²/с</div>
        `;
        
        updateDisplay();
    }

    // Функция сброса калькулятора
    function clear() {
        currentInput = '0';
        previousInput = '';
        operation = null;
        lastOperation = null;
        lastNumber = null;
        shouldRepeatWithLastNumber = false;
        physicsMode = false;
        isAccumulateMode = false;
        instructionElement.textContent = '';
        updateDisplay();
    }

    // Функция смены цвета фона результата
    function changeResultColor() {
        currentColorIndex = (currentColorIndex + 1) % resultColors.length;
        resultDisplay.style.backgroundColor = resultColors[currentColorIndex];
    }

    // Функция обновления дисплея
    function updateDisplay() {
        resultDisplay.textContent = currentInput;
    }
});

// Функция переключения темы (светлая/темная)
function toggleTheme() {
    document.body.classList.toggle("dark-theme");
    const buttons = document.querySelectorAll('.my-btn');
    buttons.forEach(btn => {
        btn.classList.toggle("dark-theme-btn");
    });
}