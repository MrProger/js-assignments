
/** ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.__proto__.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
  return Object.assign(Object.create(proto), JSON.parse(json));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and
 * pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and
 * implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear
 * and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify() =>
 *    '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify() =>
 *    'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify() =>
 *      'div#main.container.draggable + table#data ~ tr:nth-of-type(even) td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const check = {
  nothing: 0,
  elem: 1,
  id: 2,
  class: 3,
  attr: 4,
  pseudoClass: 5,
  pseudoElement: 6
};

class Css {
  constructor() { 
    this._element = ''; 
    this._id = ''; 
    this._class = []; 
    this._attr = []; 
    this._pseudoClass = []; 
    this._pseudoElement = '';
    this._lastPart = check.nothing;
  }

  getElement() {
    return this._element;
  }

  id(value) {
    if(this._id.length) {
      throw Error('Element, id and pseudo-element should not'
      +' occur more then one time inside the selector');
    }

    this.checkPart(check.id);
    this._id = value;
    return this;
  }
  element(value) {
    if(this._element.length) {
      throw Error('Element, id and pseudo-element should not'
      +' occur more then one time inside the selector');
    }

    this.checkPart(check.elem);
    this._element = value;
    return this;
  }

  getId() {
    return this._id ? `#${ this._id}` : '';
  }

  class(value) {
    this.checkPart(check.class);
    this._class.push(value);
    return this;
  }

  getClass() {
    return this._class.map(_class => `.${_class}`).join('');
  }

  attr(value) {
    this.checkPart(check.attr);
    this._attr.push(value);
    return this;
  }

  getAttr() {
    return this._attr.map(_attr => `[${_attr}]`).join('');
  }

  pseudoClass(value) {
    this.checkPart(check.pseudoClass);
    this._pseudoClass.push(value);
    return this;
  }

  getPseudoClass() {
    return this._pseudoClass.map(_pseudoClass => `:${_pseudoClass}`).join('');
  }

  pseudoElement(value) {
    if(this._pseudoElement.length) {
      throw Error('Element, id and pseudo-element should not'
      +' occur more then one time inside the selector');
    }

    this.checkPart(check.pseudoElement);
    this._pseudoElement = value;
    return this;
  }

  getPseudoElement() {
    if(this._pseudoElement) return `::${this._pseudoElement}`;
    else return '';
  }

  stringify() {
    return `${this.getElement()}${this.getId()}${this.getClass()}`
    +`${this.getAttr()}${this.getPseudoClass()}${this.getPseudoElement()}`;
  }

  checkPart(currentPart) {
    if(currentPart < this._lastPart) {
      throw new Error('Selector parts should be arranged in the following'
      +' order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this._lastPart = currentPart;
  }
}

class Selectors {
  constructor() {
    this._selectors = [];
    this._combinators = [];
  }

  setSelectors(...selectors) {
    this._selectors.push(...selectors);
  }

  setCombinators(combinator) {
    this._combinators.push(` ${combinator} `);
  }

  stringify() {
    let combination = '';

    for(let i = 0; i < this._combinators.length; i++) {
      combination += this._selectors[i].stringify() + this._combinators[i] 
      + this._selectors[i + 1].stringify();
    }

    return combination;
  }
}

const cssSelectorBuilder = {

  element(value) {
    return new Css().element(value);  },

  id(value) {
    return new Css().id(value);
  },

  class(value) {
    return new Css().class(value);
  },

  attr(value) {
    return new Css().attr(value);
  },

  pseudoClass(value) {
    return new Css().pseudoClass(value);
  },

  pseudoElement(value) {
    return new Css().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    const combination = new Selectors();
    combination.setSelectors(selector1, selector2);
    combination.setCombinators(combinator);

    return combination;
  }
};

module.exports = {
  Rectangle: Rectangle,
  getJSON: getJSON,
  fromJSON: fromJSON,
  cssSelectorBuilder: cssSelectorBuilder
};
