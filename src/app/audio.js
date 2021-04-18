import startLevel from '../assets/start_level.mp3'
import playerShoot from '../assets/player_shoot.mp3'
import bulletIsOutOfField from '../assets/bullet_is_out_of_field.mp3'
import enemyDied from '../assets/enemy_died.mp3'
import shootInArmoredEnemy from '../assets/shoot_in_armored_enemy.mp3'
import playerDied from '../assets/player_or_headquarters_died.mp3'
import bonusEnemyHitted from '../assets/bonus_enemy_was_hitted.mp3'
import bonusWasTaken from '../assets/bonus_was_taken.mp3'
import increaseCountOfLives from '../assets/increased_count_of_lives.mp3'
import hitAndDestroyTile from '../assets/hit_and_destroy_tile.mp3'
import awaitingPlayer from '../assets/awaiting_player.mp3'
import movingPlayer from '../assets/moving_player.mp3'
import statsNumCount from '../assets/stats_num_count_sound.mp3'

export class AudioApi {
  constructor() {
    if (!AudioApi._instance) {
      this.startLevel = new Audio(startLevel)
      this.playerShoot = new Audio(playerShoot)
      this.bulletIsOutOfField = new Audio(bulletIsOutOfField)
      this.enemyDied = new Audio(enemyDied)
      this.shootInArmoredEnemy = new Audio(shootInArmoredEnemy)
      this.playerDied = new Audio(playerDied)
      this.bonusEnemyHitted = new Audio(bonusEnemyHitted)
      this.bonusWasTaken = new Audio(bonusWasTaken)
      this.increaseCountOfLives = new Audio(increaseCountOfLives)
      this.hitAndDestroyTile = new Audio(hitAndDestroyTile)
      this.awaitingPlayer = new Audio(awaitingPlayer)
      this.movingPlayer = new Audio(movingPlayer)
      this.statsNumCount = new Audio(statsNumCount)

      this.awaitingPlayer.loop = true
      this.awaitingPlayer.volume = 0.4
      this.movingPlayer.loop = true
      this.movingPlayer.volume = 0.7

      AudioApi._instance = this
    }
    return AudioApi._instance
  }

  static getInstance() {
    return this._instance
  }

  play(soundName) {
    this[soundName].currentTime = 0
    this[soundName].play()
  }

  pause(soundName) {
    this[soundName].pause()
  }
}
