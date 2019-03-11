/**
 * Takes two strings including only letters from a to z.
 * Returns a new sorted string containing distinct letters.
 *
 * @param {string} value1
 * @param {string} value2
 * @return {string}
 *
 * @example
 *   'azy', 'bk' => 'abkyz'
 *   'zxxlal','laxk'    => 'aklxz'
 *   'abcdefghijklmnop',  'lmnopqrstuvwxyz'  => 'abcdefghijklmnopqrstuvwxyz'
 */
function distinctLettersString(value1, value2) {
  let newVal = (value1 + value2).split('');
  return newVal.filter((x,i) => (newVal.indexOf(x,i+1) === -1)).sort().join('');
}


/**
 * Takes a string with any characters.
 * Returns an object containing appearence of every distinct letters in lower case.
 *
 * @param {string} value
 * @return {Object}
 *
 * @example
 *  'Who you are, Buddy?' => { a:1, d:2, e:1, h:1, o:2, r:1, u:2, y:2 }
 *
 */

function lowerLetters(value) {
  let newObj = value.split('').filter(x => x.match(/[a-z]/));
    newObj = newObj.reduce((x, i) => x[i] == undefined? Object.assign(x, {[i]: 1}) : Object.assign(x, {[i]: x[i]+1}), {});
 return newObj; 
}


/**
 * Write a function that will convert a string into title case, given an optional
 * list of exception (minor words). The list of minor words will be given as a
 * string with each word separated by a space. Your function should ignore the
 * case of the minor words string - it should behave in the same way even if the
 * case of the minor word is changed
 *
 * @param {string} the original string to be converted
 * @param {string} list of minor words that must always be lowercase except for
 *                  the first word in the string
 * @return {string}
 *
 * @example
 *    'a clash if KINGS', 'a an the of'  =>  'A Clash of Kings'
 *    'THE WIND IN THE WILLOWS', 'The In'  => 'The Wind in the Willows'
 *    'the quick brown fox'  => 'The Quick Brown Fox'
 */

function titleCaseConvert(title, minorWords) {
  let secondWord = minorWords ? minorWords.toLowerCase().split(' ') : [];
    return title.toLowerCase().split(' ').map((x, i) => ( secondWord.includes(x) && i > 0) ? x :
      x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()).join(' ');
}

/**
 * Your job is to create a calculator which evaluates expressions in Reverse Polish
 * notation (https://en.wikipedia.org/wiki/Reverse_Polish_notation). Empty expression
 * should evaluate to 0. Expression without operation returns the last number.
 *
 * @param {string} RPN string, each number and operation separated by a space
 *
 * @return {Number}
 *
 * @example
 *  ''  =>  0  // empty expression returns 0
 *  '1 2 3'  =>  3  // expression without operation returns the last number
 *  '4 2 +'  =>  6  // 4 + 2
 *  '2 5 * 2 + 3 /'  =>  4   //  ((5 * 2) + 2) / 3
 *  '5 1 2 + 4 * + 3 -'  =>  14   // 5 + ((1 + 2) * 4) -3
 */

function calcRPN(expr) {
  if (expr == 0) return 0;
  const main = {
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
    '+': (a, b) => a + b,
    '-': (a, b) => a - b
  };
  let exprArr = expr.split(' ').map(x => isNaN(parseFloat(x)) ? x : parseFloat(x));
  if (!(/\*|\/|\+|-/).test(expr)) return exprArr[exprArr.length - 1];
  let i = 0;
  while (exprArr.length > 1) {
    if (main[exprArr[i]] !== undefined) {
      exprArr = [].concat(
        exprArr.slice(0, i - 2),
        [main[exprArr[i]](exprArr[i-2], exprArr[i-1])],
        exprArr.slice(i + 1)
      );
      i = 0;
    }
    i++;
  }
  return exprArr[0];
}



module.exports = {
  distinctLettersString,
  lowerLetters,
  titleCaseConvert,
  calcRPN
};