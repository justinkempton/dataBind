J.extend( function( puppy, dog ) {

	dog.spawn = dog.add
	dog.batchWaitRef = dog.wait
	dog.add$ = dog.add
	dog.loadScript = dog.loadStyle = dog.load

	window.jDog = window.PAGE = puppy

	/*
	dog.spawn = function() {
		var args = arguments
		window.console && console.trace("Use of depricated function, spawn, use add instead")
		return dog.add.apply(this, args)
	}


	dog.batchWaitRef = function() {
		var args = arguments
		window.console && console.trace("Use of depricated function, batchWaitRef, use wait instead")
		return dog.wait.apply(this, args)
	}


	dog.add$ = function() {
		var args = arguments
		window.console && console.trace("Use of depricated function, add$, use add instead")
		return dog.add.apply(this, args)
	}
	*/

})
