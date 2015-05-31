/* 
* Use this code to pull out contenetNodes from handlebar {{ }} text
* each handlebar will be inserted into a <var> tag with the data-bind property set
* this only transforms text into text, it does not deal with DOM yet
* that will be handled by another library
*/

/*
* @param {string} html - raw html text
* returns modified html code with additional var tags with data-bind properties
*
* var is a proper html tag! http://www.w3schools.com/tags/tag_var.asp
*
*/
J.add("Functions.findNodes", function(html) {

	var type = J.getType(html)
		, innerHTML = (type === "Str") ? html : html.innerHTML

	var splits = innerHTML.match(/([^{}]+|{{[^}]*}})/g)
		, results = ""

	function build(item, inner) {
		if (item.search(/[{}]/) === -1) 
			return results += item

		inner = item.replace(/[{}]/g, "")
		return results += "<var data-bind='" + inner + "'></var>"
	}

	while(splits.length)
		build(splits.shift())

	if (type === "Str")
		return results

	html.innerHTML = results
	return html

})
