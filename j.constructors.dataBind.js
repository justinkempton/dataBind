J.addWait(
	"Constructors.DataBind"
	, [ ]
	, function(ref) {

		return function DataBind(data, options) {

			var Dog = function(){}
				, dog = Dog.prototype
				, puppy = new Dog()

			function on(path, fun, clear) {

				var parent = puppy.data.events
				
				if (!parent)
					parent = puppy.data.events = {}

				if (!parent[path])
					parent[path] = []

				if (clear)
					parent[path].length = 0

				parent[path].push(fun)

				return puppy
			}

			function trigger(path) {
				var args = arguments
				, all = J.exists("data.events." + path, puppy, [])
						.forEach(function(item) {
							item.apply(this, args)
						})
				return puppy
			}

			options = options || { }
			options.manuallyBindInputs = options.manuallyBindInputs || false

			/*
			* All data is stored / referenced here
			*/
			puppy.data = data || { }

			/*
			* Meta data about paths and their dom elements
			* paths are paths to data
				"fard.main.userName" : []
			*/
			puppy.paths = { }

			/*
			* Meta data about paths and their dom elements
				"fard.main.userName" : "furd"
			*/
			puppy.lastValue = { }

			/* retrieve the bind name from the attribute 
			* @param {HTMLElement} element - any kind of element
			* */
			function getBindFromElement(element) {
				if (element && element.attributes["data-bind"])
					return element.attributes.getNamedItem("data-bind").value
			}

			/* retrieve optional data-source from element
			* @param {HTMLElement} element - any kind of element
			* */
			function getDataSourceFromElement(element) {
				if (element && element.attributes["data-source"])
					return element.attributes.getNamedItem("data-source").value
			}

			/* Binds data to a dom element
			* 
			* @param domElement - element to update when update command is fired
			* @param path - (optional) data path relative to dataBind module
			* @param clear - (optional) clears out any existing elements within the array that are bound to that data
			*/
			function bind(element, path, subOptions) {

				subOptions = subOptions || {}

				// clear out all other element binds
				subOptions.clear = subOptions.clear || false

				path = path || getBindFromElement(element)

				// other sources of data needed by template
				var source = subOptions.source = subOptions.source || getDataSourceFromElement(element) || path || ""
				source = source.replace(/\s/g,"").split(",")

				var arr = puppy.paths[path]
					, type = J.getType(element)

				if (!arr) 
					arr = puppy.paths[path] = []

				if (subOptions.clear)
					arr.length = 0

				arr.push(element)
				puppy.lastValue[path] = J.exists(path, puppy.data, "")

				updateElement(element, J.exists(path, puppy.data, ""), {
					db : puppy
					, paths : source
					, dataArr : getAll(source, [] )
					, dataObj : getAll(source, {} )
				})

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

				function build(item, inner, allParams, allData) {
					if (item.search(/[{}]/) === -1) 
						return results += item

					results += "<var "

					inner = item.replace(/[{\s}]/g, "")

					allParams = inner.split("|")
					allData = allParams[0].split(",")

					// data is default, assume that is the source and bind for all data
					if (allData[0])
						results += "data-bind='" + allData[0] + "' "

					// if other data is required to compose the template, include them as comma seperated params
					if (allData.length > 1)
						results += "data-source='" + allData.join(",") + "' "

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
			* @param {any} value - the new value(s)
			* @param {object} options - the new value(s)
			*/
			function updateTemplate(element, value, options) {

				var args = arguments

				var templatePath = element.attributes.getNamedItem("data-template").value

				J.waitExists("Templates." + templatePath, function(template) {
					template.apply(this, args)
				})

			}

			/* Update a single element with new value 
			* lets expand this out later based on the type of thing being updated 
			* let's put the path for 'how' to update it as an attribute
			* @param {HTMLElement} element - the element to update
			* @param {string} value - the new value
			*/
			function updateElement(element, value, subOptions) {

				var args = arguments
				var type = J.getType(element)

				if (element.attributes["data-template"]) 
					return updateTemplate.apply(this, args)

				if (document.activeElement === element)
					return

				switch (type) {

					case "HTMLInputElement" :
					case "HTMLSelectElement" :
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
					, oldValue = puppy.lastValue[path]
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

				puppy.lastValue[path] = store
				return store === oldValue

			}

			/* stores the last value into puppy.lastValue */
			function storeLastValue(path, value) {
				lastValue(path, value, false)
			}

			/* compares the value with puppy.lastValue */
			function compareLastValue(path, value) {
				return lastValue(path, value, true)
			}

			/* Update an array of elements with new value 
			* lets expand this out later based on the type of thing being updated 
			* @param {string} path - the path to the data
			* @param {array} elements - the elements to update
			*/
			function updatePath(path, elements) {
				var value = J.exists(path, puppy.data)
					, element

				/* if it's a match, do nothing */
				if (compareLastValue(path, value))
					return

				/* otherwise keep going */
				for (var x in elements)  
				(function(index, element, allElements, source) {

					source = getDataSourceFromElement(element) || ""
					source = source.replace(/\s/g,"").split(",")

					updateElement(element, value, {
						db : puppy
						, paths : source
						, dataArr : getAll(source, [] )
						, dataObj : getAll( source, {} )
					})
					
				}(x, elements[x], elements))

				storeLastValue(path, value)

			}

			/* Updates the data object 
			* this will be a global call that all useful ajax requests will call 
			* to inform that the data has been updated
			* @param {string} path - optional, if set then it updates that path immediately
			*/
			function update(path) {

				var elements

				if (path)
					return updatePath(path, puppy.paths[path])

				trigger("preUpdate")
				trigger("update")

				for (var x in puppy.paths) 
					updatePath(x, puppy.paths[x])

				trigger("posUpdate")

				return puppy
			}

			/* get the value from this path */
			function get(path, def) {
				return J.exists(path, puppy.data, (def || ""))
			}

			/* get the values from all paths */
			function getAll(pathArray, thing, type) {
				thing = thing || {}
				type = type || J.getType(thing)
				for (var x = 0; x < pathArray.length; x++)
					if (type === "Arr")
						thing.push(J.exists(pathArray[x], puppy.data))
					else
						thing[pathArray[x]] = J.exists(pathArray[x], puppy.data)
				return thing
			}

			/* set the path to this value */
			function set(path, value, noUpdate) {
				J.add(path, value, puppy.data)
				if (!noUpdate)
					update(path)
				return puppy
			}

			dog.bind = bind
			dog.autoBind = autoBind
			dog.findNodes = findNodes
			dog.update = update
			dog.get = get
			dog.set = set
			dog.getAll = getAll
			dog.on = on
			dog.trigger = trigger

			return puppy

		}

	})
