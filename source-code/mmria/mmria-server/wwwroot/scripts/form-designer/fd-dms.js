/**
 * DragSelect Class.
 *
 * @constructor
 * @param {Object} options - The options object.
 */
function DragSelect(options) {
  this.multiSelectKeyPressed;
  this.initialCursorPos = { x: 0, y: 0 };
  this.newCursorPos = { x: 0, y: 0 };
  this.previousCursorPos = { x: 0, y: 0 };
  this.initialScroll;
  this.selected = [];
  this._prevSelected = []; // memory to fix #9

  this._createBindings();
  this._setupOptions(options);
  this.start();
}

/**
 * Binds the `this` to the event listener functions
 */
DragSelect.prototype._createBindings = function() {
  this._startUp = this._startUp.bind(this);
  this._handleMove = this._handleMove.bind(this);
  this.reset = this.reset.bind(this);
  this._onClick = this._onClick.bind(this);
};

/**
 * Setup the options
 */
DragSelect.prototype._setupOptions = function(options) {
  this.selectedClass = options.selectedClass || 'ds-selected';
  this.hoverClass = options.hoverClass || 'ds-hover';
  this.selectorClass = options.selectorClass || 'ds-selector';
  this.selectableClass = options.selectableClass || 'ds-selectable';

  this.selectables = [];
  this._handleSelectables(this.toArray(options.selectables));

  this.multiSelectKeys = options.multiSelectKeys || [
    'ctrlKey',
    'shiftKey',
    'metaKey'
  ];
  this.multiSelectMode = options.multiSelectMode || false;
  this.autoScrollSpeed = options.autoScrollSpeed === 0 ? 0 : options.autoScrollSpeed || 1;
  this.selectCallback = options.onElementSelect || function() {};
  this.unselectCallback = options.onElementUnselect || function() {};
  this.onDragStartBegin = options.onDragStartBegin || function() {};
  this.moveStartCallback = options.onDragStart || function() {};
  this.moveCallback = options.onDragMove || function() {};
  this.callback = options.callback || function() {};
  this.area = options.area || document;
  this.customStyles = options.customStyles;

  // Area has to have a special position attribute for calculations
  if (this.area !== document) {
    var computedArea = getComputedStyle(this.area);
    var isPositioned =
      computedArea.position === 'absolute' ||
      computedArea.position === 'relative' ||
      computedArea.position === 'fixed';
    if (!isPositioned) {
      this.area.style.position = 'relative';
    }
  }

  // Selector
  this.selector = options.selector || this._createSelector();
  this.addClass(this.selector, this.selectorClass);
};

/**
 * Add/Remove Selectables also handles css classes and event listeners.
 *
 * @param {Object} selectables - selectable elements.
 * @param {Boolean} remove - if elements should be removed.
 * @param {Boolean} fromSelection - if elements should also be added/removed to the selection.
 */
DragSelect.prototype._handleSelectables = function(
  selectables,
  remove,
  fromSelection
) {
  for (var index = 0; index < selectables.length; index++) {
    var selectable = selectables[index];
    var indexOf = this.selectables.indexOf(selectable);

    if (indexOf < 0 && !remove) {
      // add

      this.addClass(selectable, this.selectableClass);
      selectable.addEventListener('click', this._onClick);
      this.selectables.push(selectable);

      // also add to current selection
      if (fromSelection && this.selected.indexOf(selectable) < 0) {
        this.addClass(selectable, this.selectedClass);
        this.selected.push(selectable);
      }
    } else if (indexOf > -1 && remove) {
      // remove

      this.removeClass(selectable, this.hoverClass);
      this.removeClass(selectable, this.selectableClass);
      selectable.removeEventListener('click', this._onClick);
      this.selectables.splice(indexOf, 1);

      // also remove from current selection
      if (fromSelection && this.selected.indexOf(selectable) > -1) {
        this.removeClass(selectable, this.selectedClass);
        this.selected.splice(this.selected.indexOf(selectable), 1);
      }
    }
  }
};

/**
 * Triggers when a node is actively selected.
 *
 * This might be an "onClick" method but it also triggers when
 * <button> nodes are pressed via the keyboard.
 * Making DragSelect accessible for everyone!
 *
 * @param {Object} selectables - selectable elements.
 * @param {Boolean} remove - if elements were removed.
 */
DragSelect.prototype._onClick = function(event) {

  if (this.mouseInteraction) {
    return;
  } // fix firefox doubleclick issue
  if (this.isRightClick(event)) {
    return;
  }

  var node = event.target;

  if (this.isMultiSelectKeyPressed(event)) {
    this._prevSelected = this.selected.slice();
  } // #9
  else {
    this._prevSelected = [];
  } // #9

  this.checkIfInsideSelection(true); // reset selection if no multiselectionkeypressed

  if (this.selectables.indexOf(node) > -1) {
    this.toggle(node);
  }

  this.reset();
};

