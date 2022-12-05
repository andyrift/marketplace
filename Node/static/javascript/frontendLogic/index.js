const indexPosts = new postGetter({ 
	postContainer: document.querySelector('.main div.posts'), 
	postParams: { 
		quantity: 6,
		exclude: true,
		shuffle: true
	},
	getPostsMethod: getPosts, 
	makePostMethod: makePost,
	onEmpty: () => {
		document.querySelector('.main div.posts').querySelector("div.empty").style.display = null;
	}
});

init(() => {
	indexPosts.start();
	if ('URLSearchParams' in window) {
	  var searchParams = new URLSearchParams(window.location.search);
	  category_id = parseInt(searchParams.get("category_id"));
	  category = null;
	  if(category_id) {
	  	category = categories.find(category => { return category.category_id === category_id });
	  }
	  string = searchParams.get("string");

	  if(string && category) {
	  	document.querySelector('div.h-rand').style.display = "none";
	  	document.querySelector('div.h-str-cat').style.display = null;
		  document.querySelector('span.h-str-cat').innerHTML = category.category_name;
		} else if (category) {
			document.querySelector('div.h-rand').style.display = "none";
			document.querySelector('div.h-rand-cat').style.display = null;
		  document.querySelector('span.h-rand-cat').innerHTML = category.category_name;
		} else if (string) {
			document.querySelector('div.h-rand').style.display = "none";
			document.querySelector('div.h-str').style.display = null;
		}
	  
	}
})

