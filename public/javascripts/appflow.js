
function highlightMenu(menuItemId) {
	//remove active from all menu ids
	var menuItems = $("li[id^=menu_]");
	$(menuItems).removeClass("active");

	//add class
	var menuItem = $("li"+"#"+menuItemId);
	$(menuItem).addClass("active");
}
