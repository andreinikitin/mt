const chartNode = document.querySelector('#chartData')
const submitNode = document.querySelector('#submit')
const seasonsParentNode = document.querySelector('#seasons')
const seasonsNode = document.querySelectorAll('input[type=checkbox]')
const statusValueNode = document.querySelector('#statusValue')
const dropdownNode = document.querySelector('.dropdown')
const contentNode = document.querySelector('#content')
const skeletonNodes = document.getElementsByClassName('main__item-skeleton')

export const selectors = {
  chartNode,
  submitNode,
  seasonsParentNode,
  seasonsNode,
  statusValueNode,
  dropdownNode,
  contentNode,
  skeletonNodes,
}

export const templateCard = ({
  name,
  imageSrc,
  data = [],
}) => `
    <div class="card">
      <div class="card__title">${name}</div>
      <div class="card__image">
        <img
            class="card__img"
            src="${imageSrc}"
            alt="${name}"
        />
      </div>
      <div class="card__data">
        ${data.map((item) => `
          <div class="card__item">
            <div class="card__subtitle">${item.title}</div>
            <div class="card__text">${item.value}</div>
          </div>
        `).join('')}
      </div>
    </div>
`

export const templateCardSkeleton = () => `
  <div class="cardSkeleton">
    <div class="cardSkeleton__title"></div>
    <div class="cardSkeleton__image"></div>
    <div class="cardSkeleton__data">
      <div class="cardSkeleton__item">
        <div class="cardSkeleton__subtitle"></div>
        <div class="cardSkeleton__text"></div>
      </div>
      <div class="cardSkeleton__item">
        <div class="cardSkeleton__subtitle"></div>
        <div class="cardSkeleton__text"></div>
      </div>
      <div class="cardSkeleton__item">
        <div class="cardSkeleton__subtitle"></div>
        <div class="cardSkeleton__text"></div>
      </div>
    </div>
  </div>
`

export const appendSkeleton = (count = 10) => {
  let fragment = document.createDocumentFragment()
  new Array(count).fill(true).map(() => {
    const div = document.createElement('div')
    div.className = 'main__item main__item-skeleton'
    div.innerHTML = templateCardSkeleton()
    fragment.appendChild(div)
  })

  selectors.contentNode.appendChild(fragment)
}

export const replaceWithCards = (data) => {
  const html = Array.from(data).map((item) => {
    return `<div class="main__item">${templateCard(item)}</div>`
  })
  selectors.contentNode.innerHTML = html.join('')
}

export const replaceSkeletonWithCards = (data) => {
  let fragment = document.createDocumentFragment()
  data.map((item) => {
    const div = document.createElement('div')
    div.className = 'main__item'
    div.innerHTML = templateCard(item)
    fragment.appendChild(div)
  })

  Array.from(selectors.skeletonNodes).map((node) => node.parentNode.removeChild(node))
  selectors.contentNode.appendChild(fragment)
}

export const hasReachedBottom = () => {
  const actualWindowBottom = window.pageYOffset + window.innerHeight
  const scrollEnd = actualWindowBottom >= (document.body.scrollHeight)

  return [scrollEnd, actualWindowBottom]
}

export const toggleSubmitDisabled = (disabled) => {
  submitNode.disabled = disabled
}
