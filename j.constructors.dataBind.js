J.addWait(
	"Constructors.DataBind"
	, [ ]	
	, function(ref) {

		return function DataBind(data) {

			var Dog = function(){}
				, dog = Dog.prototype
				, puppy = new Dog()

			/*
			* All data is stored / referenced here
			*/
			puppy.data = data || { }

			/*
			* Meta data about paths and their dom elements
				"fard.main.userName" : []
			*/
			puppy.paths = { }

			/*
			* Meta data about paths and their dom elements
				"fard.main.userName" : "furd"
			*/
			puppy.lastValue = { }

			var _onUpdate = []
			dog.onUpdate = function(func) {
				_onUpdate.push(func)
			}

			function getBindFromElement(element) {
				if (element.attributes["data-bind"])
					return element.attributes.getNamedItem("data-bind").value
			}

			/* Binds data to a dom element
			* 
			* @param domElement - element to update when update command is fired
			* @param path - (optional) data path relative to dataBind module
			* @param clear - (optional) clears out any existing elements within the array that are bound to that data
			*/
			function bind(element, path, clear) {
				path = path || getBindFromElement(element)

				var arr = puppy.paths[path]
				if (!arr) arr = puppy.paths[path] = []

				if (clear)
					arr.length = 0

				arr.push(element)
				puppy.lastValue[path] = J.exists(path, puppy.data)

				if (J.exists(path, puppy.data))
					updateElement(element, J.exists(path, puppy.data))

				return puppy
			}

			/* Update a single element that is a template element
			* @param {HTMLElement} element - the element to update
			* @param {string} value - the new value(s)
			*/
			function updateTemplate(element, value) {

				var templatePath = element.attributes.getNamedItem("data-template").value

				J.waitExists("Templates." + templatePath, function(template) {
					template(element, value)
				})

			}

			/* Update a single element with new value 
			* lets expand this out later based on the type of thing being updated 
			* let's put the path for 'how' to update it as an attribute
			* @param {HTMLElement} element - the element to update
			* @param {string} value - the new value
			*/
			function updateElement(element, value) {

				if (element.attributes["data-template"]) 
					return updateTemplate(element, value)

				var type = J.getType(element)

				switch (type) {

					case "HTMLInputElement" :
						if (document.activeElement !== element)
							element.value = value
					break

					case "HTMLSelectElement" :
						if (document.activeElement !== element)
							element.value = value
					break

					case "HTMLELement" :
					default :
					element.innerHTML = value

				}

			}

			/* Only store strings as the same value
			* @param {string} path - the path to the data
			* @param {anything} value
			*/
			function lastValue(path, value, compare) {

				var type = J.getType(value)
					, store
					, passedByRef = false

				switch(type) {
					case "Boo" :
					case "Str" :
					case "Num" :
						store = value
						break
					default :
						store = JSON.stringify(value)
						passedByRef = true
				}

				if (compare && passedByRef)
					return JSON.stringify(value) === puppy.lastValue[path]
				else if (compare)
					return value === puppy.lastValue[path]

				puppy.lastValue[path] = store

			}

			/* stores the last value into puppy.lastValue */
			function storeLastValue(path, value) {
				lastValue(path, value, false)
			}

			/* compares the value with puppy.lastValue */
			function compareLastValue(path, value) {
				lastValue(path, value, true)
			}

			/* Update an array of elements with new value 
			* lets expand this out later based on the type of thing being updated 
			* @param {string} path - the path to the data
			* @param {array} elements - the elements to update
			*/
			function updatePath(path, elements) {
				var value = J.exists(path, puppy.data)

				/* if it's a match, do nothing */
				if (compareLastValue(path, value))
					return

				/* otherwise keep going */
				for (var x in elements) 
					updateElement(elements[x], value, path)

				storeLastValue(path, value)

			}

			/* Updates the data object 
			* this will be a global call that all useful ajax requests will call 
			* to inform that the data has been updated
			*/
			function update() {
				for (var y in _onUpdate) _onUpdate[y]()
				for (var x in puppy.paths) 
					updatePath(x, puppy.paths[x])

				return puppy
			}

			/* get the value from this path */
			function get(path, def) {
				return J.exists(path, puppy.data, (def || ""))
			}

			/* set the path to this value */
			function set(path, value) {
				J.add(path, value, puppy.data)
				return puppy
			}

			dog.bind = bind
			dog.update = update
			dog.get = get
			dog.set = set

			return puppy

		}

	})
