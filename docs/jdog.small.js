/* jDog is way of organizing javascript based apps of small to immense complexity.
* Works great across pages, or in single page apps, extensions, etc etc.
* Can replace or work with other libraries like require.js and jQuery
* Small by design.
* SEE https://jdog.io
* Created by Justin Kempton
*
* MIT License
*/
;(function( und, o, jQ, ci ) {

	var global = global || this

	/*
	* the point of jDog is to be able to simplify development of javascript with the chrome console.
	* Specifically by organizing everything into one common easily accessible global variable called J.
	*
	* For convenience (global.J, and global.jDog are interchangeable.
	*
	* SEE https://jdog.io for all documentation
	*/

	var emptyFunction = new Function()
		, preset = global.jdog_preset || {}
		, JDog = function(){}                          // base constructor
		, dog = JDog.prototype = { logs : {} } // base prototype
		, puppy = new JDog()                           // base instance
		, speedOfInterval = preset.speedOfInterval || 100 // speed of interval called during waiting
		, limit = preset.limit || 500
		, onceCallbacks = []
		, d = global.document
		, loadList = dog.logs.loaded  = { }    // list all loaded libraries (and where they were used)
		, waitList = dog.logs.waitQue = { }    // show the loading que, unloaded show as false
		, waitMap  = dog.logs.waitMap = { }    // reverse look at logs.loaded
		, scriptNumber = 0                     // used while loading css / scripts


	function done(onceCB) {   // method to add to finished callback
		onceCallbacks.push( onceCB || emptyFunction )
	}

	// all existential queries are run through here, this is the foundation of the whole thing
	function exists (path, base, alternate) {
		if (typeof path === und || typeof path === o) return

		if (path.search(/window\./) === 0 || path.search(/global\./) === 0)
			base = global

		var arr = path.split(".")
			, x = 0
			, obj = base || puppy // if you want to export this function, change puppy to any default

		if (arr.length < 1) return alternate

		while (x < arr.length) {
			obj = obj[arr[x]]
			if (obj === undefined || obj === null) return alternate
			x++
		}
		if (typeof obj !== und)
			return obj
		else
			return alternate
	}


	// all waiting is done here
	function waitExists (/* path, base, func, sourcePath */) {
		var thing
			, arg = arguments
			, count = 0
			, interval
			, base, func, sourcePath
			, path = arg[0]

		// no base defined
		if (typeof arg[1] === "function") {
			func = arg[1]
			sourcePath = arguments[2]
			base = undefined
		} else {
			base = arg[1]
			func = arg[2]
			sourcePath = arg[3]
		}

		var source = getFuncName(sourcePath, arg)

		thing = exists(path, base)

		// adding it to the load list
		if (!waitMap[source])
			waitMap[source] = []

		// adding it to the load list
		if (!loadList[path])
			loadList[path] = []

		loadList[path].push(source)
		waitMap[source].push(path)

		waitList[path] = false

		if (thing) {
			;(func || emptyFunction)(thing)
			waitList[path] = true
			runFinishedCallbacks()
			return puppy
		}
		interval = setInterval(function() {
			count++
			if (count > limit) {

				global.console && console.warn(source + " could not find " + path)

				ci(interval)
				return
			}
			var thing = exists(path,base)
			if (thing) {
				;(func || emptyFunction)(thing)
				waitList[path] = true
				ci(interval)
				runFinishedCallbacks()
			}
		}, speedOfInterval)
		return puppy
	}


	// this is the main method, split by the arguments
	function wait (/* path, path2, path3, refObj, callback */) {
		var map = mapArguments(arguments)
			, ref = {}
			, fun
			, source = getFuncName(null, arguments, map)

		if (!map.Fun)
			return puppy
		else
			fun = map.Fun[0]
		
		if (map.Obj) 
			ref = map.Obj[0]

		if (map.Str && map.Str.length === 1 && !map.Obj) 
			return waitExists.apply(this, arguments)

		if (map.Arr) 
			return batchWaitRef(map.Arr, ref, fun, source)

		if (map.Str) 
			return batchWaitRef(map.Str, ref, fun, source)
	}


	// internal function to load array elements
	function batchWaitRef (arr, ref, callback, source) {

		source = getFuncName(source, arguments)

		var count = 0
			, ref = ref || {}

		ref.J = puppy

		if (!arr.length) {
			(callback || emptyFunction)(ref)
			return puppy
		}

		for (var x = 0; x < arr.length; x++)
		(function(index, arr) {
			waitExists(arr[index], function(f) {
				count += 1
				var name = arr[index].split(".").reverse()[0]

				// adding long pathname for avoiding namespace collision
				ref[arr[index]] = f

				// only adds the short name if it's not already there
				if (!ref[name])
					ref[name] = f

				// check if all things are loaded
				if (count >= arr.length)
					(callback || emptyFunction)(ref)

			}, source)
		}(x, arr))

		return puppy
	}

	// all adding is done using this
	function add (path, thing, base, silent) {

		var defaultBase

		if (path.substr(0,1) === "~") {
			defaultBase = dog
			path = path.substr(1)
		} else {
			defaultBase = puppy
		}

		if (typeof path === und || typeof path === o) return
		var arr = path.split(".")
			, x = 0
			, obj = base || defaultBase

		if (arr.length < 1) return

		while (x < arr.length) {

			if (x === arr.length - 1) {
				obj[arr[x]] = thing
				return thing
			} else {
				if (obj[arr[x]] === undefined) {
					obj = obj[arr[x]] = { }
				} else {
					obj = obj[arr[x]]
				}
			}
			x++
		}
	}


	// gather all of the required libraries in an array, push them into object, then callback( obj -- ref )
	function addWait (path, arrayOfRequiredLibraries, fun) {

		var ref = { J : puppy }

		batchWaitRef(arrayOfRequiredLibraries, ref, function(ref) {
			add(path, fun(ref), puppy, true)
		}, path)
		return puppy
	}


	// gather all of the required libraries in an array, push them into the anonymous function
	function addWait$(path, arrayOfRequiredLibraries, fun) {

		var args = arguments

		waitExists(jQ, global, function(jQQ) {
			jQQ.ready(function() {
				addWait.apply(this, args)
			})
		})

		return puppy

	}

	// get the type of anything. Common types are shortened
	function getType (thing) {
		var shorten = "StringBooleanArrayObjectNumberFunction"
			, ret
    if(thing===null) return "Null"
		if(typeof thing === o && global[jQ] && thing instanceof global[jQ]) return jQ
    ret = Object.prototype.toString.call(thing).slice(8, -1)
		if (shorten.indexOf(ret) > -1)
			return ret.substr(0,3)
		else
			return ret
	}

	// internal function to add to array
	function pushInObj(name, item, obj) {
		if (!obj[name]) obj[name] = []
		obj[name].push(item)
	}

	// create a hash of arguments sorted by type
	function mapArguments (args) {
		var map = {}

		for(var y = 0; y < args.length; y++)
			pushInObj(getType(args[y]), args[y], map)

		return map
	}

	// method for loading files, currently not used for waiting
	function load (/* pathToFile, allowCache */) {

		var map = mapArguments(arguments)
			, overwrite = map.Boo ? map.Boo[0] : false
			, allowCache = map.Boo ? map.Boo[1] : false

		if (!map.Str) return puppy
		if (map.Str.length > 1) {
			for (var x in map.Str) load(map.Str[x], overwrite, allowCache)
			return puppy
		}

		var pathToFile = map.Str[0]
			, type = pathToFile.slice(-3).toLowerCase()
			, fileId = pathToFile.replace(/\./g,"_").replace(/\//g, "_").replace(":","")
			, existingElm = d.getElementById(fileId)

		if (existingElm && !overwrite) {
			return puppy
		}

		var increment = allowCache ? scriptNumber++ : String((Math.random() * 1000)).replace(/\./,"").substr(0,3)
			, fileref = d.createElement( type === "css" ? 'link' : "script"  )


		if (type === "css") {
			fileref.rel = "stylesheet"
			fileref.type = "text/css"
			fileref.href = pathToFile.replace(/^~/,"") + "?" + increment // increment or randomize
		} else {
			fileref.type = "text/javascript"
			fileref.src = pathToFile.replace(/^~/,"") + "?" + increment // increment or randomize
		}

		fileref.id =  fileId

		if (existingElm)
			existingElm.parentElement.removeChild(existingElm)

		d.getElementsByTagName("head")[0].appendChild(fileref)

		return puppy

	}

	// extend jDog
	function extend(callback) {
		;(callback || emptyFunction)(puppy, dog)
		return puppy
	}


	// internal function calling all done callbacks when everything is finished loading
	function runFinishedCallbacks() {
		while(!checkWaitingList() && onceCallbacks.length)
			onceCallbacks.shift()(J)
	}


	// used to log the function names used to load libraries
	// we are using callee.caller here, this feature is being pushed out of javascript in ES5. What a shame when smart people take away cool features
	function getFuncName(source, args, map) {

		if (source)
			return source

		source = exists("callee.caller.name", args)
			|| exists("callee.caller.caller.name", args)

		if (!source) {
			map = map || mapArguments(args)
			source = exists("Fun.1.name", map)
			|| exists("Fun.0.name", map)
			|| "anonymous"
		}

		return source

	}


	// methods for checking if finished loading to run finished callback(s)
	function checkWaitingList() {
		var count = 0
		for(var x in waitList) if (!waitList[x]) count++
		return count
	}

	if (d)
		d.addEventListener("DOMContentLoaded", function(event) {
			dog.DomContentLoaded = true
		})

	dog.version = "small3.2.0"

	dog.done = done
	dog.exists = exists
	dog.waitExists = waitExists
	dog.wait = wait
	dog.add = add
	dog.addWait = addWait
	dog.addWait$ = addWait$
	dog.getType = getType
	dog.mapArguments = mapArguments
	dog.load = load
	dog.extend = extend

	if (typeof module !== und && module.exports)
		module.exports = puppy

	global.J = puppy

}( "undefined", "object", "jQuery", clearInterval ))


