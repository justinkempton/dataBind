/* Example of primitive version */
J.addWait(
	"Modules.dataBindExample3"
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


			, Example2 : { 
				selected_people : 123
				, people : [
					{
						FirstName : "Justin"
						, LastName : "Kempton"
						, Address : "Venice, CA"
						, MemberId : 123
					}
					, {
						FirstName : "Jack"
						, LastName : "Cornfield"
						, Address : "San Francisco, CA"
						, MemberId : 293
					}
					, {
						FirstName : "Douglas"
						, LastName : "Adams"
						, Address : "Heaven"
						, MemberId : 3091
					}
				]
			}

		}

		// compose values from two data points
		function composePeople() {
			data.Example2.people.forEach(function(person) {

				// select needs two things
				// 1) Display, the option will display this way
				// 2) Id, the option will have this value
				person.Display = person.FirstName + " " + person.LastName
				person.Id = person.MemberId

				// Compose a modified Model based on the selected_people value
				if (person.Id === Number(data.Example2.selected_people))
					person.Selected = true
				else
					person.Selected = false

			})
		}

		composePeople()

		var dog = {
			e : e
			,	db : ref.DataBind(data)
						 .autoBind( e.figureThisOut )
						 .autoBind( e.inputs )
						 .on( "preUpdate", composePeople )
		}

		return dog

})