/**
 * Create the selector node when not provided by options object.
 *
 * @return {Node}
 */
DragSelect.prototype._createSelector = function() {
  var selector = document.createElement('div');

  selector.style.position = 'absolute';
  if (!this.customStyles) {
    selector.style.background = 'rgba(0, 0, 255, 0.1)';
    selector.style.border = '1px solid rgba(0, 0, 255, 0.45)';
    selector.style.display = 'none';
    selector.style.pointerEvents = 'none'; // fix for issue #8 (ie11+)
  }

  var _area = this.area === document ? document.body : this.area;
  _area.appendChild(selector);

  return selector;
};

// Start
//////////////////////////////////////////////////////////////////////////////////////

/**
 * Starts the functionality. Automatically triggered when created.
 */
DragSelect.prototype.start = function() {

  this.area.addEventListener( 'mousedown', this._startUp );
  this.area.addEventListener( 'touchstart', this._startUp, { passive: false } );

};

/**
 * Startup when the area is clicked.
 *
 * @param {Object} event - The event object.
 */
DragSelect.prototype._startUp = function(event) {

  // touchmove handler
  if(event.type === 'touchstart')
    // Call preventDefault() to prevent double click issue, see https://github.com/ThibaultJanBeyer/DragSelect/pull/29 & https://developer.mozilla.org/vi/docs/Web/API/Touch_events/Supporting_both_TouchEvent_and_MouseEvent
    event.preventDefault();

  // callback
  this.onDragStartBegin(event);
  if (this._breaked) { return false; }

  if (this.isRightClick(event)) {
    return;
  }

  this.mouseInteraction = true;
  this.selector.style.display = 'block';

  if (this.isMultiSelectKeyPressed(event)) {
    this._prevSelected = this.selected.slice();
  } // #9
  else {
    this._prevSelected = [];
  } // #9

  // move element on location
  this._getStartingPositions(event);
  this.checkIfInsideSelection(true);

  this.selector.style.display = 'none'; // hidden unless moved, fix for issue #8

  // callback
  this.moveStartCallback(event);
  if (this._breaked) { return false; }

  // event listeners
  this.area.removeEventListener( 'mousedown', this._startUp );
  this.area.removeEventListener( 'touchstart', this._startUp, { passive: false } );
  this.area.addEventListener( 'mousemove', this._handleMove );
  this.area.addEventListener( 'touchmove', this._handleMove );
  document.addEventListener( 'mouseup', this.reset );
  document.addEventListener( 'touchend', this.reset );

};

/**
 * Check if some multiselection modifier key is pressed
 *
 * @param {Object} event - The event object.
 * @return {Boolean} this.isMultiSelectKeyPressed
 */
DragSelect.prototype.isMultiSelectKeyPressed = function(event) {
  this.multiSelectKeyPressed = false;

  if (this.multiSelectMode) {
    this.multiSelectKeyPressed = true;
  } else {
    for (var index = 0; index < this.multiSelectKeys.length; index++) {
      var mKey = this.multiSelectKeys[index];
      if (event[mKey]) {
        this.multiSelectKeyPressed = true;
      }
    }
  }

  return this.multiSelectKeyPressed;
};

/**
 * Grabs the starting position of all needed elements
 *
 * @param {Object} event - The event object.
 */
DragSelect.prototype._getStartingPositions = function(event) {
  this.initialCursorPos = this.newCursorPos = this._getCursorPos(
    event,
    this.area
  );
  this.initialScroll = this.getScroll(this.area);

  var selectorPos = {};
  selectorPos.x = this.initialCursorPos.x + this.initialScroll.x;
  selectorPos.y = this.initialCursorPos.y + this.initialScroll.y;
  selectorPos.w = 0;
  selectorPos.h = 0;
  this.updatePos(this.selector, selectorPos);
};

// Movements/Sizing of selection
//////////////////////////////////////////////////////////////////////////////////////

/**
 * Handles what happens while the mouse is moved
 *
 * @param {Object} event - The event object.
 */
DragSelect.prototype._handleMove = function(event) {
  var selectorPos = this.getPosition(event);

  // callback
  this.moveCallback(event);
  if (this._breaked) {
    return false;
  }

  this.selector.style.display = 'block'; // hidden unless moved, fix for issue #8

  // move element on location
  this.updatePos(this.selector, selectorPos);
  this.checkIfInsideSelection();

  // scroll area if area is scrollable
  this._autoScroll(event);
};

/**
 * Calculates and returns the exact x,y w,h positions of the selector element
 *
 * @param {Object} event - The event object.
 */
