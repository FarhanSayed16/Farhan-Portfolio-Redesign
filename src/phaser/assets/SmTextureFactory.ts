import Phaser from 'phaser';

const COLORS: Record<string, number> = {
  R: 0xf83800, // Red
  B: 0x887000, // Brown
  S: 0xfca044, // Skin / Tan
  O: 0xe85d0b, // Orange / Brick
  G: 0x00a800, // Dark Green
  M: 0xb8f818, // Light Green
  K: 0x000000, // Black
  W: 0xffffff, // White
  C: 0x3cbcfc, // Cloud Blue / Sky
  L: 0xf8d820, // Yellow / Gold
  D: 0x503000, // Dark Brown
};

function drawGrid(g: Phaser.GameObjects.Graphics, grid: string[], scale: number, offsetX: number = 0, offsetY: number = 0, flipX: boolean = false) {
  const w = grid[0].length;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const px = flipX ? (w - 1 - x) : x;
      const char = grid[y][px];
      if (char !== '.' && COLORS[char] !== undefined) {
        g.fillStyle(COLORS[char], 1);
        g.fillRect(offsetX + x * scale, offsetY + y * scale, scale, scale);
      }
    }
  }
}

function gTex(scene: Phaser.Scene, key: string, w: number, h: number, paint: (g: Phaser.GameObjects.Graphics) => void) {
  if (scene.textures.exists(key)) return; // keep sheet PNGs
  const g = scene.make.graphics({ x: 0, y: 0 });
  paint(g);
  g.generateTexture(key, w, h);
  g.destroy();
}

