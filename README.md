
#About DataBind

The following code was created over a long weekend as a proof of concept. I wanted to prove to myself that the simple idea of associating data to DOM elements would make sense written out in code form.
DOM elements get bound to 'data path'. Paths can be explicitly updated which triggers the associated elements to update.  Finally, DOM changes only occur when there is a difference in value.
That was the general idea and after a few hours I had a working prototype. Some complexity came when I moved passed simple elements and on to a select input. 
Select inputs really are tied to two different points of data. The array of items, and the selected item.
This presented an interesting challenge which gave me a better understanding of why different templating engines use moustache syntax and how they tackle repeatable items.  So I settled on allowing multiple data point associations. For a select input to function there must be an array of items, and the selected item passed in. When either value changes the  associated elements change as well.
Conceivably there is no end to the number of associations for generating controls. But for  simple elements like divs, and form inputs, all that is needed is one data point.
See the syntax for handlebar like notation.


####Examples:

```javascript
&lt;div id="exampleArea"&#x3e;

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
&lt;input type="text" data-bind="path.to.data" /&#x3e;
// 
// for customizing
&lt;div data-bind="path.to.data"&#x3e;&lt;/div&#x3e;
//
// currently all repeating, if needed, 
// should be handled through the template

&lt;/div&#x3e;

&lt;script&#x3e;

// to bind html
var parentElement = document.getElementById("exampleArea")
  , data = { path : { to : {  data : "hello world"  } } }
  , db = J.Constructors.DataBind( data ).autoBind( parentElement )

&lt;/script&#x3e;

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

var html = "&lt;div&gt;"
+ "&lt;span data-bind='helloWorld'&#x3e;&lt;/span&#x3e;"
+ "&lt;span data-bind='fard'&#x3e;&lt;/span&#x3e;"
+ "&lt;div&#x3e;"

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
var html = "&lt;div&gt;"
+ "{{helloWorld}}"
+ "{{fard}}"
+ "&lt;div&#x3e;"

var db = DataBind(data)
db.findNodes( html )
// returns "&ltdiv&#x3e;&ltvar data-bind='helloWorld'&#x3e;&lt;/var&#x3e;&ltvar data-bind='fard'&#x3e;&lt;/var&#x3e;&lt;/div&#x3e;"

var html = "&lt;div&gt;"
+ "{{helloWorld,fard}}"
+ "{{fard|BoolInput}}"
+ "&lt;div&#x3e;"

var db = DataBind(data)
db.findNodes( html )
// returns "&ltdiv&#x3e;&ltvar data-bind='helloWorld' data-source='helloWorld,fard'&#x3e;&lt;/var&#x3e;&ltvar data-bind='fard' data-template='BoolInput'&#x3e;&lt;/var&#x3e;&lt;/div&#x3e;"

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
