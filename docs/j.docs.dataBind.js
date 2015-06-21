J.add("Docs.DataBind", {

	jDog : "version 3.*"
	, Methods : [

		{
		Name : "bind"
		, Usage : [
			[ "HTMLElement element", "string path", "object options" ]
		]
		, Tags : [ "data binding" ]
		, Source : [ "j.constructors.dataBind.js" ]
		, Parent : [ "Constructors" ]
		, Description : "Low level method for directly binding elements with data within the instantiated DataBind object. Useful for calling manually."
		, Examples : [
			"var data = {\n  helloWorld : \"magic\"\n}\n// undefined\nvar db = J.Constructors.DataBind(data)\n// undefined\ndb.bind( document.querySelector(\"div\"), \"helloWorld\" )\n// DataBind.Dog {data: Object, paths: Object, lastValue: Object, bind: function, autoBind: function…}data: ObjectlastValue: Objectpaths: Object__proto__: DataBind.Dog"
		]
		, Returns : "DataBind db"
	}

	]

})
