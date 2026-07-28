import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import PreloadScene from './scenes/PreloadScene';
import MainMenuScene from './scenes/MainMenuScene';
import Level1Scene from './scenes/Level1Scene';
import Level2Scene from './scenes/Level2Scene';
import Level3Scene from './scenes/Level3Scene';
import WinScene from './scenes/WinScene';
import GameOverScene from './scenes/GameOverScene';

export function createGame(parent: string | HTMLElement) {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 768,
    height: 480,
    parent,
    pixelArt: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 980, x: 0 },
        debug: false,
      },
    },
    scene: [BootScene, PreloadScene, MainMenuScene, Level1Scene, Level2Scene, Level3Scene, WinScene, GameOverScene],
  };

  return new Phaser.Game(config);
}
