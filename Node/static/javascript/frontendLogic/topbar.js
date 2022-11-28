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

makeCategory = (category) => {



  let cat;

  cat = tag('div');
  a = tag('a');
  cat.appendChild(a);
  a.innerHTML = `${category.category_name}`;
  
  return cat;
}

categories = () => {
  if(document.querySelector('.control .categories').style.display) {
    document.querySelector('.control .categories').style.display=null;
  } else {
    document.querySelector('.control .categories').style.display="none";
  }
}

getCategoriesSorted(() => {
  categories.forEach(category => {
    if (category.category_id > 1) {
      document.querySelector('.control .categories').appendChild(makeCategory(category));
    }
  });
  document.querySelector('.control .categories').appendChild(makeCategory({category_id: 1, category_name: 'None'}));
});

document.querySelector('#categoriesbutton').onclick=categories;
