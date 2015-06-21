
#bind



```javascript
J.bind(HTMLElement element, string path, object options) 
```
Low level method for directly binding elements with data within the instantiated DataBind object. Useful for calling manually.


####Returns:
DataBind db

####Examples:

```javascript
var data = {
  helloWorld : "magic"
}
// undefined
var db = J.Constructors.DataBind(data)
// undefined
db.bind( document.querySelector("div"), "helloWorld" )
// DataBind.Dog {data: Object, paths: Object, lastValue: Object, bind: function, autoBind: function…}data: ObjectlastValue: Objectpaths: Object__proto__: DataBind.Dog

```
