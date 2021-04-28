import { fetch } from 'utils/fetch'
import { storage } from 'utils/storage'

const filterByAppearance = (first = [], second = []) => {
  const a = Array.from(first)
  const b = Array.from(second)
  const result = []
  while (a.length > 0 && b.length > 0) {
    if (a[0] < b[0]) {
      a.shift()
    } else if (a[0] > b[0]) {
      b.shift()
    } else {
      result.push(a.shift())
      b.shift()
    }
  }
  return Boolean(result.length)
}

export const normalizeData = (item) => ({
  name: item.name,
  imageSrc: item.img,
  data: [
    {
      title: 'Nickname',
      value: item.nickname,
    },
    {
      title: 'Portrayed',
      value: item.portrayed,
    },
    {
      title: 'status',
      value: item.status,
    },
    {
      title: 'Occupation',
      value: item.occupation.toString(),
    },
    {
      title: 'Appearance',
      value: item.appearance.toString(),
    },
  ],
})

export const data = (() => {
  let limit = 20
  let offset = 0
  let reachedEnd = false
  let pending = false

  const fetchData = () => {
    return new Promise((resolve, reject) => {
      if (reachedEnd) {
        resolve([])
        return
      }

      if (pending) {
        return
      }

      pending = true
      fetch(limit, offset).then((data) => {
        const { status, seasons } = storage.getData()
        offset += limit

        if (!data.length || data.length < limit) {
          reachedEnd = true
        }
        pending = false

        const filteredData = []
        for (let i = 0, len = data.length; i < len; i++) {
          const item = data[i]
          const byStatus = item.status === status
          const bySeasons = filterByAppearance(seasons, item.appearance)

          if (byStatus && bySeasons) {
            filteredData.push(normalizeData(item))
          }
        }

        resolve(filteredData)
      }).catch((err) => {
        reject(err)
      })
    })
  }

  const reset = () => {
    limit = 20
    offset = 0
    reachedEnd = false
    pending = false
  }

  const getReachedEnd = () => reachedEnd

  return {
    fetchData,
    reset,
    getReachedEnd,
  }
})()
