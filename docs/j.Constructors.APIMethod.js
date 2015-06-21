J.add(
	"Constructors.APIMethod"
	, function(e_parent, data, options) {

	// tried applying Rainbow to code examples but kept getting null ref error for Replacement.replace
	// decided to go my own way, though it was a very promissing library

	var dog = {
		e_parent : e_parent
		, e_methods : document.createElement("div")
		, data : data
		, options : options
	}
	, ref = dog.ref = { }

	function buildExample(example) {
		var source = ref.ColorizeCode(example).Source
		return "<div class='Example'>" + source + "</div>"
	}

	function buildExamples(examples) {
		var html = ""
	
		for (var x in examples)
			html += buildExample(examples[x])

		return html
	}

	function buildDefinitions(definitions) {
		var html = ""
	
		for (var x in definitions) {
			html += "<dt>" + x + "</dt>"
			html += "<dd>" + definitions[x] + "</dd>"
		}

		return html
	}

	function buildUsage(usage) {
		var html = ""
		for (var x in usage) {
			html += "<div>"
			if (usage[x][0] === false) {
				html += usage[x][1]
			} else {
				html += "J."
				html += dog.data.Name
				html += "("
				html += usage[x].length ? usage[x].join(", ") : ""
				html += ") "
			}
			html += "</div>"
		}
		return html
	}

	function build() {
		var html = ""
			, data = dog.data 

		html += "<div class='Title'>"
		html += "<a href='#' title='To Top' class='link linkBack'>⌅</a>"
		html += "<span class='Tags'>"
		html += data.Tags ? data.Tags.length ? data.Tags.join(", ") : "" : ""
		html += "</span>"
		html += "<a name='" + data.Name + "' href='#" + data.Name + "' class='link' title='Link to Here'>§</a>"
		html += data.Name
		html += "</div>"

		html += "<div class='Guts'>"
		html += "<div class='Source'>"
		html += "Source: "
		html += data.Source ? data.Source.join(", ") : ""
		html += "</div>"

		if (data.Description) {
			html += "<div class='Description'>"
			html += "<div class='Label'>Description:</div>"

			if (PAGE.getType(data.Description) === "Arr") {
				;(function(desc) {

					for (var x in desc) {
						html += "<p>"
						html += desc[x]
						html += "</p>"
					}

				}(data.Description))
			} else {
				html += "<p>" + data.Description + "</p>"
			}

			html += "</div>"
		}

		if (data.Usage) {
			html += "<div class='Usage'>"
			html += "<div class='Label'>Usage:</div>"
			html += buildUsage(data.Usage)
			html += "</div>"
		}

		if (data.Definitions) {
			html += "<div class='Label'>Definitions:</div>"
			html += "<dl class='Definitions'>"
			html += buildDefinitions(data.Definitions)
			html += "</dl>"
		}

		if (data.Returns) {
			html += "<div class='Returns'>"
			html += "<div class='Label'>Returns:</div>"
			html += data.Returns
			html += "</div>"
		}

		if (data.Examples) {
			html += "<div class='Examples'>"
			html += "<div class='Label'>Examples:</div>"
			html += buildExamples(data.Examples)
			html += "</div>"
		}

		html += "</div>"

		dog.e_methods.innerHTML = html
		dog.e_methods.id = data.Name

		if (dog.e_parent)
			dog.e_parent.appendChild(dog.e_methods)

	}

	PAGE.wait(
		"Constructors.ColorizeCode"
		, ref
		, build)

	return dog

})
