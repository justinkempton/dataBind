J.addWait(
	"Modules.dataBind"
	, [ "DomContentLoaded" ]	
	, function(ref) {

		var Dog = function(){}
		  , dog = Dog.prototype
		  , puppy = new Dog()

		/*
		* All data is stored / referenced here
		*/
		dog.data = { }

		/*
		* Meta data about paths and their dom elements
			"fard.main.userName" : []
		*/
		dog.paths = { }

		/*
		* Meta data about paths and their dom elements
			"fard.main.userName" : "furd"
		*/
		dog.lastValue = { }

		/* Binds data to a dom element
		* 
		* @param path - data path relative to dataBind module
		* @param domElement - element to update when update command is fired
		*/
		function bind(path, element) {
			var arr = dog.paths[path]
			if (!arr) arr = dog.paths[path] = []
			arr.push(element)
			dog.lastValue[path] = J.exists(path, dog.data)
			return puppy
		}


		/* Update a single element with new value 
		* lets expand this out later based on the type of thing being updated 
		* let's put the path for 'how' to update it as an attribute
		* @param {HTMLElement} element - the element to update
		* @param {string} value - the new value
		*/
		function updateElement(element, value) {
			var type = J.getType(element)

			switch(type) {
				case "HTMLInputElement" :
				element.value = value
				break

				case "HTMLSelectElement" :
				element.value = value
				break

				case "HTMLELement" :
				default :
				element.innerHTML = value
			}

		}

		/* Update an array of elements with new value 
		* lets expand this out later based on the type of thing being updated 
		* @param {string} path - the path to the data
		* @param {array} elements - the elements to update
		*/
		function updatePath(path, elements) {
			var value = J.exists(path, dog.data)
			if (value !== dog.lastValue[path])
				for (var x in elements) updateElement(elements[x], value, path)
			dog.lastValue[path] = value
		}

		/* Updates the data object 
		* this will be a global call that all useful ajax requests will call 
		* to inform that the data has been updated
		*/
		function update() {
			for (var x in dog.paths) 
				updatePath(x, dog.paths[x])

			return puppy
		}

		dog.bind = bind
		dog.update = update

		return puppy

	})
