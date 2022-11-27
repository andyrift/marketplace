var topbar = document.getElementById("topbar");
var topbarInitialOffset = topbar.offsetTop;

stickTopbar = () => {
  if (window.pageYOffset >= topbarInitialOffset) {
    topbar.classList.add("sticky")
  } else {
    topbar.classList.remove("sticky");
  }
}

window.addEventListener('scroll', stickTopbar);