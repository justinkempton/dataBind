// This is an example of a much more complicated binding situation
// where for speeds sake, you don't want to reinstantiate the whole thing
// everytime the data changes... necessarily
//
// so instead, the template gets the data directly for itself
// see db.get below. 
// the interection between the various parts is handled through events
//
// in fact you can say this template creates its own data model
// see grid_ syntax. this could be easily be swapped out for an array
J.add( "Templates.Grid", function Grid (parent_element, empty, o) {

	var db = o.db

	// set a false interval
	var interval = setInterval(function(){}, 10000)

	function buildGrid() {

		clearInterval(interval)

		var limit = Number(db.get("limit"))
			, speed = Number(db.get("speed"))
			, letters = db.get("letters")
			, lettersSplit = letters.split(" ")
			, fragment = document.createDocumentFragment()

		parent_element.innerHTML = ""

		for (var x = 0; x < limit; x++)
		(function(index) {

			var element = document.createElement("div")

			fragment.appendChild(element)

			db.bind(element, "grid_" + String(index), { clear : true} )

		}(x))

		parent_element.appendChild(fragment)

		interval = setInterval(function() {

			for (var x = 0; x < limit; x++)
				db.set("grid_" + x, lettersSplit[ Math.floor(Math.random() * lettersSplit.length) ])

			db.update()

		}, speed)

	}

	// run it the first time, then relax and wait for event
	buildGrid()

	db.on("updateGrid", buildGrid)

})
