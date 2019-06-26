// Helper func to help if a value is null, undefined, 0, ''(empty str), false or NaN
const isNullOrUndefined = (value) => {
  if (typeof value !== 'undefined' && value) {
      return false;
  } else {
      return true;
  }
}

// Object Oriented approach on adding classes dynamically on load
function ClassNameOnLoad(element, className, delay) {
  this.element = element;
  this.className = className;
  this.delay = delay || 0;
  this.addClassName = setTimeout(() => {
    if (!isNullOrUndefined(this.element)) {
      this.element.classList.add(this.className);
    }
  }, delay);
};

const userLogin = document.getElementById("user_login");
const fancyLogin = new ClassNameOnLoad(userLogin, "is-active", 100);
