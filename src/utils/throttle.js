export const throttle = (cb, delay) => {
  // eslint-disable-next-line no-unused-vars
  let fired,
    args,
    self

  return function wrapper() {
    args = arguments
    self = this

    cb.apply(this, arguments)
    fired = true

    setTimeout(function() {
      fired = false
      if (args) {
        wrapper.apply(self, args)
        args = self = null
      }
    }, delay)
  }
}
