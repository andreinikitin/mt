import { storage } from 'utils/storage'
import { data } from 'utils/data'
import {
  appendSkeleton,
  replaceSkeletonWithCards,
  toggleSubmitDisabled,
  selectors as sel,
} from 'utils/dom'

const DROPDOWN_CLASS_TOGGLE = 'dropdown_open'
const DROPDOWN_CLASS_ITEM = 'dropdown__item'
const CHECKBOX_CLASS_ITEM = 'seasons__button'

export const dropdownHandler = () => {
  let open = false

  const addClassOpen = () => {
    sel.dropdownNode.classList.add(DROPDOWN_CLASS_TOGGLE)
    open = true
  }

  const removeClassOpen = () => {
    sel.dropdownNode.classList.remove(DROPDOWN_CLASS_TOGGLE)
    open = false
  }

  const toggleOpen = (e) => {
    if (sel.seasonsParentNode.contains(e.target)) {
      if (e.target.classList.contains(CHECKBOX_CLASS_ITEM)) {
        toggleSubmitDisabled(false)
        e.stopPropagation()
        return
      }
    }
    if (!sel.dropdownNode.contains(e.target)) {
      if (open) {
        removeClassOpen()
      }
      return
    }

    e.stopPropagation()
    if (open) {
      if (e.target.classList.contains(DROPDOWN_CLASS_ITEM)) {
        if (sel.statusValueNode.innerHTML !== e.target.innerHTML) {
          sel.statusValueNode.innerHTML = e.target.innerHTML
          toggleSubmitDisabled(false)
        }
      }

      removeClassOpen()
      open = false
    } else {
      addClassOpen()
      open = true
    }
  }

  window.addEventListener('click', toggleOpen)
}

export const handleOnSubmit = (e) => {
  const status = sel.statusValueNode.innerHTML
  const seasons = Array.from(sel.seasonsNode)
    .filter((node) => Boolean(node.checked))
    .map((node) => node.value)

  e.stopPropagation()
  const { status: prevStatus, seasons: prevSeasons } = storage.getData()

  const isStatusEqual = prevStatus === status
  const isSeasonsEqual = seasons.toString() === prevSeasons.toString()
  if (isStatusEqual && isSeasonsEqual) {
    return
  }

  toggleSubmitDisabled(true)
  storage.saveData({ status, seasons })
  data.reset()
  sel.contentNode.innerHTML = ''
  appendSkeleton()
  data.fetchData().then((data) => {
    replaceSkeletonWithCards(data)
  })
}

export const form = () => {
  dropdownHandler()

  sel.submitNode.addEventListener('click', handleOnSubmit)
}
