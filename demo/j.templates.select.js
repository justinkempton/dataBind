J.add( "Templates.Select", function Select (parent_element, data, o) {

	// pass this path into db.set(savePath, value)
	var savePath = o.paths[1]
		, db = o.db

	function inner() {
		var inner = ""
			, item

		for (var x = 0; x < data.length; x++) {
			item = data[x]
			inner += "<option value='"
			inner += item.Id
			inner += "'"
			inner += item.Selected ? "Selected" : ""
			inner += " >"
			inner += item.Display
			inner += "</option>"
		}

		return inner
	}

	function init() {

		var html = ""
		+ "<select>"
		+ inner()
		+ "</select>"

		parent_element.innerHTML = html

		parent_element.firstChild.onchange = function(event) {
			db.set(savePath, event.target.value)
				.update()
		}

	}

	init()

	db.on("update", init)

})