DragSelect.prototype.getPosition = function(event) {
  var cursorPosNew = this._getCursorPos(event, this.area);
  var scrollNew = this.getScroll(this.area);

  // save for later retrieval
  this.newCursorPos = cursorPosNew;

  // if area or document is scrolled those values have to be included aswell
  var scrollAmount = {
    x: scrollNew.x - this.initialScroll.x,
    y: scrollNew.y - this.initialScroll.y
  };

  /** check for direction
   *
   * This is quite complicated math, so also quite complicated to explain. Lemme’ try:
   *
   * Problem #1:
   * Sadly in HTML we can not have negative sizes.
   * so if we want to scale our element 10px to the right then it is easy,
   * we just have to add +10px to the width. But if we want to scale the element
   * -10px to the left then things become more complicated, we have to move
   * the element -10px to the left on the x axis and also scale the element
   * by +10px width to fake a negative sizing.
   *
   * One solution to this problem is using css-transforms scale() with
   * transform-origin of top left. BUT we can’t use this since it will size
   * everything, then when your element has a border for example, the border will
   * get inanely huge. Also transforms are not widely supported in IE.
   *
   * Example #1:
   * Unfortunately, things get even more complicated when we are inside a scrollable
   * DIV. Then, let’s say we scoll to the right by 10px and move the cursor right by 5px in our
   * checks we have to substract 10px from the initialcursor position in our check
   * (since the inital position is moved to the left by 10px) so in our example:
   * 1. cursorPosNew.x (5) > initialCursorPos.x (0) - scrollAmount.x (10) === 5 > -10 === true
   * then reset the x position to its initial position (since we might have changed that
   * position when scrolling to the left before going right) in our example:
   * 2. selectorPos.x = initialCursorPos.x (0) + initialScroll.x (0) === 0;
   * then we cann calculate the elements width, which is
   * the new cursor position minus the initial one plus the scroll amount, so in our example:
   * 3. selectorPos.w = cursorPosNew.x (5) - initialCursorPos.x (0) + scrollAmount.x (10) === 15;
   *
   * let’s say after that movement we now scroll 20px to the left and move our cursor by 30px to the left:
   * 1b. cursorPosNew.x (-30) > initialCursorPos.x (0) - scrollAmount.x (-20) === -30 > -20 === false;
   * 2b. selectorPos.x = cursorPosNew.x (-30) + scrollNew.x (-20)
   *                   === -50;  // move left position to cursor (for more info see Problem #1)
   * 3b. selectorPos.w = initialCursorPos.x (0) - cursorPosNew.x (-30) - scrollAmount.x (-20)
   *                   === 0--30--20 === 0+30+20 === 50;  // scale width to original left position (for more info see Problem #1)
   *
   * same thing has to be done for top/bottom
   *
   * I hope that makes sence, try stuff out and play around with variables to get a hang of it.
   */
  var selectorPos = {};

  // right
  if (cursorPosNew.x > this.initialCursorPos.x - scrollAmount.x) {
    // 1.
    selectorPos.x = this.initialCursorPos.x + this.initialScroll.x; // 2.
    selectorPos.w = cursorPosNew.x - this.initialCursorPos.x + scrollAmount.x; // 3.
    // left
  } else {
    // 1b.
    selectorPos.x = cursorPosNew.x + scrollNew.x; // 2b.
    selectorPos.w = this.initialCursorPos.x - cursorPosNew.x - scrollAmount.x; // 3b.
  }

  // bottom
  if (cursorPosNew.y > this.initialCursorPos.y - scrollAmount.y) {
    selectorPos.y = this.initialCursorPos.y + this.initialScroll.y;
    selectorPos.h = cursorPosNew.y - this.initialCursorPos.y + scrollAmount.y;
    // top
  } else {
    selectorPos.y = cursorPosNew.y + scrollNew.y;
    selectorPos.h = this.initialCursorPos.y - cursorPosNew.y - scrollAmount.y;
  }

  return selectorPos;
};

// Colision detection
//////////////////////////////////////////////////////////////////////////////////////

/**
 * Checks if element is inside selection and takes action based on that
 *
 * force handles first clicks and accessibility. Here is user is clicking directly onto
 * some element at start, (contrary to later hovers) we can assume that he
 * really wants to select/deselect that item.
 *
 * @param {Boolean} force – forces through.
 * @return {Boolean}
 */
DragSelect.prototype.checkIfInsideSelection = function(force) {
  var anyInside = false;
  for( var i = 0, il = this.selectables.length; i < il; i++ ) {
    var selectable = this.selectables[i];

    var scroll = this.getScroll(this.area);
    var selectionRect = {
      y: this.selector.getBoundingClientRect().top + scroll.y,
      x: this.selector.getBoundingClientRect().left + scroll.x,
      h: this.selector.offsetHeight,
      w: this.selector.offsetWidth
    };

    if( this._isElementTouching( selectable, selectionRect, scroll ) ) {
      this._handleSelection( selectable, force );
      anyInside = true;
    } else {
      this._handleUnselection( selectable, force );
    }
  }
  return anyInside;
};

