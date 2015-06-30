var fs = require("fs")
	, text = ""

var J = require("./jdog.small.js") // creates global J
require("./j.constructors.buildDocMethod.js")
require("./j.docs.dataBind.js")

for (var x in J.Docs) 
	createSection(x)

text = text.replace(/&lt;/g, "<")

function createSection(path) {
	var data = J.Docs[path]
	data.Methods.forEach(build)
}

function build(item, index, arr) {
	text += J.Constructors.BuildDocMethod(item)
}

fs.writeFileSync("../README.md", text)
