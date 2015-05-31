J.addWait(
	"Templates.Select"
	, [ "Constructors.DataBind" ]
	, function (ref) {

		return function Select (parent_element, data) {

			/* build out an item that exists in a loop */
			function buildItem(index, item) {

				var wrap = document.createElement("option")

				if (item.Selected)
					wrap.setAttribute("selected", "selected")

				wrap.innerHTML = item.Display
				wrap.setAttribute("value", item.Id)

				return wrap
			}

			function events(select) {
				var db = ref.DataBind(data)

				select.onchange = function(event) {
					value = event.target.value

					for (var x = 0; x < data.length; x++) {
						if (data[x].Id == value)
							data[x].Selected = true
						else
							data[x].Selected = false
					}

					db.update()

				}
			}

			/* loop the data */
			function init() {

				// clear it out
				parent_element.innerHTML = ""

				var select = document.createElement("select")

				for (var x = 0; x < data.length; x++)
					select.appendChild(buildItem(x, data[x], data))

				events(select)

				parent_element.appendChild(select)
			}

			ref.DataBind(data).onUpdate(init)

			init()

		}

})
