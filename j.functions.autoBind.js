/* 
* Use this code to pull out contenetNodes from handlebar {{ }} text
* each handlebar will be inserted into a <var> tag with the data-bind property set
* this only transforms text into text, it does not deal with DOM yet
* that will be handled by another library
*/

/*
* @param {HTMLElement} parent_element, contains unbound elements
* @param {DataBind} dataBind - raw html text
* returns modified html code with additional var tags with data-bind properties
*
* var is a proper html tag! http://www.w3schools.com/tags/tag_var.asp
*
*/
J.add("Functions.autoBind", function(parent_element, dataBind) {

	parent_element.querySelectorAll("*[data-bind]")
		.forEach(function(item, index, all) {
		})

	return parent_element

})
