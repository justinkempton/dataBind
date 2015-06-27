J.add("Docs.DataBind", {

	jDog : "version 3.*"
	, Methods : [
		{
			Name : "About"
			, Description : [
				"The following code was created over a long weekend as a proof of concept. I wanted to prove"
				+ " to myself that the simple idea of associating data to DOM elements would make sense written"
				+ " out in code form."
				, "DOM elements get bound to 'data path'. Paths can be explicitly updated"
				+ " which triggers the associated elements to update. "
				+ " Finally, DOM changes only occur when there is a difference in value."
				, "That was the general idea and after a few hours I had a working prototype."
				+ " Some complexity came when I moved passed simple elements and on to a select input. "
				, "Select inputs really are tied to two different points of data. The array of items, and the selected item."
				, "This presented an interesting challenge which gave me a better understanding of why different"
				+ " templating engines use moustache syntax and how they tackle repeatable items. "
				+ " So I settled on allowing multiple data point associations. For a select input to function"
				+ " there must be an array of items, and the selected item passed in. When either value changes the "
				+ " associated elements change as well."
				, "Conceivably there is no end to the number of associations for generating controls. But for "
				+ " simple elements like divs, and form inputs, all that is needed is one data point."
				, "See the syntax for handlebar like notation."
			]
			, Examples : [
				"&lt;div id=\"exampleArea\"&#x3e;\n\n// Standard simple notation\n{{ path.to.data }}\n//\n// for custom templates\n{{ data | TemplateName }}\n// \n// For multi data points\n{{ path.to.data, path.to.data || TemplateName }}\n//\n// for simple inputs\n&lt;input type=\"text\" data-bind=\"path.to.data\" /&#x3e;\n// \n// for customizing\n&lt;div data-bind=\"path.to.data\"&#x3e;&lt;/div&#x3e;\n//\n// currently all repeating, if needed, \n// should be handled through the template\n//\n//\n// to bind html\n&lt;/div&#x3e;\n\n&lt;script&#x3e;\nvar parentElement = document.getElementById(\"exampleArea\")\n  , data = { path : { to : {  data : \"hello world\"  } } }\n  , db = J.Constructors.DataBind( data ).autoBind( parentElement )\n&lt;/script&#x3e;"
			]
			, Source : [ "//github.com/jdog/dataBind" ]
			, Parent : [ "Constructors" ]
		}
		, {
			Name : "DataBind"
			, Usage : [
				, [ false, "var db = DataBind( object data )" ]
			]
			, Tags : [ "data binding" ]
			, Source : [ "//github.com/jdog/dataBind" ]
			, Parent : [ "Constructors" ]
			, Description : [
				"Base constructor for instantiating a new DataBind object. This library was written"
				+ " as a proof of concept for attaching data to DOM elements. It leverages the jDog"
				+ " exist library for resolving object property chains."
				
				, "There are two examples."
				+ " 1) is a test of speed for updating using this code:"
				+ " <a href='//jdog.github.io/dataBind/demo/index.html'>Demo1</a>."
				+ " and 2) for common dataBinding with example of how to build custom templates:"
				+ " <a href='//jdog.github.io/dataBind/demo/index2.html'>Demo2</a>."
			]
			, Examples : [ ]
			, Returns : "new DataBind object"
		}

		, {
			Name : "autoBind"
			, Usage : [
				[ false, "db.autoBind( HTMLElement element )" ]
			]
			, Tags : [ "data binding" ]
			, Source : [ "//github.com/jdog/dataBind" ]
			, Parent : [ "Constructors" ]
			, Description : "Higher level method for binding elements which contain data-bind attribute."
			, Examples : [
				"var data = {\n  helloWorld : \"magic\"\n  , fard : true\n}\n\nvar html = \"&lt;div&gt;\"\n+ \"&lt;span data-bind='helloWorld'&#x3e;&lt;/span&#x3e;\"\n+ \"&lt;span data-bind='fard'&#x3e;&lt;/span&#x3e;\"\n+ \"&lt;div&#x3e;\"\n\nvar element = document.querySelector(\"div\")\n  , db = DataBind(data)\n\nelement.innerHTML = html\n\ndb.autoBind( element )\n"
			]
			, Returns : "DataBind db"
		}

		, {
			Name : "update"
			, Usage : [
				[ false, "db.update()" ]
				, [ false, "db.update( string path )" ]
			]
			, Tags : [ "data binding" ]
			, Source : [ "//github.com/jdog/dataBind" ]
			, Parent : [ "Constructors" ]
			, Description : "Update all bound elements, or specific by data path."
			, Examples : [
				"var element = document.querySelector(\"div\")\n  , db = DataBind(data)\n\ndb.bind( element, \"helloWorld\" )\n\n// some ajax method that updates data object\najax.getNewSomething().then( db.update )"
				, "var element = document.querySelector(\"div\")\n  , db = DataBind(data)\n\ndb.bind( element, \"helloWorld\" )\n\n$.ajax({\n  url : \"/pathToUpdateData.php\"\n  , success : function(newData) {\n    data.helloWorld = newData.helloWorld\n    db.update(\"helloWorld\")\n  }\n})"
			]
			, Returns : "DataBind db"
		}

		, {
			Name : "findNodes"
			, Usage : [
				[ false, "db.findNodes( string html )" ]
				, [ false, "db.findNodes( HTMLElement element )" ]
			]
			, Tags : [ "data binding" ]
			, Source : [ "//github.com/jdog/dataBind" ]
			, Parent : [ "Constructors" ]
			, Description : "Use this code to pull out contentNodes from handlebar {{ }} text"
			+ " each handlebar will be inserted into a <var> tag with the data-bind property set"
			+ " this only transforms text into text, it does not deal with DOM yet"
			+ " that will be handled by another library"

			, Examples : [
				"var html = \"&lt;div&gt;\"\n+ \"{{helloWorld}}\"\n+ \"{{fard}}\"\n+ \"&lt;div&#x3e;\"\n\nvar db = DataBind(data)\ndb.findNodes( html )\n// returns \"&ltdiv&#x3e;&ltvar data-bind='helloWorld'&#x3e;&lt;/var&#x3e;&ltvar data-bind='fard'&#x3e;&lt;/var&#x3e;&lt;/div&#x3e;\""
				, "var html = \"&lt;div&gt;\"\n+ \"{{helloWorld,fard}}\"\n+ \"{{fard|BoolInput}}\"\n+ \"&lt;div&#x3e;\"\n\nvar db = DataBind(data)\ndb.findNodes( html )\n// returns \"&ltdiv&#x3e;&ltvar data-bind='helloWorld' data-source='helloWorld,fard'&#x3e;&lt;/var&#x3e;&ltvar data-bind='fard' data-template='BoolInput'&#x3e;&lt;/var&#x3e;&lt;/div&#x3e;\""
			]
			, Returns : "DataBind db"
		}

		, {
			Name : "bind"
			, Usage : [
				[ false, "db.bind( HTMLElement element, string path, object options )" ]
			]
			, Tags : [ "data binding" ]
			, Source : [ "//github.com/jdog/dataBind" ]
			, Parent : [ "Constructors" ]
			, Description : [
				"Low level method for directly binding elements with data within the"
				+ " instantiated DataBind object. Useful for calling manually."
			]
			, Examples : [
				"var data = {\n  helloWorld : \"magic\"\n}\n\nvar element = document.querySelector(\"div\")\n  , db = DataBind(data)\n\ndb.bind( element, \"helloWorld\" )\n"
			]
			, Returns : "DataBind db"
		}

		, {
			Name : "get"
			, Usage : [
				[ false, "db.get( string path, any defaultValue )" ]
			]
			, Tags : [ "data binding" ]
			, Source : [ "//github.com/jdog/dataBind" ]
			, Parent : [ "Constructors" ]
			, Description : "Get the value of the path within the data object."
			, Examples : [
				"db.get(\"Long.Path.of.Data.2.value\")\n// returns db.data.Long.Path.of.Data[2].value"
			]
			, Returns : "value of path within data object"
		}

		, {
			Name : "set"
			, Usage : [
				[ false, "db.set( string path, any newValue )" ]
				, [ false, "db.set( string path, any newValue, bool noUpdate )" ]
			]
			, Tags : [ "data binding" ]
			, Source : [ "//github.com/jdog/dataBind" ]
			, Parent : [ "Constructors" ]
			, Description : "Set the value of the path inside the data object. Pass a true as the third parameter to prevent all associated elements from being updated."
			, Examples : [
				"db.set(\"Long.Path.of.Data.2.value\", 5, true)\n// does not update\n\ndb.set(\"Long.Path.of.Data.1.value\", 4)\n// does update"
			]
			, Returns : "DataBind db"
		}

		, {
			Name : "getAll"
			, Usage : [
				[ false, "db.getAll( array pathArray )" ]
				, [ false, "db.getAll( array pathArray, object | array thing )" ]
				, [ false, "db.getAll( array pathArray, object | array thing, string type )" ]
			]
			, Tags : [ "data binding" ]
			, Source : [ "//github.com/jdog/dataBind" ]
			, Parent : [ "Constructors" ]
			, Description : "Internal method exposed in case it's useful. It gets all of the values or object references from the array of paths and stuffs them into the provided 'thing' or into an object by default."
			, Examples : [
			]
			, Returns : "thing, defaults to new object"
		}

		, {
			Name : "on"
			, Usage : [
				[ false, "db.on( string path, function function )" ]
			]
			, Tags : [ "data binding" ]
			, Source : [ "//github.com/jdog/dataBind" ]
			, Parent : [ "Constructors" ]
			, Description : "Adds function to array of functions that get called when the path is triggered. There are two types, those triggered through update() and those triggered through update('path'). No arguments are passed from these."
			, Examples : [ 
				"db.on(\"preUpdate\" , func)   // db.update()\ndb.on(\"update\"    , func2)  // db.update()\ndb.on(\"postUpdate\", func3)  // db.update()\ndb.on(\"helloWorld\", func4)  // db.update(\"helloWorld\")"
			]
			, Returns : "DataBind db"
		}

		, {
			Name : "trigger"
			, Usage : [
				[ false, "db.trigger( string path, any args+ )" ]
			]
			, Tags : [ "data binding" ]
			, Source : [ "//github.com/jdog/dataBind" ]
			, Parent : [ "Constructors" ]
			, Description : "Triggers the array of functions to fire with the given arguments passed in."
			, Examples : [ ]
			, Returns : "DataBind db"
		}

	]

})
