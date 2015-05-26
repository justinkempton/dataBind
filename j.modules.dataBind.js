J.addWait(
	"Modules.dataBind"
	, [ "Constructors.DataBind" ]	
	, function(ref) {
		var dog = ref.DataBind()

		dog.set("example1Data", "hello world")
		dog.set("example2Data", "hello world 2")

		dog.set("SampleData.People", [
			{
				FirstName : "John"
				, LastName : "Frank"
			}
			, {
				FirstName : "George"
				, LastName : "Beans"
			}
			, {
				FirstName : "Oliver"
				, LastName : "Lloyd"
			}
		])

		return dog
	})