/**
 * Logic when an item is selected
 *
 * @param {Node} item – selected item.
 * @param {Boolean} force – forces through.
 */
DragSelect.prototype._handleSelection = function(item, force) {
  if (this.hasClass(item, this.hoverClass) && !force) {
    return false;
  }
  var posInSelectedArray = this.selected.indexOf(item);

  if (posInSelectedArray < 0) {
    this.select(item);
  } else if (posInSelectedArray > -1 && this.multiSelectKeyPressed) {
    this.unselect(item);
  }

  this.addClass(item, this.hoverClass);
};

/**
 * Logic when an item is de-selected
 *
 * @param {Node} item – selected item.
 * @param {Boolean} force – forces through.
 */
DragSelect.prototype._handleUnselection = function(item, force) {
  if (!this.hasClass(item, this.hoverClass) && !force) {
    return false;
  }
  var posInSelectedArray = this.selected.indexOf(item);
  var isInPrevSelection = this._prevSelected.indexOf(item); // #9

  /**
   * Special algorithm for issue #9.
   * if a multiselectkey is pressed, ds 'remembers' the last selection and reverts
   * to that state if the selection is not kept, to mimic the natural OS behaviour
   * = if item was selected and is not in selection anymore, reselect it
   * = if item was not selected and is not in selection anymore, unselect it
   */
  if (posInSelectedArray > -1 && isInPrevSelection < 0) {
    this.unselect(item);
  } else if (posInSelectedArray < 0 && isInPrevSelection > -1) {
    this.select(item);
  }

  this.removeClass(item, this.hoverClass);
};

/**
 * Adds an item to the selection.
 *
 * @param {Node} item – item to select.
 * @return {Node} item
 */
DragSelect.prototype.select = function(item) {
  if (this.selected.indexOf(item) > -1) {
    return false;
  }

  this.selected.push(item);
  this.addClass(item, this.selectedClass);

  this.selectCallback(item);
  if (this._breaked) {
    return false;
  }

  return item;
};

/**
 * Removes an item from the selection.
 *
 * @param {Node} item – item to select.
 * @return {Node} item
 */
DragSelect.prototype.unselect = function(item) {
  if (this.selected.indexOf(item) < 0) {
    return false;
  }

  this.selected.splice(this.selected.indexOf(item), 1);
  this.removeClass(item, this.selectedClass);

  this.unselectCallback(item);
  if (this._breaked) {
    return false;
  }

  return item;
};

/**
 * Adds/Removes an item to the selection.
 * If it is already selected = remove, if not = add.
 *
 * @param {Node} item – item to select.
 * @return {Node} item
 */
DragSelect.prototype.toggle = function(item) {
  if (this.selected.indexOf(item) > -1) {
    this.unselect(item);
  } else {
    this.select(item);
  }

  return item;
};

/**
 * Checks if element is touched by the selector (and vice-versa)
 *
 * @param {Node} element – item.
 * @param {Object} selectionRect – Container bounds:
   Example: {
    y: this.selector.getBoundingClientRect().top + scroll.y,
    x: this.selector.getBoundingClientRect().left + scroll.x,
    h: this.selector.offsetHeight,
    w: this.selector.offsetWidth
  };
 * @param {Object} scroll – Scroll x, y values.
 * @return {Boolean}
 */
DragSelect.prototype._isElementTouching = function(
  element,
  selectionRect,
  scroll
) {
  var elementRect = {
    y: element.getBoundingClientRect().top + scroll.y,
    x: element.getBoundingClientRect().left + scroll.x,
    h: element.offsetHeight || element.getBoundingClientRect().height,
    w: element.offsetWidth || element.getBoundingClientRect().width
  };

  // Axis-Aligned Bounding Box Colision Detection.
  // Imagine following Example:
  //    b01
  // a01[1]a02
  //    b02      b11
  //          a11[2]a12
  //             b12
  // to check if those two boxes collide we do this AABB calculation:
  //& a01 < a12 (left border pos box1 smaller than right border pos box2)
  //& a02 > a11 (right border pos box1 larger than left border pos box2)
  //& b01 < b12 (top border pos box1 smaller than bottom border pos box2)
  //& b02 > b11 (bottom border pos box1 larger than top border pos box2)
  // See: https://en.wikipedia.org/wiki/Minimum_bounding_box#Axis-aligned_minimum_bounding_box and https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  if (
    selectionRect.x < elementRect.x + elementRect.w &&
    selectionRect.x + selectionRect.w > elementRect.x &&
    selectionRect.y < elementRect.y + elementRect.h &&
    selectionRect.h + selectionRect.y > elementRect.y
  ) {
    return true; // collision detected!
  } else {
    return false;
  }
};

