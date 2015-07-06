
#About DataBind

Simple and efficient two way data-binding library for front end javascript.
DOM elements get bound to properties of the dataBind object. When the data  is updated, either by using set or calling update  the associated DOM elements bound to that path get updated. Finally, DOM changes only occur when there is a difference in value.
 This library relies on jDog library, but can be easily modified to be standalone.


####Examples:

```javascript
<div id="exampleArea">

// Standard simple notation
{{ path.to.data }}
//
// for custom templates
{{ data | TemplateName }}
// 
// For multi data points
{{ path.to.data, path.to.data | TemplateName }}
//
// for simple inputs
<input type="text" data-bind="path.to.data" />
// 
// for customizing
<div data-bind="path.to.data"></div>
//
// currently all repeating, if needed, 
// should be handled through the template

</div>

<script>

// to bind html
var parentElement = document.getElementById("exampleArea")
  , data = { path : { to : {  data : "hello world"  } } }
  , db = J.Constructors.DataBind( data ).autoBind( parentElement )

</script>

```

#DataBind



```javascript
var db = DataBind( object data )
```
Base constructor for instantiating a new DataBind object. This library was written as a proof of concept for attaching data to DOM elements. It leverages the jDog exist library for resolving object property chains.
There are two examples. 1) is a test of speed for updating using this code: <a href='//jdog.github.io/dataBind/demo/index.html'>Demo1</a>. and 2) for common dataBinding with example of how to build custom templates: <a href='//jdog.github.io/dataBind/demo/index2.html'>Demo2</a>.


####Returns:
new DataBind object

####Examples:

```javascript
```

#autoBind



```javascript
db.autoBind( HTMLElement element )
```
Higher level method for binding either sub elements which contain data-bind attribute or  special 'handlebar' tags that exist inside the element.


####Returns:
DataBind db

####Examples:

```javascript
var data = {
  helloWorld : "magic"
  , fard : true
}

var html = "<div>"
+ "<span data-bind='helloWorld'></span>"
+ "<span data-bind='fard'></span>"
+ "<div>"

var element = document.querySelector("div")
  , db = DataBind(data)

element.innerHTML = html

db.autoBind( element )


```

#update



```javascript
db.update()
db.update( string path )
```
Update all bound elements, or specific by data path.


####Returns:
DataBind db

####Examples:

```javascript
var element = document.querySelector("div")
  , db = DataBind(data)

db.bind( element, "helloWorld" )

// some ajax method that updates data object
ajax.getNewSomething().then( db.update )

var element = document.querySelector("div")
  , db = DataBind(data)

db.bind( element, "helloWorld" )

$.ajax({
  url : "/pathToUpdateData.php"
  , success : function(newData) {
    data.helloWorld = newData.helloWorld
    db.update("helloWorld")
  }
})

```

#findNodes



```javascript
db.findNodes( string html )
db.findNodes( HTMLElement element )
```
Use this code to pull out contentNodes from handlebar {{ }} text each handlebar will be inserted into a <var> tag with the data-bind property set this only transforms text into text, it does not deal with DOM yet that will be handled by another library


####Returns:
HTMLElement element, or string html

####Examples:

```javascript
var html = "<div>"
+ "{{helloWorld}}"
+ "{{fard}}"
+ "<div>"

var db = DataBind(data)
db.findNodes( html )
// returns "&ltdiv>&ltvar data-bind='helloWorld'></var>&ltvar data-bind='fard'></var></div>"

var html = "<div>"
+ "{{helloWorld,fard}}"
+ "{{fard|BoolInput}}"
+ "<div>"

var db = DataBind(data)
db.findNodes( html )
// returns "&ltdiv>&ltvar data-bind='helloWorld' data-source='helloWorld,fard'></var>&ltvar data-bind='fard' data-template='BoolInput'></var></div>"

```

#bind



```javascript
db.bind( HTMLElement element, string path, object options )
```
Low level method for directly binding elements with data within the instantiated DataBind object. Useful for calling manually.


####Returns:
DataBind db

####Examples:

```javascript
var data = {
  helloWorld : "magic"
}

var element = document.querySelector("div")
  , db = DataBind(data)

db.bind( element, "helloWorld" )


```

#get



```javascript
db.get( string path, any defaultValue )
```
Get the value of the path within the data object.


####Returns:
value of path within data object

####Examples:

```javascript
db.get("Long.Path.of.Data.2.value")
// returns db.data.Long.Path.of.Data[2].value

```

#set



```javascript
db.set( string path, any newValue )
db.set( string path, any newValue, bool noUpdate )
```
Set the value of the path inside the data object. Pass a true as the third parameter to prevent all associated elements from being updated.


####Returns:
DataBind db

####Examples:

```javascript
db.set("Long.Path.of.Data.2.value", 5, true)
// does not update

db.set("Long.Path.of.Data.1.value", 4)
// does update

```

#getAll



```javascript
db.getAll( array pathArray )
db.getAll( array pathArray, object | array thing )
db.getAll( array pathArray, object | array thing, string type )
```
Internal method exposed in case it's useful. It gets all of the values or object references from the array of paths and stuffs them into the provided 'thing' or into an object by default.


####Returns:
thing, defaults to new object

####Examples:

```javascript
```

#on



```javascript
db.on( string path, function function )
```
Adds function to array of functions that get called when the path is triggered. There are two types, those triggered through update() and those triggered through update('path'). No arguments are passed from these.


####Returns:
DataBind db

####Examples:

```javascript
db.on("preUpdate" , func)   // db.update()
db.on("update"    , func2)  // db.update()
db.on("postUpdate", func3)  // db.update()
db.on("helloWorld", func4)  // db.update("helloWorld")

```

#trigger



```javascript
db.trigger( string path, any args+ )
```
Triggers the array of functions to fire with the given arguments passed in.


####Returns:
DataBind db

####Examples:

```javascript
```
