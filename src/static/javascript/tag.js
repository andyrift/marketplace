tag = (name, attrs) => {
  var element = document.createElement(name.toString());

  !!attrs && Object.keys(attrs).forEach(function(key) {
    element.setAttribute(key, attrs[key]);
  });

  return element;
}