
/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist
 * in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account
 * that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it
 * into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
  const nums = bankAccount.split('\n');
  let elem = 0, res = 0;
  for(let i = 0; i < 27; i+=3){
    if(nums[0][i+1] === ' ' && nums[1][i+1] === '_') elem = '4';
    else if(nums[0][i+1] === ' ' && nums[1][i+1] === ' ') elem = '1';
    else if(nums[1][i+1] === ' ' && nums[2][i] === '|')  elem = '0';
    else if(nums[1][i] === ' ' && nums[2][i+2] === ' ') elem = '2';
    else if(nums[1][i] === ' ' && nums[2][i] === ' ' 
    && nums[2][i+1] === '_') elem = '3';
    else if(nums[1][i+2] === ' ' && nums[2][i] === ' ') elem = '5';
    else if(nums[0][i+1] === '_' && nums[2][i+1] === ' ') elem = '7';
    else if(nums[1][i+2] === ' ' && nums[2][i] === '|') elem = '6';
    else if(nums[1][i] === '|' && nums[1][i+2] === '|' 
    && nums[2][i] === ' ') elem = '9';
    else elem = '8';
    res += elem;
  }
  return +res;
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make
 * sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>
 *      'The String global object',
 *      'is a constructor for',
 *      'strings, or a sequence of',
 *      'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>
 *      'The String',
 *      'global',
 *      'object is a',
 *      'constructor',
 *      'for strings,',
 *      'or a',
 *      'sequence of',
 *      'characters.'
 */
function* wrapText(text, columns) {
  const arr = text.split(' ');
  let str = arr[0], i = 1;
  while(i < arr.length){
    if(str.length + arr[i].length + 1 > columns) {
      yield str;
      str = arr[i];
    }
    else{
      str += ' ' + arr[i];
    }
    i++;
  }
  yield str;
  return 0;
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
  StraightFlush: 8,
  FourOfKind: 7,
  FullHouse: 6,
  Flush: 5,
  Straight: 4,
  ThreeOfKind: 3,
  TwoPairs: 2,
  OnePair: 1,
  HighCard: 0
};

function getPokerHandRank(hand) {
  const toGet = function(hand) {
    const srt = 'A234567891JQKA',
      suits = [], ranks = {
        count: [],
        val: [],
        sort: []
      };
    for (const i of hand) {
      if (ranks.val.indexOf(i[0]) < 0) {
        ranks.val.push(i[0]);
        ranks.count.push(1);
      } else ranks.count[ranks.val.indexOf(i[0])]++;
      if (suits.indexOf(i.slice(-1)) < 0) suits.push(i.slice(-1));
    }
    ranks.sort = ranks.val.sort(
      (a, b) => srt.indexOf(a) - srt.indexOf(b)
    );
    if (ranks.sort[0] === 'A' && ranks.sort[1] !== '2') {
      ranks.sort.splice(0, 1);
      ranks.sort.push('A');
    }
    this.num = function(n) {
      let res = 0;
      for (const i of ranks.count) if (i === n) res++;
      return res;
    };
    this.flush = function() {
      return suits.length === 1;
    };
    this.straight = function() {
      if (ranks.sort.length < 5) return 0;
      for (let i = 1; i < 5; i++) {
        if(srt.indexOf(ranks.sort[i - 1]) + 1 !== srt.indexOf(ranks.sort[i]) &&
          srt.indexOf(ranks.sort[i - 1]) + 1 !== srt.lastIndexOf(ranks.sort[i])
        ) return 0;
      }
      return 1;
    };
  };
  const nextHand = new toGet(hand);
  if (nextHand.flush() && nextHand.straight()) return PokerRank.StraightFlush;
  else if (nextHand.num(4)) return PokerRank.FourOfKind;
  else if (nextHand.num(3) && nextHand.num(2)) return PokerRank.FullHouse;
  else if (nextHand.flush()) return PokerRank.Flush;
  else if (nextHand.straight()) return PokerRank.Straight;
  else if (nextHand.num(3)) return PokerRank.ThreeOfKind;
  else if (nextHand.num(2) === 2) return PokerRank.TwoPairs;
  else if (nextHand.num(2)) return PokerRank.OnePair;
  else return PokerRank.HighCard;
}


/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +,
 * vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 *
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 *
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+        '+------------+\n'+
 *    '|            |\n'+        '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+   =>   '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+        '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'         '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
  const arr = figure.split('\n');
  const func = function(row, col, dRow, dCol, str) {
    if (dRow) {
      for (let i = row + dRow; i < arr.length && i >= 0; i += dRow) {
        if ( arr[i][col] === '+' &&
          (arr[i][col - dRow] === '+' || arr[i][col - dRow] === str)
        ) return i;
        else if (arr[i][col] === ' ') return 0;
      }
    }
    if (dCol && arr[row + dCol]) {
      for (let i = col + dCol; i < arr[row].length && i >= 0; i += dCol) {
        if (arr[row][i] === '+' &&
        (arr[row + dCol][i] === '+' || arr[row + dCol][i] === str))return i;
        else if (arr[row][i] === ' ') return 0;
      }
    }
    return 0;
  };

  function rectangle(row, col) {
    let _col, _row;
    _col = func(row, col, 0, 1, '|');
    if (_col === false) return 0;
    _row = func(row, _col, 1, 0, '-');
    if (_row === false) return 0;
    const resultCol = _col;
    const resultRow = _row;
    _col = func(_row, _col, 0, -1, '|');
    if (_col === false) return 0;
    _row = func(_row, _col, -1, 0, '-');
    if (_row === false) return 0;
    if (_row === row && _col === col) {
      return {
        width: resultCol - col + 1,
        height: resultRow - row + 1
      };
    } else return 0;
  }

  function next(obj) {
    var line = '+' + '-'.repeat(obj.width - 2) + '+\n',
      result = line;
    result += ('|' + ' '.repeat(obj.width - 2) + '|\n').repeat(obj.height - 2);
    return result + line;
  }

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if ( arr[i][j] === '+' && arr[i + 1] &&
        (arr[i + 1][j] === '|' || arr[i + 1][j] === '+') &&
        (arr[i][j + 1] === '-' || arr[i][j + 1] === '+')
      ) { const obj = rectangle(i, j);
        if (obj) yield next(obj);
      }
    }
  }
}


module.exports = {
  parseBankAccount: parseBankAccount,
  wrapText: wrapText,
  PokerRank: PokerRank,
  getPokerHandRank: getPokerHandRank,
  getFigureRectangles: getFigureRectangles
};
