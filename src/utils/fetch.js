export const fetch = (() => {
  return (limit = 10, offset = 0) => {
    return new Promise(function(resolve, reject) {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', `https://www.breakingbadapi.com/api/characters?limit=${limit}&offset=${offset}`)
      xhr.responseType = 'json'
      xhr.onload = function() {
        if (this.status >= 200 && this.status < 300) {
          let expectedResult = xhr.response
          if (typeof expectedResult === 'string') {
            try {
              expectedResult = JSON.parse(expectedResult)
            } catch(e) {
              expectedResult = []
            }
          }

          resolve(expectedResult)
        } else {
          reject({
            status: this.status,
            statusText: xhr.statusText,
          })
        }
      }
      xhr.onerror = function() {
        reject({
          status: this.status,
          statusText: xhr.statusText,
        })
      }
      xhr.send()
    })
  }
})()
