if (!Array.prototype.fill) {
  Object.defineProperty(Array.prototype, 'fill', {
    value: function(value) {

      // Шаги 1-2.
      if (this == null) {
        throw new TypeError('this is null or not defined')
      }

      var O = Object(this)

      // Шаги 3-5.
      var len = O.length >>> 0

      // Шаги 6-7.
      var start = arguments[1]
      var relativeStart = start >> 0

      // Шаг 8.
      var k = relativeStart < 0 ?
        Math.max(len + relativeStart, 0) :
        Math.min(relativeStart, len)

      // Шаги 9-10.
      var end = arguments[2]
      var relativeEnd = end === undefined ?
        len : end >> 0

      // Шаг 11.
      var final = relativeEnd < 0 ?
        Math.max(len + relativeEnd, 0) :
        Math.min(relativeEnd, len)

      // Шаг 12.
      while (k < final) {
        O[k] = value
        k++
      }

      // Шаг 13.
      return O
    },
  })
}
