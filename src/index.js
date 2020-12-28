import Phaser from 'phaser';
import { baseUrl, tips } from './config'
import { systemInfo, isLandscape, isFullscreen } from './utils/util'
import './styles/index.css'
import Boot from './Boot'
import Preloader from './Preloader'
import MainMenu from './MainMenu'
import MainGame from './MainGame'

let root = document.querySelector('#root')

// 横屏检测和全屏检测
if (isLandscape() && isFullscreen()) {
  startGame()
} else {
  root.innerHTML = ''

  let p = document.createElement('p')
  p.setAttribute('class', 'tip')
  p.setAttribute('id', 'tip')
  p.innerText = isLandscape() ? tips.notFullscreen : tips.notLandscape

  let btn = document.createElement('button')
  btn.setAttribute('class', 'btn-confirm')
  btn.innerText = '开始'
  btn.addEventListener('click', checkDevice)

  root.appendChild(p)
  root.appendChild(btn)
}

/**
 * 设备检查，其中宽度大于高度是必须的
 */
function checkDevice() {
  if (!isLandscape()) return
  if (!isFullscreen()) {
    document.body.requestFullscreen()
      .then(res => {
        setTimeout(() => {
          startGame()
        }, 16);
      })
  } else {
    startGame()
  }
}

// 开始游戏
function startGame() {
  root.innerHTML = ''

  const { fitWidth, fitHeight, scale } = systemInfo(1024, 768)

  const config = {
    type: Phaser.AUTO,
    parent: 'root',
    width: fitWidth,
    height: fitHeight,
    backgroundColor: '#3366b2',
    scale: {
      mode: Phaser.Scale.ScaleModes.FIT
    },
    loader: {
      baseURL: baseUrl
    },
    scene: [Boot, Preloader, MainMenu, MainGame],
    physics: {
      default: 'arcade',
      arcade: {
        debug: false
      }
    }
  };

  const game = new Phaser.Game(config);
}

