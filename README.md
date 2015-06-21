
#DataBind



```javascript
var db = DataBind( object data )
```
Base constructor for instantiating a new DataBind object.


####Returns:
new DataBind object

####Examples:

```javascript
```

#autoBind



```javascript
db.autoBind( HTMLElement element )
```
Higher level method for binding elements which contain data-bind attribute.


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
Use this code to pull out contenetNodes from handlebar {{ }} texteach handlebar will be inserted into a <var> tag with the data-bind property setthis only transforms text into text, it does not deal with DOM yetthat will be handled by another library


####Returns:
DataBind db

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
