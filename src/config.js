export const baseUrl = (() => {
  switch (process.env.ENV) {
    case 'prod':
      return 'https://gamas.oss-cn-shanghai.aliyuncs.com/snowman-attack/1.0.0/'
    default:
      return './public/'
  }
})()

export const tips = {
  notLandscape: '如果是手机，请确保处于横屏状态。如果是电脑，请确保页面宽度大于高度',
  notFullscreen: '点击下面按钮开始游戏'
}