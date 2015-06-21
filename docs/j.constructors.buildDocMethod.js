// this is for building out README files
J.add(
	"Constructors.BuildDocMethod"
	, function(data, options) {

	// tried applying Rainbow to code examples but kept getting null ref error for Replacement.replace
	// decided to go my own way, though it was a very promissing library

	var dog = {
		e_methods : ""
		, data : data
		, options : options
	}
	, ref = dog.ref = { }

	function buildExamples(examples) {
		var html = ""
	
		for (var x in examples)
			html += "\n" + examples[x] + "\n"

		return html
	}

	function buildDefinitions(definitions) {
		var html = ""
	
		for (var x in definitions) {
			html += "- *" + x + "* : "
			html += definitions[x] + "\n"
		}

		return html
	}

	function buildUsage(usage) {
		var html = ""
		for (var x in usage) {
			if (usage[x][0] === false) {
				html += usage[x][1]
			} else {
				html += "J."
				html += dog.data.Name
				html += "("
				html += usage[x].length ? usage[x].join(", ") : ""
				html += ") "
			}
			html += "\n"
		}
		return html
	}

	function cleanDescription(description) {
		return description
			.replace("</h4>", "\n")
			.replace("<h4>", "\n#####")
			.replace("</code>", "`\n")
			.replace("<code>", "`")
	}

	function build() {
		var html = ""
			, data = dog.data 

		html += "\n#" + data.Name

		// html += "\n\n###"
		// html += data.Tags ? data.Tags.length ? data.Tags.join(", ") : "" : ""

		// html += "\n"
		// html += "\n\n###Source:\n"
		// html += data.Source ? data.Source.join(", ") : ""
		// html += "\n"

		if (data.Description) {
			html += "\n\n"

			if (data.Usage) {
				html += "\n\n"
				html += "```javascript\n"
				html += buildUsage(data.Usage)
				html += "```\n"
			}

			if (J.getType(data.Description) === "Arr") {
				;(function(desc) {

					for (var x in desc) {
						html += cleanDescription(desc[x])
						html += "\n"
					}

				}(data.Description))
			} else {
				html += cleanDescription(data.Description) + "\n"
			}
		}

		if (data.Definitions) {
			html += "\n\n####Definitions:\n"
			html += buildDefinitions(data.Definitions)
		}

		if (data.Returns) {
			html += "\n\n####Returns:\n"
			html += data.Returns
		}

		if (data.Examples) {
			html += "\n\n####Examples:\n"
			html += "\n```javascript"
			html += buildExamples(data.Examples)
			html += "\n```\n"
		}

		return html

	}

	return build()

})
