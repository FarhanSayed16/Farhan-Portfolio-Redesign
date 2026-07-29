import Phaser from 'phaser';

export class Goomba extends Phaser.Physics.Arcade.Sprite {
  private direction = -1;
  private speed = 45;
  private isDead = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'goomba_0');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(28, 28);
    body.setOffset(2, 4);
    this.setDepth(5);
    this.anims.play('goomba-walk', true);
  }

  get dead() {
    return this.isDead;
  }

  update() {
    if (this.isDead || !this.body) return;

    const body = this.body as Phaser.Physics.Arcade.Body;

    if (body.blocked.left || body.blocked.right) {
      this.direction *= -1;
    }

    body.setVelocityX(this.speed * this.direction);

    if (this.y > this.scene.cameras.main.height + 200) {
      this.destroy();
    }
  }

  /** Stomp from above — flatten then remove. */
  stomp() {
    if (this.isDead) return;
    this.isDead = true;
    this.anims.play('goomba-flat', true);
    this.setTexture('goomba_flat');
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.checkCollision.none = true;
    body.setVelocity(0, 0);
    body.setAllowGravity(false);

    this.scene.time.delayedCall(500, () => {
      if (this.active) this.destroy();
    });
  }

  /** Hit by fireball */
  burn() {
    this.stomp();
  }
}

/** Inspired-original shell troop — walk, stomp → shell, kick shell. */
export class Koopa extends Phaser.Physics.Arcade.Sprite {
  private direction = -1;
  private speed = 40;
  private isDead = false;
  private shelled = false;
  private shellSpeed = 220;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'koopa_0');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(26, 30);
    body.setOffset(3, 2);
    this.setDepth(5);
    this.anims.play('koopa-walk', true);
  }

  get dead() {
    return this.isDead;
  }

  get inShell() {
    return this.shelled;
  }

  get shellMoving() {
    return this.shelled && Math.abs((this.body as Phaser.Physics.Arcade.Body)?.velocity.x ?? 0) > 40;
  }

  update() {
    if (this.isDead || !this.body) return;
    const body = this.body as Phaser.Physics.Arcade.Body;

    if (this.shelled) {
      if (body.blocked.left || body.blocked.right) {
        body.setVelocityX(-body.velocity.x);
      }
      if (this.y > this.scene.cameras.main.height + 200) this.destroy();
      return;
    }

    if (body.blocked.left || body.blocked.right) {
      this.direction *= -1;
    }
    body.setVelocityX(this.speed * this.direction);
    this.setFlipX(this.direction > 0);

    if (this.y > this.scene.cameras.main.height + 200) {
      this.destroy();
    }
  }

  stomp() {
    if (this.isDead) return;
    if (!this.shelled) {
      this.shelled = true;
      this.anims.play('koopa-shell', true);
      this.setTexture('koopa_shell');
      const body = this.body as Phaser.Physics.Arcade.Body;
      body.setSize(28, 20);
      body.setOffset(2, 12);
      body.setVelocity(0, 0);
      return;
    }
    // Second stomp on still shell — kick
    this.kick(this.direction >= 0 ? 1 : -1);
  }

  kick(dir: number) {
    if (!this.shelled || this.isDead) return;
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityX(this.shellSpeed * dir);
  }

  burn() {
    if (this.isDead) return;
    this.isDead = true;
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.checkCollision.none = true;
    body.setVelocity(0, -180);
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 400,
      onComplete: () => this.destroy(),
    });
  }
}

export type EnemyKind = Goomba | Koopa;
