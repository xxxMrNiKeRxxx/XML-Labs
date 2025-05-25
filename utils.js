// Задание 1.8 - Среднее арифметическое
export function calculateAverage(arr) {
    if (!arr.length) return 0;
    const sum = arr.reduce((acc, val) => acc + val, 0);
    return (sum / arr.length).toFixed(2);
}

// Задание 1.3 - Сумма квадратов
export function sumOfSquares(arr) {
    return arr.reduce((acc, val) => acc + val * val, 0);
}

// Максимальная последовательность 1
export function maxConsecutiveOnes(str) {
    return Math.max(...str.split('0').map(s => s.length));
}

// Задание 3.4 - Сортировка слов
export function sortLettersAndWords(sentence) {
    return sentence
        .split(' ')
        .map(word => {
            const sorted = word.toLowerCase().split('').sort().join('');
            return sorted.charAt(0).toUpperCase() + sorted.slice(1);
        })
        .sort()
        .join(' ');
}

// Задание 3.5 - Группировка анаграмм
export function groupAnagrams(words) {
    const groups = {};
    
    words.forEach(word => {
        const key = word.toLowerCase().split('').sort().join('');
        if (!groups[key]) groups[key] = [];
        groups[key].push(word);
    });
    
    return Object.values(groups)
        .filter(group => group.length >= 2)
        .map(group => group.sort())
        .sort();
}

// Задание 3.6 - RLE сжатие
export function rleCompress(str) {
    if (!str) return '';
    
    let result = '';
    let count = 1;  
    
    for (let i = 1; i <= str.length; i++) {
        if (i < str.length && str[i] === str[i-1]) {
            count++;
        } else {
            result += str[i-1] + (count > 1 ? count : '');
            count = 1;
        }
    }
    
    return result;
}