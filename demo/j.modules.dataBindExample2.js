/* Example of primitive version */
J.addWait(
	"Modules.dataBindExample2"
	, [
			"Constructors.DataBind"
			, "DomContentLoaded" 
	]
	, function dataBindExample_factory(ref) {

		var e = {
			figureThisOut : document.getElementById("figureThisOut")
			, inputs : document.getElementById("inputs")
		}

		var data = {
			random1 : "hello world"
			, random2 : "Jack"
			, random3 : "Data Binding"
			, random4 : "The Humans"
			, random5 : "Crack"
			, random6 : "Babies"
			, random7 : "Adults"
			, people : [
				{
					FirstName : "Justin"
					, LastName : "Kempton"
					, Address : "Venice, CA"
					, Id : 1
					, Display : "Justin Kempton"
					, Selected : false
				}
				, {
					FirstName : "Jack"
					, LastName : "Cornfield"
					, Address : "San Francisco, CA"
					, Id : 2
					, Display : "Jack Cornfield"
					, Selected : true
				}
				, {
					FirstName : "Douglas"
					, LastName : "Adams"
					, Address : "Heaven"
					, Id : 3
					, Display : "Douglas Adams"
					, Selected : false
				}
			]
		}

		var dog = {
			e : e
			,	db : ref.DataBind(data)
						 .autoBind( e.figureThisOut )
						 .autoBind( e.inputs )
		}

		return dog

})
