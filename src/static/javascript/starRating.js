starRating = (options) => {

  var showToolTip = true;

  if (typeof options.showToolTip !== "undefined") {
    showToolTip = !!options.showToolTip;
  }


  var elem = options.element;
  var stars = options.max || 5;
  var starSize = options.starSize || 16;
  var step = options.step || 1;
  var onHover = options.onHover;
  var onLeave = options.onLeave;
  var disabled = options.disabled;
  var rating = null;
  var myRating;

  //styling

  elem.classList.add("star-rating");
  var div = document.createElement("div");
  div.classList.add("star-value");
  div.style.backgroundSize = starSize + "px";
  elem.appendChild(div);
  elem.style.width = starSize * stars + "px";
  elem.style.height = starSize + "px";
  elem.style.backgroundSize = starSize + "px";


  var callback = options.rateCallback;
  var isRating = false;
  var isBusyText = options.isBusyText;
  var currentRating;

  if (options.rating) {
    setRating(options.rating);
  } else {
    var dataRating = elem.dataset.rating;

    if (dataRating) {
      setRating(+dataRating);
    }
  }


  if (!rating) {
    elem.querySelector(".star-value").style.width = "0px";
  }

  function onMouseMove(e) {
    onMove(e, false);
  }

  function onMove(e, isTouch) {
    if (isRating === true) {
      return;
    }

    var xCoor = null;
    var percent;
    var width = elem.offsetWidth;
    var parentOffset = elem.getBoundingClientRect();

    if (isTouch) {
      xCoor = e.changedTouches[0].pageX - parentOffset.left;
    } else {
      xCoor = e.offsetX;
    }

    percent = xCoor / width * 100;

    if (percent < 101) {
      if (step === 1) {
        currentRating = Math.ceil(percent / 100 * stars);
      } else {
        var rat = percent / 100 * stars;

        for (var i = 0;; i += step) {
          if (i >= rat) {
            currentRating = i;
            break;
          }
        }
      } //todo: check why this happens and fix


      if (currentRating > stars) {
        currentRating = stars;
      }

      elem.querySelector(".star-value").style.width = currentRating / stars * 100 + "%";

      if (typeof onHover === "function") {
        onHover(currentRating, rating);
      }
    }
  }

  function onStarOut(e) {
    if (!rating) {
      elem.querySelector(".star-value").style.width = "0%";
      elem.removeAttribute("data-rating");
    } else {
      elem.querySelector(".star-value").style.width = rating / stars * 100 + "%";
      elem.setAttribute("data-rating", rating);
    }

    if (typeof onLeave === "function") {
      onLeave(currentRating, rating);
    }
  }

  function onStarClick(e) {

    if (isRating === true) {
      return;
    }

    if (typeof callback !== "undefined") {
      isRating = true;
      myRating = currentRating;

      if (typeof isBusyText === "undefined") {
        elem.removeAttribute("title");
      } else {
        elem.setAttribute("title", isBusyText);
      }

      elem.classList.add("is-busy");
      callback.call(this, myRating, function () {

        isRating = false;
        elem.classList.remove("is-busy");
      });
    }
  }

  function setRating(value) {
    if (typeof value === "undefined") {
      throw new Error("Value not set.");
    }

    if (value === null) {
      throw new Error("Value cannot be null.");
    }

    if (typeof value !== "number") {
      throw new Error("Value must be a number.");
    }

    if (value < 0 || value > stars) {
      throw new Error("Value too high. Please set a rating of " + stars + " or below.");
    }

    rating = value;
    elem.querySelector(".star-value").style.width = value / stars * 100 + "%";
    elem.setAttribute("data-rating", value);
  }

  function getRating() {
    return rating;
  }

  function clear() {
    rating = null;
    elem.querySelector(".star-value").style.width = "0px";
    elem.removeAttribute("title");
  }

  function dispose() {
    elem.removeEventListener("mousemove", onMouseMove);
    elem.removeEventListener("mouseleave", onStarOut);
    elem.removeEventListener("click", onStarClick);
    elem.removeEventListener("touchmove", handleMove, false);
    elem.removeEventListener("touchstart", handleStart, false);
    elem.removeEventListener("touchend", handleEnd, false);
    elem.removeEventListener("touchcancel", handleCancel, false);
  }

  if (!disabled) {
    elem.addEventListener("mousemove", onMouseMove);
    elem.addEventListener("mouseleave", onStarOut);
  }

  var module = {
    setRating: setRating,
    getRating: getRating,
    clear: clear,
    dispose: dispose,

    get element() {
      return elem;
    }

  };

  function handleMove(e) {
    e.preventDefault();
    onMove(e, true);
  }

  function handleStart(e) {
    e.preventDefault();
    onMove(e, true);
  }

  function handleEnd(e) {
    e.preventDefault();
    onMove(e, true);
    onStarClick.call(module);
  }

  function handleCancel(e) {
    e.preventDefault();
    onStarOut(e);
  }

  if (!disabled) {
    elem.addEventListener("click", onStarClick.bind(module));
    elem.addEventListener("touchmove", handleMove, false);
    elem.addEventListener("touchstart", handleStart, false);
    elem.addEventListener("touchend", handleEnd, false);
    elem.addEventListener("touchcancel", handleCancel, false);
    elem.style.cursor = "pointer";
  }
};