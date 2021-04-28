function Promise(fn) {
  if (!(this instanceof Promise)) {
    throw new TypeError('Promises must be constructed via new')
  }

  if (typeof fn !== 'function') {
    throw new TypeError('not a function')
  }

  this.thenHandlers = []
  this.catchHandlers = []
  this.isResolved = false
  this.isRejected = false

  setTimeout(() => {
    try {
      fn(this.applyResolve.bind(this), this.applyReject.bind(this))
    } catch(e) {
      this.applyReject(e)
    }
  })
}

Promise.prototype = {
  applyResolve: function(...arg) {
    for (let i = 0, len = this.thenHandlers.length; i < len; i++) {
      this.thenHandlers[i](...arg)
    }
    this.isResolved = true
  },

  applyReject: function() {
    for (let i = 0, len = this.catchHandlers.length; i < len; i++) {
      this.catchHandlers[i](arguments)
    }
    this.isRejected = true
  },

  then: function(handler) {
    if (this.isResolved) {
      handler()
    } else {
      this.thenHandlers.push(handler)
    }

    return this
  },

  catch: function(handler) {
    if (this.isRejected) {
      handler()
    } else {
      this.catchHandlers.push(handler)
    }

    return this
  },
}

if (typeof window.Promise !== 'function') {
  window.Promise = Promise
}