const SPRITES = {
  small_mario_idle: [
    "....RRRRR.......",
    "...RRRRRRRRR....",
    "...BBBSSKSS.....",
    "..BSBSSSKSKS....",
    "..BSBBSSSKSS....",
    "..BBSSSSSS......",
    "....SSSSSSS.....",
    "...RRRBRRBRR....",
    "..RRRRRBRRBR....",
    ".RRRRRRBBBBBR...",
    ".SSRRRRBBBBSS...",
    ".SSSSBBBBBSSS...",
    "..BB......BB....",
    ".BBB......BBB..."
  ],
  small_mario_walk1: [
    "....RRRRR.......",
    "...RRRRRRRRR....",
    "...BBBSSKSS.....",
    "..BSBSSSKSKS....",
    "..BSBBSSSKSS....",
    "..BBSSSSSS......",
    "....SSSSSSS.....",
    "...RRRBRRBRR....",
    "..RRRRRBRRBR....",
    ".RRRRRRBBBBBR...",
    ".SSRRRRBBBBSS...",
    ".SSSSBBBBBSSS...",
    "..BB......BB....",
    ".BBB......BBB...",
    ".B.............."
  ],
  small_mario_walk2: [
    "....RRRRR.......",
    "...RRRRRRRRR....",
    "...BBBSSKSS.....",
    "..BSBSSSKSKS....",
    "..BSBBSSSKSS....",
    "..BBSSSSSS......",
    "....SSSSSSS.....",
    "...RRRBRRBRR....",
    "..RRRRRBRRBR....",
    ".RRRRRRBBBB.....",
    ".SSRRRRBBBB.....",
    ".SSSSBBBB.......",
    "..BB...BB.......",
    ".BBB...BBB......"
  ],
  small_mario_jump: [
    "....RRRRR.......",
    "...RRRRRRRRR....",
    "...BBBSSKSS.....",
    "..BSBSSSKSKS....",
    "..BSBBSSSKSS....",
    "..BBSSSSSS......",
    "....SSSSSSS.....",
    "...RRRBRRBRR....",
    "..RRRRRBRRBR....",
    ".RRRRRRBBBB.....",
    ".SSRRRRBBBBSS...",
    ".SSSSBBBBBSSS...",
    "...BB....BB.....",
    "..BBB...BBB....."
  ],
  small_mario_die: [
    "....RRRRR.......",
    "...RRRRRRRRR....",
    "...BBBSSKSS.....",
    "..BSBSSSKSKS....",
    "..BSBBSSSKSS....",
    "..BBSSSSSS......",
    "....SSSSSSS.....",
    "...S..S..S......",
    "...SS.SS.SS.....",
    "....SSSSSS......",
    ".....SSSS.......",
    "......SS........",
    "......BB........",
    ".....BBBB......."
  ],
  brick: [
    "LLLLLLLLLLLLLLLL",
    "LOOOOOOOKOOOOOOK",
    "LOOOOOOOKOOOOOOK",
    "LOOOOOOOKOOOOOOK",
    "KKKKKKKKKKKKKKKK",
    "LOOOKOOOOOOOKOOO",
    "LOOOKOOOOOOOKOOO",
    "LOOOKOOOOOOOKOOO",
    "KKKKKKKKKKKKKKKK",
    "LOOOOOOOKOOOOOOK",
    "LOOOOOOOKOOOOOOK",
    "LOOOOOOOKOOOOOOK",
    "KKKKKKKKKKKKKKKK",
    "LOOOKOOOOOOOKOOO",
    "LOOOKOOOOOOOKOOO",
    "LOOOKOOOOOOOKOOO"
  ],
  qblock: [
    "KKKKKKKKKKKKKKKK",
    "KYYYYYYYYYYYYYYK",
    "KYKLLLLLLLLLLKOK",
    "KYLLKLLLLLKKLLOK",
    "KYLKKYLLLKKKYLOK",
    "KYLKKYLLLKKKYLOK",
    "KYLLLLLLKKKYLLOK",
    "KYLLLLLKKKYLLLOK",
    "KYLLLLKKKYLLLLOK",
    "KYLLLLKKYLLLLLOK",
    "KYLLLLLLLLLLLLOK",
    "KYLLLLKKYLLLLLOK",
    "KYLLLLKKYLLLLLOK",
    "KYKLLLLLLLLLLKOK",
    "KYOOOOOOOOOOOOOK",
    "KKKKKKKKKKKKKKKK"
  ].map(r => r.replace(/Y/g, 'W')),
  qblock_empty: [
    "KKKKKKKKKKKKKKKK",
    "KLLLLLLLLLLLLLLK",
    "KLKDDDDDDDDDDKDK",
    "KLDDDDDDDDDDDDDK",
    "KLDDDDKKKDDDDDDK",
    "KLDDDKDDDKDDDDDK",
    "KLDDDKDDDKDDDDDK",
    "KLDDDKKKKDDDDDDK",
    "KLDDDDDDDDDDDDDK",
    "KLDDDDDDDDDDDDDK",
    "KLDDDDDDDDDDDDDK",
    "KLDDDDDDDDDDDDDK",
    "KLDDDDDDDDDDDDDK",
    "KLKDDDDDDDDDDKDK",
    "KDDDDDDDDDDDDDDK",
    "KKKKKKKKKKKKKKKK"
  ],
  ground: [
    "KSSSODDDDKSSSDOO",
    "SKSKKDDDOSKSKKDD",
    "SKKKKDDDOSKKKKDD",
    "SKKSDDDDOSKKSDDD",
    "SDDDDDDDSDDDDDDD",
    "DDDDDKSSSDDDDDKS",
    "DDDDDSKSKKDDDDSK",
    "DDDDDSKKKKDDDDSK",
    "DDDDDSKKSDDDDDSK",
    "DDDDDSDDDDDDDDDS",
    "KSSSDDDDDKSSSDDD",
    "SKSKKDDDOSKSKKDD",
    "SKKKKDDDOSKKKKDD",
    "SKKSDDDDOSKKSDDD",
    "SDDDDDDDSDDDDDDD",
    "DDDDDKSSSDDDDDKS"
  ],
  goomba_idle: [
    "......KKKK......",
    ".....KBBBBK.....",
    "....KBBBBBBK....",
    "...KBBBBBBBBK...",
    "..KBBBBBBBBBBK..",
    "..KBKKBBBBKKBK..",
    ".KBBKWBBBBWKBK..",
    ".KBKWWBBBBWWKBK.",
    "KBBBKWBBBBWKBBBK",
    "KBBBBBBBBBBBBBBK",
    "KBBBBSSSSSSBBBBK",
    "KBBBSSSSSSSSBBBK",
    "KBBSSKKSSSSKKSBK",
    "KBSSKKKKSKKKKSBK",
    "...KKK....KKK...",
    "..KKKK....KKKK.."
  ],
  goomba_die: [
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "......KKKK......",
    ".....KBBBBK.....",
    "....KBBBBBBK....",
    "...KBBKKBBKKK...",
    "..KBKWWBBWWKBK..",
    ".KBBKWBBBBWKBBBK",
    ".KBBBBBBBBBBBBBK",
    ".KBBSSSSSSSSBBBK",
    "..KK........KK.."
  ],
  pipe_top: [
    "KKKKKKKKKKKKKKKK",
    "KMMMMMMMMMMMMMMK",
    "KMMMMMMGMMMMMMMK",
    "KGGGGGGGGMGGGGGK",
    "KGGGGGGGGMGGGGGK",
    "KGGGGGGGGMGGGGGK",
    "KGGGGGGGGMGGGGGK",
    "KGGGGGGGGMGGGGGK",
    "KMMMMMMMMMMMMMMK",
    "KKKKKKKKKKKKKKKK",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................"
  ],
  pipe_body: [
    "..KKKKKKKKKKKK..",
    "..KMMMMMMMMMMK..",
    "..KGGGGGGMGGGK..",
    "..KGGGGGGMGGGK..",
    "..KGGGGGGMGGGK..",
    "..KGGGGGGMGGGK..",
    "..KGGGGGGMGGGK..",
    "..KMMMMMMMMMMK..",
    "..KKKKKKKKKKKK..",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................"
  ],
  coin: [
    "......KKKK......",
    "....KKLLLLKK....",
    "...KLLLLLLLLK...",
    "..KLL..LLLL..K..",
    "..KLL.LLLLLL.K..",
    ".KLL..LLLLLL..K.",
    ".KLL..LLLLLL..K.",
    ".KLL..LLLLLL..K.",
    ".KLL..LLLLLL..K.",
    ".KLL..LLLLLL..K.",
    "..KLL.LLLLLL.K..",
    "..KLL..LLLL..K..",
    "...KLLLLLLLLK...",
    "....KKLLLLKK....",
    "......KKKK......",
    "................"
  ],
  pole: [
    "....KMGGK.......",
    "....KMGGK.......",
    "....KMGGK.......",
    "....KMGGK......."
  ],
  flag: [
    "....KMMMMMMMMMMM",
    "....KMMMMMMMMMMM",
    "....KMMMMMMMMMMM",
    "....KMMMMMMMMMMM",
    "....KMMMMMMMMMMM",
    "....KMMMMMMMMMMM",
    "....KMMMMMMMMMMM",
    "................"
  ],
  cloud_tl: [
    "................",
    "................",
    "................",
    "......KKKKKK....",
    "....KKWWWWWWKK..",
    "...KWWWWWWWWWWK.",
    "..KWWWWWWWWWWWWK",
    ".KWWWWWWWWWWWWWW",
    ".KWWWWWWWWWWWWWW",
    "KWWWWWWWWWWWWWWW",
    "KWWWWWWWWWWWWWWW",
    "KWWWWWWWWWWWWWWW",
    "KWWWWWWWWWWWWWWW",
    "KWWWWWWWWWWWWWWW",
    "KWWWWWWWWWWWWWWW",
    "KWWWWWWWWWWWWWWW",
  ],
  bush_tl: [
    "................",
    "................",
    "................",
    "......KKKKKK....",
    "....KKMMMMMMKK..",
    "...KMMMMMMMMMMK.",
    "..KMMMMMMMMMMMMK",
    ".KMMMMMMMMMMMMMM",
    ".KMMMMMMMMMMMMMM",
    "KMMMMMMMMMMMMMMM",
    "KMMGMMMMMMMMMMMM",
    "KMGGMMMMMMMMMMMM",
    "KMGGMMMMMMGMMMMM",
    "KGGGGGGGGGGGMMMM",
    "KGGGGGGGGGGGMMMM",
    "KKKKKKKKKKKKKKKK",
  ],
  hill_tl: [
    "...............K",
    "..............KM",
    ".............KMM",
    "............KMMM",
    "...........KMMMM",
    "..........KMMMMM",
    ".........KMMMMMM",
    "........KMMMMMMM",
    ".......KMMMMMMMM",
    "......KMMGMMMMMM",
    ".....KMMMMMMMMMM",
    "....KMMMMGMMMMMM",
    "...KMMMMMMMMMMMM",
    "..KMMMMMMGMMMMMM",
    ".KMMMMMMMMMMMMMM",
    "KMMMMMMMMGMMMMMM",
  ]
};

