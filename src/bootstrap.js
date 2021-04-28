import { storage } from 'utils/storage'
import { data } from 'utils/data'
import { selectors as sel } from 'utils/dom'
import { replaceWithCards } from 'utils/dom'

export const bootstrap = () => {
  const { status, seasons } = storage.getData()

  sel.statusValueNode.innerHTML = status
  Array.from(sel.seasonsNode).forEach((node) => {
    if (~seasons.indexOf(node.value)) {
      node.checked = true
    }
  })

  data.fetchData().then((res) => {
    replaceWithCards(res)
  }).catch((err) => {
    console.error(err)
  })
}