// Autoscroll
//////////////////////////////////////////////////////////////////////////////////////

/**
 * Automatically Scroll the area by selecting
 *
 * @param {Object} event – event object.
 */
DragSelect.prototype._autoScroll = function(event) {
  var edge = this.isCursorNearEdge(event, this.area);

  var docEl = document && document.documentElement && document.documentElement.scrollTop && document.documentElement;
  var _area = this.area === document ? docEl || document.body : this.area;

  if (edge === 'top' && _area.scrollTop > 0) {
    _area.scrollTop -= 1 * this.autoScrollSpeed;
  } else if (edge === 'bottom') {
    _area.scrollTop += 1 * this.autoScrollSpeed;
  } else if (edge === 'left' && _area.scrollLeft > 0) {
    _area.scrollLeft -= 1 * this.autoScrollSpeed;
  } else if (edge === 'right') {
    _area.scrollLeft += 1 * this.autoScrollSpeed;
  }
};

/**
 * Check if the selector is near an edge of the area
 *
 * @param {Object} event – event object.
 * @param {Node} area – the area.
 * @return {String} top / bottom / left / right / false
 */
DragSelect.prototype.isCursorNearEdge = function(event, area) {
  var cursorPosition = this._getCursorPos(event, area);
  var areaRect = this.getAreaRect(area);

  var tolerance = {
    x: Math.max(areaRect.width / 10, 30),
    y: Math.max(areaRect.height / 10, 30)
  };

  if (cursorPosition.y < tolerance.y) {
    return 'top';
  } else if (areaRect.height - cursorPosition.y < tolerance.y) {
    return 'bottom';
  } else if (areaRect.width - cursorPosition.x < tolerance.x) {
    return 'right';
  } else if (cursorPosition.x < tolerance.x) {
    return 'left';
  }

  return false;
};

// Ending
//////////////////////////////////////////////////////////////////////////////////////

/**
 * Unbind functions when mouse click is released
 */
DragSelect.prototype.reset = function( event ) {

  this.previousCursorPos = this._getCursorPos( event, this.area );
  document.removeEventListener( 'mouseup', this.reset );
  document.removeEventListener( 'touchend', this.reset );
  this.area.removeEventListener( 'mousemove', this._handleMove );
  this.area.removeEventListener( 'touchmove', this._handleMove );
  this.area.addEventListener( 'mousedown', this._startUp );
  this.area.addEventListener( 'touchstart', this._startUp, { passive: false } );

  this.callback( this.selected, event );
  if( this._breaked ) { return false; }

  this.selector.style.width = '0';
  this.selector.style.height = '0';
  this.selector.style.display = 'none';

  setTimeout(
    function() {
      // debounce in order "onClick" to work
      this.mouseInteraction = false;
    }.bind(this),
    100
  );
};

/**
 * Function break: used in callbacks to stop break the code at the specific moment
 * - Event listeners and calculation will continue working
 * - Selector won’t display and will not select
 */
DragSelect.prototype.break = function() {
  this._breaked = true;
  setTimeout(
    function() {
      // debounce the break should only break once instantly after call
      this._breaked = false;
    }.bind(this),
    100
  );
};

/**
 * Complete function teardown
 */
DragSelect.prototype.stop = function() {
  this.reset();
  this.area.removeEventListener( 'mousedown', this._startUp );
  this.area.removeEventListener( 'touchstart', this._startUp, { passive: false } );
  document.removeEventListener( 'mouseup', this.reset );
  document.removeEventListener( 'touchend', this.reset );

};

// Usefull methods for user
//////////////////////////////////////////////////////////////////////////////////////

/**
 * Returns the current selected nodes
 *
 * @return {Nodes}
 */
DragSelect.prototype.getSelection = function() {
  return this.selected;
};

/**
 * Returns cursor x, y position based on event object
 * Will be relative to an area including the scroll unless advised otherwise
 *
 * @param {Object} event
 * @param {Node} _area – containing area / this.area if none / document if === false
 * @param {Node} ignoreScroll – if true, the scroll will be ignored
 * @return {Object} cursor { x/y }
 */
DragSelect.prototype.getCursorPos = function(event, _area, ignoreScroll) {
  if (!event) {
    return false;
  }

  var area = _area || (_area !== false && this.area);
  var pos = this._getCursorPos(event, area);
  var scroll = ignoreScroll ? { x: 0, y: 0 } : this.getScroll(area);

  return {
    x: pos.x + scroll.x,
    y: pos.y + scroll.y
  };
};

