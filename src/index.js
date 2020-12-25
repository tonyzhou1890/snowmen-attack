import Phaser from 'phaser';
import { baseUrl } from './config'
import { systemInfo } from './utils/util'
import './styles/index.css'
import Boot from './Boot'
import Preloader from './Preloader'
import MainMenu from './MainMenu'

const { fitWidth, fitHeight, scale } = systemInfo(800, 600)


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
  scene: [Boot, Preloader, MainMenu],
  physics: {
    ddefault: 'arcade',
    arcade: {
      debug: false
    }
  }
};

const game = new Phaser.Game(config);
