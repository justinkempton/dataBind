/* jDog is way of organizing javascript based apps of small to immense complexity.
* Works great across pages, or in single page apps, extensions, etc etc.
* Can replace or work with other libraries like require.js and jQuery
* Small by design.
* SEE https://jdog.io
* Created by Justin Kempton
*
* MIT License
*/
;(function() {

	/*
	* the point of jDog is to be able to simplify development of javascript with the chrome console.
	* Specifically by organizing everything into one common easily accessible global variable called J or PAGE.
	*
	* For convenience (window.PAGE, window.J, and window.jDog are interchangeable.
	*
	* SEE https://jdog.io for all documentation
	*/

	var timerText = "finished loading"
		, emptyFunction = new Function()
		, preset = window.jdog_preset || {}
		, hidden = preset.hidden ? { } : null

	function ifConsole(fun) {
		if (window.console) return (fun || emptyFunction)()
	}

	ifConsole( function() {
		if (!hidden) {
			console.groupCollapsed("%c犬%cJ%cDOҨ", "font-size:60px; font-weight:400 ", "padding-left:5px; font-size:55px; font-weight:400 ", "font-size:55px; color:rgb(117,228,29); padding-right:10px; font-weight:400 ")
			console.time(timerText)
		}
	})

	var JDog = function(){} // base constructor
		, dog = JDog.prototype = { } // base prototype
		, logs = hidden ? {} : dog.logs = {}
		, _ = hidden ? {} : dog._ = {}
		, puppy = new JDog()                           // base instance
		, speedOfInterval = preset.speedOfInterval || 30 // speed of interval called during waiting
		, limit = preset.limit || 500
		, onceCallbacks = []
		, d = document
		, snap = _.snap = {}
		, loadList = logs.loaded  = { }    // list all loaded libraries (and where they were used)
		, waitList = logs.waitQue = { }    // show the loading que, unloaded show as false
		, waitMap  = logs.waitMap = { }    // reverse look at logs.loaded
		, scriptNumber = 0                     // used while loading css / scripts
		, useMap = _.useMap = preset.useMap || {} // see dog.use, loads then applys function with parameters


	dog.done = function(onceCB) {   // method to add to finished callback
		onceCallbacks.push( onceCB || emptyFunction )
	}

	dog.done(function() {
		if (hidden) return
		ifConsole(function() {
			console.dir(J)
			console.timeEnd(timerText)
			console.groupEnd()
		})
	})

	// load jQuery from here if needed
	useMap["jQuery"] = "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"

	dog.changeRoot = function(root) {

		root = root || _.t || "/Scripts/test/"

		// if you call this named function with use, load this script then wait and run it
		_.t = root                    // base url for testScripts
		useMap["test.attach"] = useMap["test.setTests"] = _.t + "j.test.attach.js"

		for (var tm = String("test.runTest,test.run").split(','); tm.length;)
			useMap[ tm.shift() ] = _.t + "j.test.js"

		return puppy
	}

	dog.changeRoot()

	// all existential queries are run through here, this is the foundation of the whole thing
	var ex = dog.exists = function (path, base, alternate) {
		if (typeof path === "undefined" || typeof path === "object") return

		if (path.search(/window\./) === 0)
			base = window

		var arr = path.split(".")
			, x = 0
			, obj = (base === puppy && hidden) ? hidden : base || hidden || puppy

		if (arr.length < 1) return alternate

		while (x < arr.length) {
			obj = obj[arr[x]]
			if (obj === undefined || obj === null) return alternate
			x++
		}
		if (typeof obj !== "undefined")
			return obj
		else
			return alternate
	}


	// all waiting is done here
	var waitExists = dog.waitExists = function(/* path, base, func, sourcePath */) {
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

		thing = ex(path, base)

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

				ifConsole(function() {
					console.warn(source + " could not find " + path)
				})

				clearInterval(interval)
				return
			}
			var thing = ex(path,base)
			if (thing) {
				;(func || emptyFunction)(thing)
				waitList[path] = true
				clearInterval(interval)
				runFinishedCallbacks()
			}
		}, speedOfInterval)
		return puppy
	}


	// this is the main method, split by the arguments
	dog.wait = function(/* path, path2, path3, refObj, callback */) {
		var map = mapArguments(arguments)
		if (map.Arr && map.Obj) return batchWaitRef.apply((this), arguments)
		if (map.Str && map.Obj && !map.Arr) return batchWait.apply(this, arguments)
		else return waitExists.apply(this, arguments)
	}


	// internal function to load array elements
	var batchWaitRef = function(arr, ref, callback, source) {

		var source = getFuncName(source, arguments)
			, count = 0
			, ref = ref || {}

		ref.J = ref.PAGE = puppy

		if (!arr.length) {
			(callback || emptyFunction)(ref)
			return puppy
		}

		for (var x = 0; x < arr.length; x++)
		(function(index, arr) {
			waitExists(arr[index], function(f) {
				count += 1
				var name = arr[index].split(".").reverse()[0]
				ref[name] = f
				if (count >= arr.length)
					(callback || emptyFunction)(ref)
			}, source)
		}(x, arr))

		return puppy
	}


	// split out items from arguments into array
	var batchWait = function(/* str, str2, str3, obj, callback */) {

		var arr = []
			, ref = {}
			, map = mapArguments(arguments)
			, source = getFuncName("", arguments, map)
			, callback

		if (map.Fun) callback = map.Fun[0]
		if (map.Str) arr = map.Str
		if (map.Obj) ref = map.Obj[0]
		if (map.Arr) arr.concat(map.Str)

		ref.J = ref.PAGE = puppy

		batchWaitRef(arr, ref, callback, source)
		return puppy
	}

	// all adding is done using this
	dog.add = function (path, thing, base, silent) {

		var defaultBase

		if (path.substr(0,1) === "~") {
			defaultBase = dog
			path = path.substr(1)
		} else {
			defaultBase = hidden || puppy
		}

		if (typeof path === "undefined" || typeof path === "object") return
		var arr = path.split(".")
			, x = 0
			, obj = base || defaultBase // again, for exporting this function change puppy
			, snap = !silent ? takeSnap(path, null, thing, null, null) : null

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
	dog.addWait = function addWait (path, arrayOfRequiredLibraries, fun) {


		var ref = { }
		, snap = takeSnap(path, fun, null, arrayOfRequiredLibraries, ref)

		ref.J = ref.PAGE = puppy

		batchWaitRef(arrayOfRequiredLibraries, ref, function(ref) {
			snap.thing = fun(ref) || {}
			snap.thing._jdog = snap
			dog.add(path, snap.thing, puppy, true)
		}, path)
		return puppy
	}


	// gather all of the required libraries in an array, push them into the anonymous function
	dog.addWait$ = function addWait$(path, arrayOfRequiredLibraries, fun) {

		var ref = { }
		, snap = takeSnap(path, fun, null, arrayOfRequiredLibraries, ref)

		ref.J = ref.PAGE = puppy

		dog.waitExists("jQuery", window, function() {
			window.jQuery(d).ready(function() {
				batchWaitRef(arrayOfRequiredLibraries, ref, function(ref) {
					snap.thing = fun(ref) || {}
					snap.thing._jdog = snap
					dog.add(path, snap.thing, puppy, true)
				}, path)
			})
		})

		return puppy

	}


	// get the type of anything. Common types are shortened
	var getType = dog.getType = function getType(thing) {
		var shorten = "StringBooleanArrayObjectNumberFunction"
			, ret
    if(thing===null) return "Null"
		if(typeof thing === "object" && window.jQuery && thing instanceof window.jQuery) return "jQuery"
    ret = Object.prototype.toString.call(thing).slice(8, -1)
		if (shorten.indexOf(ret) > -1)
			return ret.substr(0,3)
		else
			return ret
	}

	function takeSnap(path, fun, thing, waitList, ref) {
		if (arguments.length) {
			snap.path = path
			snap.fun = fun
			snap.thing = thing
			snap.waitList = waitList
			snap.ref = ref
		}
		var clone = {}
		for (var x in snap) clone[x] = snap[x]
		return clone
	}

	// internal function to add to array
	function pushInObj(name, item, obj) {
		if (!obj[name]) obj[name] = []
		obj[name].push(item)
	}


	// create a hash of arguments sorted by type
	var mapArguments = dog.mapArguments = function(args) {
		var map = {}

		for(var y = 0; y < args.length; y++)
			pushInObj(getType(args[y]), args[y], map)

		return map
	}

	// method for loading files, currently not used for waiting
	var load = dog.load = function load (/* pathToFile, allowCache */) {

		var map = dog.mapArguments(arguments)
			, overwrite = map.Boo ? map.Boo[0] : false
			, allowCache = map.Boo ? map.Boo[1] : false

		if (!map.Str) return puppy
		if (map.Str.length > 1) {
			for (var x in map.Str) load(map.Str[x], overwrite, allowCache)
			return puppy
		}

		var pathToFile = map.Str[0]

		if (useMap[pathToFile]) {
			return load( useMap[pathToFile] )
		}

		var type = pathToFile.slice(-3).toLowerCase()
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

	// setup a map of method paths, and files to load to get them
	// this is used by page.test.js as a way of loading files on the fly without depending on them
	// only useful for functions, not objects, since arguments get passed into them
	dog.use = function use(/* name, argsArray */) {

		var map = mapArguments(arguments)
		, name = map.Str[0]
		, lastSnap = takeSnap()

		// force to be array inside arguments array
		var argsArray = map.Arr ?
			[lastSnap, map.Arr]
			: [lastSnap, map.Str.slice(1)]

		if (dog.exists(name))
			return dog.exists(name).apply(this, argsArray)

		if (useMap[name]) {
			load.apply( this, [useMap[name]] )
			.wait(name, function(thing) {
				thing.apply(this, argsArray)
			})
		}

		return puppy
	}


	// extend jDog
	dog.extend = function extend(callback) {
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
		map = map || mapArguments(args)
		source = source
			|| ex("callee.caller.name", args)
			|| ex("callee.caller.caller.name", args)
			|| ex("Fun.1.name", map)
			|| ex("Fun.0.name", map)
			|| "anonymous"
		return source
	}


	// methods for checking if finished loading to run finished callback(s)
	function checkWaitingList() {
		var count = 0
		for(var x in waitList) if (!waitList[x]) count++
		return count
	}

	d.addEventListener("DOMContentLoaded", function(event) {
		dog.DomContentLoaded = true
		
		// store jQuery for instanceof, in case it gets overriden by some other code
		// this is used by getType, jQuery is so common it needs it's own type!
		_.jQuery = window.jQuery

  })

	_.version = "3.1.1"

	// jDog and J are psynonymous
	window.PAGE = window.J = puppy

}())