/**
 * Adds several items to the selection list
 * also adds the specific classes and take into account
 * all calculations.
 * Does not clear the selection, in contrary to .setSelection
 * Can add multiple nodes at once, in contrary to .select
 *
 * @param {Nodes} _nodes one or multiple nodes
 * @param {Boolean} _callback - if callback should be called
 * @param {Boolean} dontAddToSelectables - if element should not be added to the list of selectable nodes
 * @return {Array} all selected nodes
 */
DragSelect.prototype.addSelection = function(
  _nodes,
  _callback,
  dontAddToSelectables
) {
  var nodes = this.toArray(_nodes);

  for (var index = 0, il = nodes.length; index < il; index++) {
    var node = nodes[index];
    this.select(node);
  }

  if (!dontAddToSelectables) {
    this.addSelectables(nodes);
  }
  if (_callback) {
    this.callback(this.selected, false);
  }

  return this.selected;
};

/**
 * Removes specific nodes from the selection
 * Multiple nodes can be given at once, in contrary to unselect
 *
 * @param {Nodes} _nodes one or multiple nodes
 * @param {Boolean} _callback - if callback should be called
 * @param {Boolean} removeFromSelectables - if element should be removed from the list of selectable nodes
 * @return {Array} all selected nodes
 */
DragSelect.prototype.removeSelection = function(
  _nodes,
  _callback,
  removeFromSelectables
) {
  var nodes = this.toArray(_nodes);

  for (var index = 0, il = nodes.length; index < il; index++) {
    var node = nodes[index];
    this.unselect(node);
  }

  if (removeFromSelectables) {
    this.removeSelectables(nodes);
  }
  if (_callback) {
    this.callback(this.selected, false);
  }

  return this.selected;
};

/**
 * Toggles specific nodes from the selection:
 * If element is not in selection it will be added, if it is already selected, it will be removed.
 * Multiple nodes can be given at once.
 *
 * @param {Nodes} _nodes one or multiple nodes
 * @param {Boolean} _callback - if callback should be called
 * @param {Boolean} _special - if true, it also removes selected elements from possible selectable nodes & don’t add them to selectables if they are not
 * @return {Array} all selected nodes
 */
DragSelect.prototype.toggleSelection = function(_nodes, _callback, _special) {
  var nodes = this.toArray(_nodes);

  for (var index = 0, il = nodes.length; index < il; index++) {
    var node = nodes[index];

    if (this.selected.indexOf(node) < 0) {
      this.addSelection(node, _callback, _special);
    } else {
      this.removeSelection(node, _callback, _special);
    }
  }

  return this.selected;
};

/**
 * Sets the current selected nodes and optionally run the callback
 *
 * @param {Nodes} _nodes – dom nodes
 * @param {Boolean} runCallback - if callback should be called
 * @param {Boolean} dontAddToSelectables - if element should not be added to the list of selectable nodes
 * @return {Nodes}
 */
DragSelect.prototype.setSelection = function(
  _nodes,
  runCallback,
  dontAddToSelectables
) {
  this.clearSelection();
  this.addSelection(_nodes, runCallback, dontAddToSelectables);

  return this.selected;
};

/**
 * Unselect / Deselect all current selected Nodes
 *
 * @param {Boolean} runCallback - if callback should be called
 * @return {Array} this.selected, should be empty
 */
DragSelect.prototype.clearSelection = function(runCallback) {
  var selection = this.selected.slice();
  for (var index = 0, il = selection.length; index < il; index++) {
    var node = selection[index];
    this.unselect(node);
  }

  if (runCallback) {
    this.callback(this.selected, false);
  }

  return this.selected;
};

/**
 * Add nodes that can be selected.
 * The algorithm makes sure that no node is added twice
 *
 * @param {Nodes} _nodes – dom nodes
 * @param {Boolean} addToSelection – if elements should also be added to current selection
 * @return {Nodes} _nodes – the added node(s)
 */
DragSelect.prototype.addSelectables = function(_nodes, addToSelection) {
  var nodes = this.toArray(_nodes);
  this._handleSelectables(nodes, false, addToSelection);
  return _nodes;
};

/**
 * Gets all nodes that can be selected
 *
 * @return {Nodes} this.selectables
 */
DragSelect.prototype.getSelectables = function() {
  return this.selectables;
};

/**
 * Sets all elements that can be selected.
 * Removes all current selectables (& their respective classes).
 * Adds the new set to the selectables set,
 * thus replacing the original set.
 *
 * @param {Nodes} _nodes – dom nodes
 * @param {Boolean} removeFromSelection – if elements should also be removed from current selection
 * @param {Boolean} addToSelection – if elements should also be added to current selection
 * @return {Nodes} _nodes – the added node(s)
 */