export function generateGameTextures(scene: Phaser.Scene) {
  gTex(scene, 'mario_s_idle', 32, 32, (g) => drawGrid(g, SPRITES.small_mario_idle, 2));
  gTex(scene, 'mario_small_walk1', 32, 32, (g) => drawGrid(g, SPRITES.small_mario_walk1, 2));
  gTex(scene, 'mario_small_walk2', 32, 32, (g) => drawGrid(g, SPRITES.small_mario_walk2, 2));
  gTex(scene, 'mario_small_jump', 32, 32, (g) => drawGrid(g, SPRITES.small_mario_jump, 2));
  gTex(scene, 'mario_s_die', 32, 32, (g) => drawGrid(g, SPRITES.small_mario_die, 2));

  // Super / fire / items / boss / koopa — ExtraTextures (inspired originals)
  // (intentionally not generating scaled small-mario stubs here)

  gTex(scene, 'block_brick', 32, 32, (g) => drawGrid(g, SPRITES.brick, 2));
  gTex(scene, 'block_ground', 32, 32, (g) => drawGrid(g, SPRITES.ground, 2));
  gTex(scene, 'qblock_1', 32, 32, (g) => drawGrid(g, SPRITES.qblock, 2));
  gTex(scene, 'qblock_2', 32, 32, (g) => drawGrid(g, SPRITES.qblock, 2));
  gTex(scene, 'qblock_3', 32, 32, (g) => drawGrid(g, SPRITES.qblock, 2));
  gTex(scene, 'qblock_empty', 32, 32, (g) => drawGrid(g, SPRITES.qblock_empty, 2));

  gTex(scene, 'tiles', 128, 32, (g) => {
    drawGrid(g, SPRITES.ground, 2, 0, 0);
    drawGrid(g, SPRITES.brick, 2, 32, 0);
    drawGrid(g, SPRITES.qblock, 2, 64, 0);
    drawGrid(g, SPRITES.qblock_empty, 2, 96, 0);
  });

  gTex(scene, 'goomba_0', 32, 32, (g) => drawGrid(g, SPRITES.goomba_idle, 2));
  gTex(scene, 'goomba_walk2', 32, 32, (g) => drawGrid(g, SPRITES.goomba_idle, 2, 0, 0, true));
  gTex(scene, 'goomba_flat', 32, 32, (g) => drawGrid(g, SPRITES.goomba_die, 2));

  gTex(scene, 'pipe_top', 64, 32, (g) => {
    drawGrid(g, SPRITES.pipe_top, 2);
    drawGrid(g, SPRITES.pipe_top, 2, 32, 0, true);
  });
  gTex(scene, 'pipe_body', 64, 32, (g) => {
    drawGrid(g, SPRITES.pipe_body, 2);
    drawGrid(g, SPRITES.pipe_body, 2, 32, 0, true);
  });

  gTex(scene, 'coin_spin1', 32, 32, (g) => drawGrid(g, SPRITES.coin, 2));
  gTex(scene, 'coin_spin2', 32, 32, (g) => drawGrid(g, SPRITES.coin, 2));
  gTex(scene, 'coin_spin3', 32, 32, (g) => drawGrid(g, SPRITES.coin, 2));
  gTex(scene, 'coin_spin4', 32, 32, (g) => drawGrid(g, SPRITES.coin, 2));

  gTex(scene, 'flagpole', 32, 32, (g) => drawGrid(g, SPRITES.pole, 2));
  gTex(scene, 'flag', 32, 32, (g) => drawGrid(g, SPRITES.flag, 2));

  // Scenery — single mound (matched sheet pack)
  gTex(scene, 'bush', 64, 32, (g) => {
    drawGrid(g, SPRITES.bush_tl, 2, 0, 0);
    drawGrid(g, SPRITES.bush_tl, 2, 32, 0, true);
  });
  gTex(scene, 'cloud', 96, 48, (g) => {
    drawGrid(g, SPRITES.cloud_tl, 2, 0, 16);
    drawGrid(g, SPRITES.cloud_tl, 2, 32, 16, true);
    drawGrid(g, SPRITES.cloud_tl, 2, 64, 16, true);
  });
  gTex(scene, 'hill', 160, 70, (g) => {
    drawGrid(g, SPRITES.hill_tl, 4, 0, 0);
    drawGrid(g, SPRITES.hill_tl, 4, 64, 0, true);
  });
}

