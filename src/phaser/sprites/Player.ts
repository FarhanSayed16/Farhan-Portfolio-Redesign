import Phaser from 'phaser';
import { gameBridge } from '@/lib/GameBridge';
import type { SFXSynth } from '@/lib/SFXSynth';
import { Fireball } from './Fireball';

type SceneWithSfx = Phaser.Scene & {
  sfx?: SFXSynth;
  fireballs?: Phaser.Physics.Arcade.Group;
};

export class Player extends Phaser.Physics.Arcade.Sprite {
  public isSuper = false;
  public isFire = false;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private runKey!: Phaser.Input.Keyboard.Key;
  private jumpKey!: Phaser.Input.Keyboard.Key;
  private leftKey!: Phaser.Input.Keyboard.Key;
  private rightKey!: Phaser.Input.Keyboard.Key;
  private wKey!: Phaser.Input.Keyboard.Key;
  private fireKey!: Phaser.Input.Keyboard.Key;
  private isDead = false;
  private jumpCutApplied = false;
  private invincibleUntil = 0;
  private lastFireAt = 0;

  private virtualKeys: Record<string, boolean> = {
    left: false,
    right: false,
    up: false,
    shift: false,
    fire: false,
  };

  private handleMobileInput = (data: unknown) => {
    const d = data as { key: string; state: 'down' | 'up' };
    this.virtualKeys[d.key] = d.state === 'down';
    if (d.key === 'up' && d.state === 'down') {
      this.jumpCutApplied = false;
    }
    if (d.key === 'shift' && d.state === 'down' && this.isFire) {
      this.tryShoot();
    }
  };

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'mario_s_idle');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0.5, 1);
    this.setCollideWorldBounds(false);
    this.applySmallBody();
    this.setDepth(10);

    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys();
      this.runKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
      this.jumpKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.leftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.rightKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.wKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.fireKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
    }

    gameBridge.on('mobile-input', this.handleMobileInput);
    scene.events.on('post-overlay-resume', this.onOverlayResume);
    scene.events.on('shutdown', () => {
      gameBridge.off('mobile-input', this.handleMobileInput);
      scene.events.off('post-overlay-resume', this.onOverlayResume);
    });
  }

  private onOverlayResume = () => {
    this.invincibleUntil = this.scene.time.now + 1800;
  };

  private setBodyHeight(width: number, height: number, offsetX: number, offsetY: number, keepFeet: boolean) {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const feet = body.bottom;
    body.setSize(width, height);
    body.setOffset(offsetX, offsetY);
    if (keepFeet) {
      this.setPosition(this.x, feet);
    }
  }

  private applySmallBody(keepFeet = false) {
    this.setBodyHeight(20, 28, 6, 4, keepFeet);
  }

  private applyBigBody() {
    this.setBodyHeight(22, 44, 5, 4, true);
  }

  update() {
    if (this.isDead || !this.body) return;

    const body = this.body as Phaser.Physics.Arcade.Body;
    const isRunning = Boolean(this.runKey?.isDown || this.virtualKeys.shift);
    const speed = isRunning ? 260 : 160;
    const acceleration = 700;

    body.setDragX(900);

    const left = Boolean(this.cursors?.left?.isDown || this.leftKey?.isDown || this.virtualKeys.left);
    const right = Boolean(this.cursors?.right?.isDown || this.rightKey?.isDown || this.virtualKeys.right);

    if (left) {
      body.setAccelerationX(-acceleration);
      body.setMaxVelocity(speed, 1200);
      this.setFlipX(true);
    } else if (right) {
      body.setAccelerationX(acceleration);
      body.setMaxVelocity(speed, 1200);
      this.setFlipX(false);
    } else {
      body.setAccelerationX(0);
    }

    const jumpHeld = Boolean(
      this.cursors?.up?.isDown ||
        this.jumpKey?.isDown ||
        this.wKey?.isDown ||
        this.virtualKeys.up
    );

    if (jumpHeld && body.onFloor()) {
      body.setVelocityY(this.isSuper ? -520 : -480);
      this.jumpCutApplied = false;
      (this.scene as SceneWithSfx).sfx?.playJump();
    } else if (!jumpHeld && body.velocity.y < 0 && !this.jumpCutApplied) {
      body.setVelocityY(body.velocity.y * 0.5);
      this.jumpCutApplied = true;
    }

    if (Phaser.Input.Keyboard.JustDown(this.fireKey) || this.virtualKeys.fire) {
      this.tryShoot();
      this.virtualKeys.fire = false;
    }

    this.updateAnimation(body, left || right);

    if (this.y > this.scene.cameras.main.height + 200 && !this.isInvincible()) {
      this.die();
    }

    if (this.isInvincible()) {
      this.setAlpha(Math.sin(this.scene.time.now / 50) > 0 ? 1 : 0.35);
    } else if (!this.isDead) {
      this.setAlpha(1);
    }
  }

  private tryShoot() {
    if (!this.isFire || this.isDead) return;
    if (this.scene.time.now - this.lastFireAt < 280) return;
    this.lastFireAt = this.scene.time.now;

    const scene = this.scene as SceneWithSfx;
    const dir = this.flipX ? -1 : 1;
    const ball = new Fireball(this.scene, this.x + dir * 16, this.y - 28, dir);
    scene.fireballs?.add(ball);
    scene.sfx?.playBlock();
  }

  private updateAnimation(body: Phaser.Physics.Arcade.Body, moving: boolean) {
    const prefix = this.isFire ? 'mario-fire' : this.isSuper ? 'mario-big' : 'mario-small';
    if (!body.onFloor()) {
      this.anims.play(`${prefix}-jump`, true);
    } else if (moving && Math.abs(body.velocity.x) > 20) {
      this.anims.play(`${prefix}-walk`, true);
    } else {
      this.anims.play(`${prefix}-idle`, true);
    }
  }

  grow() {
    if (this.isDead) return;
    if (this.isFire) return;
    if (this.isSuper) {
      this.grantFire();
      return;
    }
    this.isSuper = true;
    this.clearTint();
    this.setTexture('mario_b_idle');
    this.applyBigBody();
    this.anims.play('mario-big-idle', true);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.checkCollision.up = false;
    this.scene.time.delayedCall(500, () => {
      if (this.active && this.body) {
        (this.body as Phaser.Physics.Arcade.Body).checkCollision.up = true;
      }
    });

    this.invincibleUntil = this.scene.time.now + 2000;
    this.scene.tweens.add({
      targets: this,
      alpha: 0.3,
      yoyo: true,
      repeat: 3,
      duration: 60,
    });
  }

  grantFire() {
    if (this.isDead) return;
    this.isSuper = true;
    this.isFire = true;
    this.applyBigBody();
    this.setTexture('mario_f_idle');
    this.anims.play('mario-fire-idle', true);
    this.invincibleUntil = this.scene.time.now + 1500;
  }

  shrink() {
    if (this.isDead) return;
    if (this.isFire) {
      this.isFire = false;
      this.isSuper = true;
      this.setTexture('mario_b_idle');
      this.applyBigBody();
      this.anims.play('mario-big-idle', true);
      this.invincibleUntil = this.scene.time.now + 1500;
      return;
    }
    if (!this.isSuper) return;
    this.isSuper = false;
    this.invincibleUntil = this.scene.time.now + 1500;
    this.setTexture('mario_s_idle');
    this.applySmallBody(true);
    this.anims.play('mario-small-idle', true);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.checkCollision.up = true;
  }

  isInvincible() {
    return this.scene.time.now < this.invincibleUntil;
  }

  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.isFire = false;
    this.anims.play('mario-small-die', true);
    this.setTexture('mario_s_die');
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.checkCollision.none = true;
    body.setVelocityY(-420);
    body.setVelocityX(0);
    body.setAcceleration(0);
    this.scene.tweens.add({
      targets: this,
      angle: 180,
      duration: 800,
    });
    this.scene.events.emit('player-died');
  }
}
