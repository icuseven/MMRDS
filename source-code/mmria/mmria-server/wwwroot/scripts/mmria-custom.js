// Helper func to capitalize first letter
// Grabs first letter and captilizes
function capitalizeFirstLetter(str) {
  // if str exists
  if (str) {
    // Grab first letter and upperCase it
    // Then cuts off first letter and returns the rest, then lowerCases the rest
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}

// Helper func to help if a value is null, undefined, 0, ''(empty str), false or NaN
function isNullOrUndefined(value) {
  if (typeof value !== 'undefined' && value) {
    return false;
  } else {
    return true;
  }
}

// Helper func to help if a target is null or undefined
function isTargetNullOrUndefined(tar) {
  if (tar == null) {
    return true;
  } else {
    return false;
  }
}

// Object Oriented approach on adding classes dynamically on load
function ClassNameOnDomLoad(element, className, delay) {
  this.element = element;
  this.className = className;
  this.delay = delay || 0; // if no arguments then set to 0
  this.addClassName = setTimeout(() => {
    if (!isNullOrUndefined(this.element)) {
      this.element.classList.add(this.className);
    }
  }, delay);
}

const userLogin = document.getElementById('user_login');
const fancyLogin = new ClassNameOnDomLoad(userLogin, 'is-active', 150);

/**
 * Global callback functions to handle loaders
 * - Full page loader (may be active on page load but removed after custom logic has ran/init)
 * - Content/Section loader (like above, may be active on page load but removed after custom logic has ran/init)
 * - Inline loader (next to actionable items like btn's)
 */

function init_inline_loader(callback, param1, param2) {
  const spinner = $(event.target).siblings('.spinner-inline');
  // Do stuff before callback
  spinner.addClass('spinner-active');
  // Give it .5 seconds to load
  // Will still show if content takes longer
  setTimeout(() => {
    // The callback
    callback();
    // Do stuff after callback
    spinner.removeClass('spinner-active');
  }, 500);
}

function init_small_loader(callback, param1, param2) {
  const spinner = $(event.target).siblings('.spinner-small');

  // Do stuff before callback
  spinner.addClass('spinner-active');

  // Give it .5 seconds to load
  // Will still show if content takes longer
  setTimeout(() => {
    // The callback
    callback();
    // Do stuff after callback
    spinner.removeClass('spinner-active');
  }, 500);
}

function init_content_loader(callback) {
  const spinner = $('.spinner-content');

  // Do stuff before callback
  spinner.addClass('spinner-active');

  // Give it .5 seconds to load
  // Will still show if content takes longer
  setTimeout(() => {
    // The callback
    callback();
    // Do stuff after callback
    spinner.removeClass('spinner-active');
  }, 500);
}


//Extend jQuery so it can select pseudo selectors
jQuery.extend(jQuery.expr[':'], {
  focusable: function(el, index, selector){
    return $(el).is('a, button, :input, [tabindex]');
  }
});

//When clicking on skip to * links at top of site
$('#content-link, #nav-link').on('click', (event) => {
  event.preventDefault();

  const target = $(event.target).attr('href');
  const targetElement = $(target);
  const focusableElements = targetElement.find(':focusable');

  //check if we are cases
  const isCaseForms = window.location.href.toLowerCase().indexOf('/case') !== -1 || window.location.href.toLowerCase().indexOf('/analyst-case') !== -1 || window.location.href.toLowerCase().indexOf('/de-identified') !== -1 ? true : false;

  //if we are on ANY case form (/case, /analyst, /de-identified)
  if (isCaseForms) {
    if ( $(event.target).attr('id') === 'nav-link' ) {
      let focusableElement = focusableElements.eq(0); //get the first focusable element

      focusableElement.focus(); //focus on it
    } else {
      const newTargetElement = $('#form_content_id > section:visible');
      const newFocusableElements = newTargetElement.find(':focusable');
      const newFocusableElement = newFocusableElements.eq(0);

      newFocusableElement.focus();
    }
  } else {
    let focusableElement = focusableElements.eq(0); //get the first focusable element

    focusableElement.focus(); //focus on it
  }
});