export function registerGameAnims(scene: Phaser.Scene) {
  const once = (
    key: string,
    frames: Phaser.Types.Animations.AnimationFrame[],
    frameRate?: number,
    repeat?: number
  ) => {
    if (scene.anims.exists(key)) return;
    scene.anims.create({ key, frames, frameRate, repeat });
  };
  once('mario-small-idle', [{ key: 'mario_s_idle' }]);
  once(
    'mario-small-walk',
    [{ key: 'mario_small_walk1' }, { key: 'mario_small_walk2' }],
    10,
    -1
  );
  once('mario-small-jump', [{ key: 'mario_small_jump' }]);
  once('mario-small-die', [{ key: 'mario_s_die' }]);
  once('mario-big-idle', [{ key: 'mario_b_idle' }]);
  once(
    'mario-big-walk',
    [
      { key: 'mario_big_walk1' },
      { key: 'mario_big_walk2' },
      { key: 'mario_big_walk3' },
    ],
    10,
    -1
  );
  once('mario-big-jump', [{ key: 'mario_big_jump' }]);
  once('goomba-walk', [{ key: 'goomba_0' }, { key: 'goomba_walk2' }], 6, -1);
  once('goomba-flat', [{ key: 'goomba_flat' }]);
  once(
    'coin-spin',
    [
      { key: 'coin_spin1' },
      { key: 'coin_spin2' },
      { key: 'coin_spin3' },
      { key: 'coin_spin4' },
    ],
    10,
    -1
  );
  once('qblock-idle', [{ key: 'qblock_1' }, { key: 'qblock_2' }, { key: 'qblock_3' }], 6, -1);
}
