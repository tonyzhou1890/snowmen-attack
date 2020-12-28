/**
 * 获取系统信息，并计算目标宽高和缩放系数
 * @param {number|undefined} initWidth 
 * @param {number|undefined} initHeight 
 */
export function systemInfo(initWidth, initHeight) {
  const DPR = window.devicePixelRatio
  const pixelWidth = window.innerWidth * DPR
  const pixelHeight = window.innerHeight * DPR
  let targetWidth = initWidth ?? pixelWidth
  let targetHeight = initHeight ?? pixelHeight
  let ratio = targetWidth / targetHeight
  let scale = pixelWidth / pixelHeight > ratio ? pixelHeight / targetHeight : pixelWidth / targetWidth
  let offsetX = (pixelWidth - scale * targetWidth) / 2
  let offsetY = (pixelHeight - scale * targetHeight) / 2
  let fitWidth = pixelWidth / scale
  let fitHeight = pixelHeight / scale

  return {
    innerWIdth: window.innerWidth,
    innerHeight: window.innerHeight,
    DPR,
    pixelWidth,
    pixelHeight,
    initWidth,
    initHeight,
    targetWidth,
    targetHeight,
    ratio,
    scale,
    offsetX,
    offsetY,
    fitWidth,
    fitHeight
  }
}

/**
 * 横屏检测
 */
export function isLandscape() {
  return window.innerWidth > window.innerHeight || (window.orientation === 90 || window.orientation === -90)
}

/**
 * 全屏检测
 */
export function isFullscreen() {
  return document.fullscreenElement === document.querySelector('#root')
}