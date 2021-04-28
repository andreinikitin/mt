const saveData = ({ seasons, status }) => {
  localStorage.setItem('seasons', JSON.stringify(seasons))
  localStorage.setItem('status', status)
}

const getData = () => {
  let seasons
  try {
    seasons = JSON.parse(localStorage.getItem('seasons'))
  } catch (err) {
    console.error(err)
  }

  return ({
    seasons: seasons,
    status: localStorage.getItem('status'),
  })
}

export const storage = (() => {
  let { seasons, status } = getData()
  if (!Array.isArray(seasons)) {
    seasons = ['1', '2', '3', '4', '5']
  }

  if (!status) {
    status = 'Alive'
  }

  saveData({ status, seasons })
  return {
    saveData,
    getData,
  }
})()