DragSelect.prototype.setSelectables = function(
  _nodes,
  removeFromSelection,
  addToSelection
) {
  this.removeSelectables(this.getSelectables(), removeFromSelection);
  return this.addSelectables(_nodes, addToSelection);
};

/**
 * Remove nodes from the nodes that can be selected.
 *
 * @param {Nodes} _nodes – dom nodes
 * @param {Boolean} removeFromSelection – if elements should also be removed from current selection
 * @return {Nodes} _nodes – the removed node(s)
 */
DragSelect.prototype.removeSelectables = function(_nodes, removeFromSelection) {
  var nodes = this.toArray(_nodes);
  this._handleSelectables(nodes, true, removeFromSelection);
  return _nodes;
};

// Helpers
//////////////////////////////////////////////////////////////////////////////////////

/**
 * Based on a click event object,
 * checks if the right mouse button was pressed.
 * (found @ https://stackoverflow.com/a/2405835)
 *
 * @param {Object} event
 * @return {Boolean}
 */
DragSelect.prototype.isRightClick = function(event) {
  if (!event) {
    return false;
  }

  var isRightMB = false;

  if ('which' in event) {
    // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
    isRightMB = event.which === 3;
  } else if ('button' in event) {
    // IE, Opera
    isRightMB = event.button === 2;
  }

  return isRightMB;
};

/**
 * Adds a class to an element
 * sadly legacy phones/browsers don’t support .classlist so we use this workaround
 * all credits to http://clubmate.fi/javascript-adding-and-removing-class-names-from-elements/
 *
 * @param {Node} element
 * @param {String} classname
 * @return {Node} element
 */
DragSelect.prototype.addClass = function(element, classname) {
  if (element.classList) {
    return element.classList.add(classname);
  }

  var cn = element.getAttribute('class') || '';
  if (cn.indexOf(classname) !== -1) {
    return element;
  } // test for existance
  if (cn !== '') {
    classname = ' ' + classname;
  } // add a space if the element already has class
  element.setAttribute('class', cn + classname);
  return element;
};

/**
 * Removes a class of an element
 * sadly legacy phones/browsers don’t support .classlist so we use this workaround
 * all credits to http://clubmate.fi/javascript-adding-and-removing-class-names-from-elements/
 *
 * @param {Node} element
 * @param {String} classname
 * @return {Node} element
 */
DragSelect.prototype.removeClass = function(element, classname) {
  if (element.classList) {
    return element.classList.remove(classname);
  }

  var cn = element.getAttribute('class') || '';
  var rxp = new RegExp(classname + '\\b', 'g');
  cn = cn.replace(rxp, '');
  element.setAttribute('class', cn);
  return element;
};

/**
 * Checks if an element has a class
 * sadly legacy phones/browsers don’t support .classlist so we use this workaround
 *
 * @param {Node} element
 * @param {String} classname
 * @return {Boolean}
 */
DragSelect.prototype.hasClass = function(element, classname) {
  if (element.classList) {
    return element.classList.contains(classname);
  }

  var cn = element.getAttribute('class') || '';
  if (cn.indexOf(classname) > -1) {
    return true;
  } else {
    return false;
  }
};

/**
 * Transforms a nodelist or single node to an array
 * so user doesn’t have to care.
 *
 * @param {Node} nodes
 * @return {array}
 */
DragSelect.prototype.toArray = function(nodes) {
  if (!nodes) {
    return false;
  }
  if (!nodes.length && this.isElement(nodes)) {
    return [nodes];
  }

  var array = [];
  for (var i = nodes.length - 1; i >= 0; i--) {
    array[i] = nodes[i];
  }

  return array;
};

/**
 * Checks if a node is of type element
 * all credits to vikynandha: https://gist.github.com/vikynandha/6539809
 *
 * @param {Node} node
 * @return {Boolean}
 */
DragSelect.prototype.isElement = function(node) {
  try {
    // Using W3 DOM2 (works for FF, Opera and Chrome), also checking for SVGs
    return node instanceof HTMLElement || node instanceof SVGElement;
  } catch (e) {
    // Browsers not supporting W3 DOM2 don't have HTMLElement and
    // an exception is thrown and we end up here. Testing some
    // properties that all elements have. (works even on IE7)
    return (
      typeof node === 'object' &&
      node.nodeType === 1 &&
      typeof node.style === 'object' &&
      typeof node.ownerDocument === 'object'
    );
  }
};

/**
 * Returns cursor x, y position based on event object
 * /!\ for internal calculation reasons it does _not_ take
 * the AREA scroll into consideration unless it’s the outer Document.
 * Use the public .getCursorPos() from outside, it’s more flexible
 *
 * @param {Object} event
 * @param {Node} area – containing area / document if none
 * @return {Object} cursor X/Y
 */
