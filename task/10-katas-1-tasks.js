
/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints(sides = ['N', 'E', 'S', 'W']) {
  let azimuth = 0;
  const step = 11.25;
  let i = 0;
  const result = [{ abbreviation: sides[0], azimuth }];
  while (i < 4) {
    const s1 = sides[i];
    const s2 = sides[i + 1];
    let num = sides[i + 2];
    const sym = 'b';
    if (!num) num = sides[0];
    [s1 + sym + s2, s1 + s1 + s2, s1 + s2 + sym + s1, s1 + s2,
      s1 + s2 + sym + s2, s2 + s1 + s2, s2 + sym + s1, s2,
      s2 + sym + num, s2 + num + s2, num + s2 + sym + s2, num + s2,
      num + s2 + sym + num, num + num + s2,
      num + sym + s2].map(abbreviation => {
      azimuth += step;
      result.push({ abbreviation, azimuth });
    });
    azimuth += step;
    if (!(azimuth === 360)) result.push({ abbreviation: num, azimuth });
    i += 2;
  }
  return result;
}


/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear 
 * at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {
  const first = [str], second = [];
  while (first.length > 0) {
    str = first.shift();
    const sym = str.match(/{([^{}]*)}/);
    if (sym) {
      for (const i of sym[1].split(',')) {
        first.push(str.replace(sym[0], i));
      }
    } else if (second.indexOf(str) < 0) {
      second.push(str);
      yield str;
    }
  }
}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient 
 * of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
  const arr = [];
  for (let i = 0; i < n; i++) arr[i] = [];
  let i = 1, j = 1;
  for (let k = 0; k < Math.pow(n, 2); k++) {
    arr[i - 1][j - 1] = k;
    if ((i + j) % 2 === 0) {
      if (j < n) j++;
      else i += 2;
      if (i > 1) i--;
    } 
    else {
      if (i < n) i++;
      else j += 2;
      if (j > 1) j--;
    }
  }
  return arr;
}


/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row 
 *  (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
  let arr = [];
  let nums = [{now: dominoes[0], end: dominoes.slice(1)}];
  while (!(nums[0].end.length === 0)) {
    arr = [];
    for(const val of nums) {
      val.end.forEach((x, i) => {
        const rest = val.end.filter((_, j) => j !== i);
        if (val.now[0] === x[1]) {
          arr.push({
            now: [val.now[1], x[0]],
            end: rest
          });
        } else if(val.now[1] === x[1]) {
          arr.push({
            now: [val.now[0], x[0]],
            end: rest
          });
        } else if (val.now[0] === x[0]) {
          arr.push({
            now: [val.now[1], x[1]],
            end: rest
          });
        } else if (val.now[1] === x[0]) {
          arr.push({
            now: [val.now[0], x[1]],
            end: rest
          });
        }
      });
    }
    if (arr.length === 0) return 0;
    nums = arr;
  }

  return true;
}


/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end 
 *     integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to 
 *     more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
  const newA = [[nums[0]]];
  nums.map((_, i) => {
    if(nums[i+1]-1 === newA[newA.length - 1][newA[newA.length - 1].length - 1]){
      newA[newA.length - 1].push(nums[i+1]);
    } 
    else newA.push([nums[i+1]]);
  });
  newA.splice(-1);
  newA.forEach((_, i) => {
    if (newA[i].length > 2) {
      newA[i] = newA[i][0] + '-' + newA[i][newA[i].length - 1];
    }
  });
  return newA.join(',');
}

module.exports = {
  createCompassPoints : createCompassPoints,
  expandBraces : expandBraces,
  getZigZagMatrix : getZigZagMatrix,
  canDominoesMakeRow : canDominoesMakeRow,
  extractRanges : extractRanges
};
