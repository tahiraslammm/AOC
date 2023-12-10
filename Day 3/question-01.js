const fs = require('fs');

const lines = fs.readFileSync(__dirname + '/test.txt', 'utf8', (err, data) => data ? data : err).split('\n');

let sum = 0;
lines.forEach((line, lineIndex) => {
    const splitCharacters = line.match(/\d+/g);

    if (!splitCharacters) {
        return;
    }

    const numbers = splitCharacters.map(character => character.replace(/[*+$#&%/=@-]/, ''));
    const indexOfNumbersInString = [];

    for (const number of numbers) {
        const findNumber = new RegExp(`\\b${number}\\b`, 'g');
        const matches = line.match(findNumber);

        if (matches.length === 1) {
            const index = line.search(findNumber);
            indexOfNumbersInString.push({
                number,
                index
            });
        } else {
            const indexes = [];
            const matches = line.match(findNumber);

            for (let j = 0; j <= matches.length; j++) {
                const result = findNumber.exec(line);
                if (result) {
                    indexes.push(result.index);
                } else {
                    break;
                }
            }

            indexes.forEach(val => {
                indexOfNumbersInString.push({
                    number,
                    index: val
                });
            })
        }
    }

    function removeDuplicateIndexes(array) {
        const uniqueIndexes = new Set();
        const resultArray = [];

        for (const item of array) {
            if (!uniqueIndexes.has(item.index)) {
                uniqueIndexes.add(item.index);
                resultArray.push(item);
            }
        }

        return resultArray;
    }

    removeDuplicateIndexes(indexOfNumbersInString).forEach(elem => {
        const { number, index } = elem;
        const nextLine = lines.length === lineIndex ? null : lines[lineIndex + 1];
        const previousLine = lineIndex === 0 ? null : lines[lineIndex - 1];

        const left = findLeft(index, line);
        const right = findRight(number, index, line);
        const below = findBelow(number, index, line, nextLine);
        const above = findAbove(number, index, previousLine);
        const rightUpDiagonal = findRightAboveDiagonal(number, index, previousLine);
        const leftUpDiagonal = findLeftAboveDiagonal(index, previousLine);
        const rightDownDiagonal = findRightDownDiagonal(number, index, nextLine);
        const leftRightDiagonal = findLeftDownDiagonal(index, nextLine);

        if (left || right || below || above || rightUpDiagonal || leftUpDiagonal || leftRightDiagonal || rightDownDiagonal) {
            sum += +number;
        }
    })
})

console.log(sum);

function findLeft(index, line) {
    return index ? ['*', '+', '$', '#', '&', '%', '/', '=', '@', '-'].includes(line[index - 1]) : false;
}

function findRight(number, index, line) {
    return index === line.length ? false : ['*', '+', '$', '#', '&', '%', '/', '=', '@', '-'].includes(line[number.length + index]);
}

function findBelow(num, index, line, nextLine) {
    const lastIndex = index + num.length - 1;
    let characterBelow = false;
    if (nextLine) {
        for (let i = index; i <= lastIndex; i++) {
            if (['*', '+', '$', '#', '&', '%', '/', '=', '@', '-'].includes(nextLine[i])) {
                characterBelow = true;
            }
        }
    }

    return characterBelow;
}

function findAbove(num, index, nextLine) {
    const lastIndex = index + num.length - 1;
    let characterAbove = false;
    if (nextLine) for (let i = index; i <= lastIndex; i++) {
        if (['*', '+', '$', '#', '&', '%', '/', '=', '@', '-'].includes(nextLine[i])) {
            characterAbove = true;
        }
    }

    return characterAbove;
}

function findRightAboveDiagonal(num, index, previousLine) {
    return previousLine && index + num.length - 1 !== previousLine.length ? ['*', '+', '$', '#', '&', '%', '/', '=', '@', '-'].includes(previousLine[index + num.length - 1 + 1]) ? true : false : false;
}

function findLeftAboveDiagonal(index, previousLine) {
    return index && previousLine ? ['*', '+', '$', '#', '&', '%', '/', '=', '@', '-'].includes(previousLine[index - 1]) ? true : false : false;
}

function findRightDownDiagonal(num, index, nextLine) {
    return nextLine && index + num.length - 1 !== nextLine.length ? ['*', '+', '$', '#', '&', '%', '/', '=', '@', '-'].includes(nextLine[index + num.length - 1 + 1]) ? true : false : false;
}

function findLeftDownDiagonal(index, nextLine) {
    return index && nextLine ? ['*', '+', '$', '#', '&', '%', '/', '=', '@', '-'].includes(nextLine[index - 1]) ? true : false : false;
}