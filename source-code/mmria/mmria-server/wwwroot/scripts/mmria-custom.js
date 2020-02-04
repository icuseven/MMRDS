// Helper func to help if a value is null, undefined, 0, ''(empty str), false or NaN
const isNullOrUndefined = (value) => {
  if (typeof value !== 'undefined' && value) {
      return false;
  } else {
      return true;
  }
}

// Object Oriented approach on adding classes dynamically on load
function ClassNameOnDomLoad(element, className, delay)
{
  this.element = element;
  this.className = className;
  this.delay = delay || 0; // if no arguments then set to 0
  this.addClassName = setTimeout(() => {
    if (!isNullOrUndefined(this.element)) {
      this.element.classList.add(this.className);
    }
  }, delay);
};

const userLogin = document.getElementById("user_login");
const fancyLogin = new ClassNameOnDomLoad(userLogin, "is-active", 150);



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

function init_content_loader(callback) {
  // const spinner = $(container).find('.spinner-content');
  
  // // Do stuff before callback
  // spinner.addClass('spinner-active');
    
    
  // // Give it .5 seconds to load
  // // Will still show if content takes longer
  // setTimeout(() => {
  //   // The callback
  //   callback();
  //   // Do stuff after callback
  //   spinner.removeClass('spinner-active');
  // }, 500);
  console.log('A');
  callback();
  console.log('B');
}
