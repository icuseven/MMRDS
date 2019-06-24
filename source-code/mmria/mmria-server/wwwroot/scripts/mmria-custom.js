// Helper func to help if a value is null, undefined, 0, ''(empty str), false or NaN
const isNullOrUndefined = (value) => {
  if (typeof value !== 'undefined' && value) {
      return false;
  } else {
      return true;
  }
}

function ClassNameOnLoad(element, className, delay) {
  this.element = element;
  this.className = className;
  this.delay = delay || 0;
  this.addTheClass = setTimeout(() => {
    if (!isNullOrUndefined(this.element)) {
      this.element.classList.add(this.className);
    }
  }, delay);
};

const userLogin = document.getElementById("user_login");
const fancyLogin = new ClassNameOnLoad(userLogin, "is-active", 100);
