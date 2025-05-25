import { 
    maxConsecutiveOnes,
    sortLettersAndWords,
    groupAnagrams,
    rleCompress
} from "../../../utils.js";

export class UtilsPage {
    constructor(parent) {
        this.parent = parent;
    }

    render() {
        this.parent.innerHTML = `
            <div class="utils-container">
                <h2>Аниме-утилиты</h2>
                
                <div class="util-section">
                    <h3>Максимальная последовательность 1</h3>
                    <input type="text" id="binary-input" placeholder="Введите последовательность 0 и 1">
                    <button id="calculate-ones">Вычислить</button>
                    <p id="ones-result"></p>
                </div>
                
                <div class="util-section">
                    <h3>Сортировка слов</h3>
                    <textarea id="sentence-input" placeholder="Введите предложение"></textarea>
                    <button id="sort-sentence">Сортировать</button>
                    <p id="sort-result"></p>
                </div>
                
                <div class="util-section">
                    <h3>Группировка анаграмм</h3>
                    <textarea id="anagrams-input" placeholder="Введите слова через запятую"></textarea>
                    <button id="group-anagrams">Группировать</button>
                    <pre id="anagrams-result"></pre>
                </div>
                
                <div class="util-section">
                    <h3>RLE сжатие</h3>
                    <input type="text" id="rle-input" placeholder="Введите строку">
                    <button id="compress-rle">Сжать</button>
                    <p id="rle-result"></p>
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('calculate-ones').addEventListener('click', () => {
            const input = document.getElementById('binary-input').value;
            const result = maxConsecutiveOnes(input);
            document.getElementById('ones-result').textContent = `Результат: ${result}`;
        });

        document.getElementById('sort-sentence').addEventListener('click', () => {
            const input = document.getElementById('sentence-input').value;
            const result = sortLettersAndWords(input);
            document.getElementById('sort-result').textContent = `Результат: ${result}`;
        });

        document.getElementById('group-anagrams').addEventListener('click', () => {
            const input = document.getElementById('anagrams-input').value;
            const words = input.split(',').map(w => w.trim());
            const result = groupAnagrams(words);
            document.getElementById('anagrams-result').textContent = JSON.stringify(result, null, 2);
        });

        document.getElementById('compress-rle').addEventListener('click', () => {
            const input = document.getElementById('rle-input').value;
            const result = rleCompress(input);
            document.getElementById('rle-result').textContent = `Результат: ${result}`;
        });
    }
}