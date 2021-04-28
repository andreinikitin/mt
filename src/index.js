import 'polyfills/promise'
import 'polyfills/array.from'
import 'polyfills/array.fill'
import 'polyfills/innerSVG'

import { renderChart } from 'lineChart'
import { data } from 'utils/data'
import { throttle } from 'utils/throttle'
import {
  appendSkeleton,
  replaceSkeletonWithCards,
  hasReachedBottom,
} from 'utils/dom'
import { form } from 'form'
import { bootstrap } from 'bootstrap'

import 'css/index.less'

const fetchDataOnScroll = () => {
  appendSkeleton()
  data.fetchData().then((data) => {
    replaceSkeletonWithCards(data)
  }).catch((err) => {
    console.error(err)
  })
}

document.addEventListener('DOMContentLoaded', () => {
  bootstrap()
  renderChart(
    [26, 36, 40, 27, 27],
    [1, 2, 3, 4, 5],
  )

  let scroll = 0
  const handleOnScroll = () => {
    const reachedEnd = data.getReachedEnd()
    if (reachedEnd) {
      return
    }

    let [scrollEnd, actualWindowBottom] = hasReachedBottom()
    if (scrollEnd && (actualWindowBottom > scroll)) {
      fetchDataOnScroll()
    }

    scroll = actualWindowBottom
  }

  form()
  window.addEventListener('scroll', throttle(handleOnScroll, 200))
})
