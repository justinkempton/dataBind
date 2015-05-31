J.addWait(
	"Constructors.DataBind"
	, [ ]
	, function(ref) {

		return function DataBind(data, options) {

			var Dog = function(){}
				, dog = Dog.prototype
				, puppy = new Dog()
				, _onUpdate

			options = options || { }
			options.manuallyBindInputs = options.manuallyBindInputs || false

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

			if (puppy.data._onUpdate)
				_onUpdate = puppy.data._onUpdate
			else
				_onUpdate = puppy.data._onUpdate = []

			dog.onUpdate = function(func) {
				_onUpdate.push(func)
			}

			/* retrieve the bind name from the attribute 
			* @param {HTMLElement} element - any kind of element
			* */
			function getBindFromElement(element) {
				if (element && element.attributes["data-bind"])
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
					, type = J.getType(element)

				if (!arr) 
					arr = puppy.paths[path] = []

				if (clear)
					arr.length = 0

				arr.push(element)
				puppy.lastValue[path] = J.exists(path, puppy.data)

				if (J.exists(path, puppy.data))
					updateElement(element, J.exists(path, puppy.data))

				if (!options.manuallyBindInputs) {

					function setPath(event) {
						set(path, event.srcElement.value)
						update()
					}

					if (type === "HTMLInputElement" || type === "HTMLTextAreaElement")
						element.onkeyup = setPath

					if (type === "HTMLSelectElement" || type === "HTMLInputElement")
						element.onchange = setPath

				}

				return puppy
			}


			/*Use this code to pull out contenetNodes from handlebar {{ }} text
			* each handlebar will be inserted into a <var> tag with the data-bind property set
			* this only transforms text into text, it does not deal with DOM yet
			* that will be handled by another library
			*
			* @param {string | HTMLElement} html - raw html text or HTMLElement
			* raw HTML returns modified html
			* HTMLElement modifies the element
			* returns modified html code with additional var tags with data-bind properties
			*
			* var is a proper html tag! http://www.w3schools.com/tags/tag_var.asp
			*
			*/
			function findNodes (html) {

				var type = J.getType(html)
					, innerHTML = (type === "Str") ? html : html.innerHTML

				var splits = innerHTML.match(/([^{}]+|{{[^}]*}})/g)
					, results = ""

				function build(item, inner, allParams) {
					if (item.search(/[{}]/) === -1) 
						return results += item

					results += "<var "

					inner = item.replace(/[{\s}]/g, "")

					allParams = inner.split(";")

					// data is default
					if (allParams[0])
						results += "data-bind='" + allParams[0] + "' "

					// template is optional - but directs
					if (allParams[1])
						results += "data-template='" + allParams[1] + "' "

					results += "></var>"
				}

				while(splits.length)
					build(splits.shift())

				if (type === "Str")
					return results

				html.innerHTML = results
				return html

			}

			/* autmatically bind all elements with data-bind attribute
			* @param {HTMLElement} parent_element - contains unbound elements
			*/
			function autoBind(parent_element) {
				var all = findNodes(parent_element).querySelectorAll("*[data-bind]")
				for (var x = 0; x < all.length; x++)
					bind(all[x])
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

					// case "HTMLSelectElement" :
					// 	if (document.activeElement !== element)
					// 		element.value = value
					// break

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
			dog.autoBind = autoBind
			dog.findNodes = findNodes
			dog.update = update
			dog.get = get
			dog.set = set

			return puppy

		}

	})
