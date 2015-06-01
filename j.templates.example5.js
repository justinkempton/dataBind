J.addWait(
	"Templates.Example5"
	, [ "Constructors.DataBind" ]
	, function (ref) {

		return function Example5 (parent_element, data) {

			/* build out an item that exists in a loop */
			function buildItem(index, item, data) {

				var wrap = document.createElement("div")
					, db = ref.DataBind(item)

				wrap.innerHTML = "" 
				+ "<div>"
				+ "	<span data-bind='FirstName'></span>,"
				+ "	<span data-bind='LastName'></span>"
				+ "</div>"

				db.bind( wrap.querySelector("span[data-bind='FirstName']") )
				db.bind( wrap.querySelector("span[data-bind='LastName']") )

				return wrap.firstChild
			}

			/* loop the data */
			function init() {
				parent_element.innerHTML = ""
				for (var x = 0; x < data.length; x++)
					parent_element.appendChild(buildItem(x, data[x], data))
			}

			init()

		}

})
