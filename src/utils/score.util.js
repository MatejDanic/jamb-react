import { BONUS_TRIPS, BONUS_STRAIGHT_SMALL, BONUS_STRAIGHT_BIG, BONUS_FULL, BONUS_POKER, BONUS_JAMB } from "../constants/game-constants";

class ScoreUtil {
    calculateScore(dice, boxType) {
        let result;
        let diceValues = [];
        for (let key in dice) {
            diceValues.push(dice[key].value);
        }
        switch(boxType.label) {
            case "ONES":                
                /* falls through */
            case "TWOS":                
                /* falls through */
            case "THREES":                
                /* falls through */
            case "FOURS":                
                /* falls through */
            case "FIVES":                
                /* falls through */
            case "SIXES":                
                /* falls through */
                result = calculateSumByType(diceValues, boxType.id);
                break;
            case "MAX":        
                /* falls through */
            case "MIN":
                result = calculateSum(diceValues);
                break;
            case "TRIPS":
                result = calculateSumOfRepeatingValue(diceValues, 3, BONUS_TRIPS);
                break;
            case "STRAIGHT":
                result = calculateStraight(diceValues);
                break;
            case "FULL":
                result = calculateFull(diceValues, BONUS_FULL);
                break;
            case "POKER":
                result = calculateSumOfRepeatingValue(diceValues, 4, BONUS_POKER);
                break;
            case "JAMB":
                result = calculateSumOfRepeatingValue(diceValues, 5, BONUS_JAMB);
                break;
            default:
                result = 0;
        }
        return result;
    }    

    getHighScore(scores) {
        let highScore = 0;
        for (let key in scores) {
            if (scores[key].value > highScore) highScore = scores[key].value;
        }
        return highScore;
    }

    getTotalScore(scores) {
        let totalScore = 0;
        for (let key in scores) {
            totalScore += scores[key].value;
        }
        return totalScore;
    }
}

const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

function calculateSum(diceValues) {
    let sum = 0;
    sum = diceValues.reduce((a, b) => a + b, 0)
    return sum;
}

function calculateSumByType(diceValues, boxTypeId) {
    let sum = 0;
    for (let key in diceValues) {
        if (diceValues[key] === boxTypeId) {
            sum += diceValues[key];
        }
    }
    return sum;
}

function calculateSumOfRepeatingValue(diceValues, repeatNumber, bonus) {
    let sum = 0
    for (let i = 1; i <= 6; i++) {
        let count = countOccurrences(diceValues, i);
        if (count >= repeatNumber) { 
            sum = i * repeatNumber + bonus;
        }
    }
    return sum;
}

function calculateStraight(diceValues) {
    let result = 0;
    let straight = [2, 3, 4, 5];
    if (straight.every(i => diceValues.includes(i))) {
        if (diceValues.includes(1)) {
            result = BONUS_STRAIGHT_SMALL;
        } else if (diceValues.includes(6))
            result = BONUS_STRAIGHT_BIG;
    }
    return result;
}

function calculateFull(diceValues, bonus) {
    let result = 0
    let valueOfPair = 0;
    let valueOfTrips = 0;
    for (let i = 1; i <= 6; i++) {
        let count = countOccurrences(diceValues, i);
        if (count === 2) {
            valueOfPair = i * count;
        } else if (count === 3) {
            valueOfTrips = i * count;
        }
    }
    if (valueOfPair > 0 && valueOfTrips > 0) {
        result = valueOfPair + valueOfTrips + bonus;
    }
    return result;
}

export default new ScoreUtil();