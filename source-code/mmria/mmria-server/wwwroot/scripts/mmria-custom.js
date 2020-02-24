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

function init_spinner_promise(type)
{
	return new Promise((resolve, error) => {
		switch (type)
		{
			case 'inline':
				const spinner = $(event.target).siblings('.spinner-inline');
				spinner.addClass('spinner-active');

				setTimeout(() => {
					if (spinner.hasClass('spinner-active'))
					{
						spinner.removeClass('spinner-active');

						resolve();
					}
					else
					{
						error('Something happened, please try again');
					}
				}, 500)
				break;
		}
	})
}
