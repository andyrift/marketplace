window.onscroll = function() {myFunction()};

var topbar = document.getElementById("topbar");
var topbarInitialOffset = topbar.offsetTop;

function myFunction() {
  if (window.pageYOffset >= topbarInitialOffset) {
    topbar.classList.add("sticky")
  } else {
    topbar.classList.remove("sticky");
  }
}