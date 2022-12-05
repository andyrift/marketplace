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

search = () => {
  const form = document.querySelector('form#search');
  if ('URLSearchParams' in window) {
    var searchParams = new URLSearchParams(window.location.search);
    searchParams.set("string", form.search.value);
    if (!form.search.value) {
      searchParams.delete("string");
    }
    window.location = "/?" + searchParams.toString();
  }
}

makeCategory = (category) => {

  let cat;

  cat = tag('div');
  a = tag('a');
  a.onclick = () => {
    const form = document.querySelector('form#search');
    if ('URLSearchParams' in window) {
      var searchParams = new URLSearchParams(window.location.search);
      searchParams.set("category_id", category.category_id);
      if(category.category_id === 1) {
        searchParams.delete("category_id");
      }

      searchParams.set("string", form.search.value);
      if (!form.search.value) {
        searchParams.delete("string");
      }

      window.location = "/?" + searchParams.toString();
    }
  }
  cat.appendChild(a);
  a.innerHTML = `${category.category_name}`;
  
  return cat;
}

categoriesTab = () => {
  catTab = document.querySelector('.control .categories');
  if(catTab.style.display) {
    catTab.style.display=null;
  } else {
    catTab.style.display="none";
  }
}

init = (callback) => {
  getCategoriesSorted(() => {
    categories.forEach(category => {
      if (category.category_id > 1) {
        document.querySelector('.control .categories').appendChild(makeCategory(category));
      }
    });
    document.querySelector('.control .categories').appendChild(makeCategory({category_id: 1, category_name: 'None'}));

    document.querySelector('#categoriesbutton').onclick=categoriesTab;
    document.querySelector('#searchbutton').onclick=search;

    document.querySelector('form#search').search.value = new URLSearchParams(window.location.search).get("string");

    if(typeof favoritePostsSide !== "undefined") {
      favoritePostsSide.start();
    }

    callback();
  });
}


