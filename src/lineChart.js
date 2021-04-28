import { selectors as sel } from 'utils/dom'

const CHART_PADDING_TOP = 10
const CHART_PADDING_RIGHT = 5
const CHART_PADDING_BOTTOM = 14
const CHART_PADDING_LEFT = 20

const getVerticalNums = (data) => {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const gridMax = Math.ceil((max * 1.1) / 5) * 5
  const gridMin = Math.floor((min - (gridMax - max) * 0.9) / 5) * 5
  const expectedGap = Math.ceil(((gridMax - gridMin) / 3) / 5) * 5
  const grid = [gridMax]

  while(grid.length < 4) {
    grid.push(grid[grid.length - 1] - expectedGap)
  }

  return grid.reverse()
}

const getLegends = (
  yPoints,
  xPoints,
  height,
  chartEndRight,
  countCharactersLegend,
) => {
  let horizontalLines = []
  let countLegend = []
  let seasonLegend = []

  for (let i = yPoints.length; i--;) {
    const current = yPoints[i]
    horizontalLines.push(
      `<path 
        d="M${CHART_PADDING_LEFT},${current} ${chartEndRight},${current}"  
        class="chart__gridLine" 
      ></path>`,
    )
    countLegend.push(
      `<text x="0" y="${current}">${countCharactersLegend[i]}</text>`,
    )
  }

  for (let i = xPoints.length; i--;) {
    seasonLegend.push(`<text x="${xPoints[i] - 4}" y="${height}">${i + 1}</text>`)
  }

  return {
    legends: `<g class="chart__legend">${countLegend.join('')}</g><g class="chart__legend">${seasonLegend.join('')}</g>`,
    horizontalLines: horizontalLines.join(''),
  }
}

const getChart = (
  values,
  containerHeight,
  containerWidth,
  xPoints,
  countCharactersLegend,
) => {
  const height = containerHeight - CHART_PADDING_TOP - CHART_PADDING_BOTTOM
  const inChartHeight = height + CHART_PADDING_TOP
  const minVisibleValues = countCharactersLegend[0]
  const maxVisibleValues = countCharactersLegend[countCharactersLegend.length - 1]
  const step = height / (maxVisibleValues - minVisibleValues)
  const line = []
  const points = []
  let gradient = [`M${CHART_PADDING_LEFT},${containerHeight - CHART_PADDING_BOTTOM} `]
  for (let i = 0, len = values.length; i < len; i++) {
    const [x, y] = [xPoints[i], inChartHeight - ((values[i] - minVisibleValues) * step)]
    let currentLine = `L ${x},${y} `
    if (i > 0) {
      const prevY = inChartHeight - ((values[i - 1] - minVisibleValues) * step)
      currentLine = `C ${xPoints[i - 1] + 30},${prevY}, ${x - 30},${y}, ${x},${y} `
    }
    line.push(currentLine)
    points.push(`<circle cx="${x}" cy="${y}" r="3"></circle>`)
    gradient.push(currentLine)
  }
  gradient.push(`L${containerWidth - CHART_PADDING_RIGHT},${containerHeight - CHART_PADDING_BOTTOM}Z`)

  return `<path d="${gradient.join('')}" class="chart__gradient"></path>
    <path d="${'M' + line.join('').slice(1)}" class="chart__line"></path>
    <g class="chart__points">${points.join('')}</g>`
}

/**
 * Render SVG chart
 * @param {Array} values
 * @param {Array} countSeasonsLegend
 * @param {HTMLDivElement} node
 */
export const renderChart = (
  values,
  countSeasonsLegend,
) => {
  const w = 400
  const h = 200
  const countCharactersLegend = getVerticalNums(values)
  const chartEndRight = w - CHART_PADDING_RIGHT
  const chartHeight = (h - CHART_PADDING_TOP - CHART_PADDING_BOTTOM)
  const verticalLineGap = chartHeight / (countCharactersLegend.length - 1)
  const horizontalLineGap = (w - CHART_PADDING_LEFT - CHART_PADDING_RIGHT) / (countSeasonsLegend.length - 1)

  const yPoints = new Array(countCharactersLegend.length).fill(true).map((_, index) => (
    h - ((index * verticalLineGap) + CHART_PADDING_BOTTOM)
  ))
  const xPoints = new Array(countSeasonsLegend.length).fill(true).map((_, index) =>
    ((index * horizontalLineGap) + CHART_PADDING_LEFT),
  )

  const {
    legends,
    horizontalLines,
  } = getLegends(
    yPoints,
    xPoints,
    h,
    chartEndRight,
    countCharactersLegend,
  )

  const chart = getChart(values, h, w, xPoints, countCharactersLegend)

  sel.chartNode.innerHTML = `${horizontalLines}${chart}${legends}`
}