DragSelect.prototype._getCursorPos = function(event, area) {
  if (!event) {
    return { x: 0, y: 0 };
  }

  // touchend has not touches. so we take the last toucb if a touchevent, we need to store the positions on the prototype
  if (event.touches && event.type !== 'touchend') {
    DragSelect.prototype.lastTouch = event
  }
  //if a touchevent, return the last touch rather than the regular event
  // we need .touches[0] from that event instead
  event = event.touches ? DragSelect.prototype.lastTouch.touches[0] : event

  var cPos = {  // event.clientX/Y fallback for <IE8
    x: event.pageX || event.clientX,
    y: event.pageY || event.clientY
  };

  var areaRect = this.getAreaRect(area || document);
  var docScroll = this.getScroll(); // needed when document is scrollable but area is not

  return {
    // if it’s constrained in an area the area should be substracted calculate
    x: cPos.x - areaRect.left - docScroll.x,
    y: cPos.y - areaRect.top - docScroll.y
  };
};

/**
 * Returns the starting/initial position of the cursor/selector
 *
 * @return {Object} initialPos.
 */
DragSelect.prototype.getInitialCursorPosition = function() {
  return this.initialCursorPos;
};

/**
 * Returns the last seen position of the cursor/selector
 *
 * @return {Object} initialPos.
 */
DragSelect.prototype.getCurrentCursorPosition = function() {
  return this.newCursorPos;
};

/**
 * Returns the previous position of the cursor/selector
 *
 * @return {Object} initialPos.
 */
DragSelect.prototype.getPreviousCursorPosition = function() {
  return this.previousCursorPos;
};

/**
 * Returns the cursor position difference between start and now
 * If usePreviousCursorDifference is passed,
 * it will output the cursor position difference between the previous selection and now
 *
 * @param {boolean} usePreviousCursorDifference
 * @return {Object} initialPos.
 */
DragSelect.prototype.getCursorPositionDifference = function(
  usePreviousCursorDifference
) {
  var posA = this.getCurrentCursorPosition();
  var posB = usePreviousCursorDifference
    ? this.getPreviousCursorPosition()
    : this.getInitialCursorPosition();

  return {
    x: posA.x - posB.x,
    y: posA.y - posB.y
  };
};

/**
 * Returns the current x, y scroll value of a container
 * If container has no scroll it will return 0
 *
 * @param {Node} area
 * @return {Object} scroll X/Y
 */
DragSelect.prototype.getScroll = function(area) {
  var body = {
    top:
      document.body.scrollTop > 0
        ? document.body.scrollTop
        : document.documentElement.scrollTop,
    left:
      document.body.scrollLeft > 0
        ? document.body.scrollLeft
        : document.documentElement.scrollLeft
  };

  var scroll = {
    // when the rectangle is bound to the document, no scroll is needed
    y: area && area.scrollTop >= 0 ? area.scrollTop : body.top,
    x: area && area.scrollLeft >= 0 ? area.scrollLeft : body.left
  };

  return scroll;
};

/**
 * Returns the top/left/bottom/right/width/height
 * values of a node. If Area is document then everything
 * except the sizes will be nulled.
 *
 * @param {Node} area
 * @return {Object}
 */
DragSelect.prototype.getAreaRect = function(area) {
  if (area === document) {
    var size = {
      y:
        area.documentElement.clientHeight > 0
          ? area.documentElement.clientHeight
          : window.innerHeight,
      x:
        area.documentElement.clientWidth > 0
          ? area.documentElement.clientWidth
          : window.innerWidth
    };
    return {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: size.x,
      height: size.y
    };
  }

  return {
    top: area.getBoundingClientRect().top,
    left: area.getBoundingClientRect().left,
    bottom: area.getBoundingClientRect().bottom,
    right: area.getBoundingClientRect().right,
    width: area.offsetWidth,
    height: area.offsetHeight
  };
};

/**
 * Updates the node style left, top, width,
 * height values accordingly.
 *
 * @param {Node} node
 * @param {Object} pos { x, y, w, h }
 *
 * @return {Node}
 */
DragSelect.prototype.updatePos = function(node, pos) {
  node.style.left = pos.x + 'px';
  node.style.top = pos.y + 'px';
  node.style.width = pos.w + 'px';
  node.style.height = pos.h + 'px';
  return node;
};

// Make exportable
//////////////////////////////////////////////////////////////////////////////////////
/* eslint-disable no-undef */

// Module exporting
if (typeof module !== 'undefined' && module !== null) {
  module.exports = DragSelect;

  // AMD Modules
} else if (
  typeof define !== 'undefined' &&
  typeof define === 'function' &&
  define
) {
  define(function() {
    return DragSelect;
  });
} else {
  window.DragSelect = DragSelect;
}
