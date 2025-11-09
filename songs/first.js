samples({
  bass: ['bass/bass01.wav', 'bass/bass02.wav', 'bass/bass03.wav', 'bass/bass04.wav', 'bass/bass05.wav', 'bass/bass06.wav', 'bass/bass07.wav'],
}, 'github:tuxx/strudel')

setCps(170/60/4)

const makeDrop = ({
  bdPattern,
  bdStut = false,
  sdPattern,
  sdDegrade = 0,
  hatDecayRange,
  hatDecaySpeed,
  hatGain,
  rimSeg,
  rimRib,
  rimGain,
  bassNotes,
  bassScrubRange,
  bassRib,
  bassGain,
  bassPhaser,
}) => stack(
  bdStut 
    ? s("bd:4").beat(bdPattern,16).every(4, p => p.stut(3, 1/8, 0.8))
    : s("bd:4").beat(bdPattern,16),
  sdDegrade > 0
    ? s("sd:2").beat(sdPattern,16).degradeBy(sdDegrade)
    : s("sd:2").beat(sdPattern,16),
  s("white!8").decay(tri.range(...hatDecayRange).fast(hatDecaySpeed)).gain(hatGain),
  s("rim:1").struct(rand.round().seg(rimSeg).rib(...rimRib)).gain(rimGain),
  s("bass")
    .n(bassNotes).slow(6)
    .scrub(perlin.range(...bassScrubRange)).fast(4)
    .seg("8 4 4 8").rib(...bassRib)
    .gain(bassGain).phaser(bassPhaser)
    .cut(1)
)

const intro = stack(
  s("white!16")
    .decay(0.06)
    .gain(sine.range(0.15, 0.35).fast(4))
    .hpf(8000)
    .mask("<1!3 [1 1 1 0]>/4"),
  s("sd:2")
    .struct("~ [~ x] ~ [~ [~ x]]")
    .gain(0.6)
    .room(0.3),
  s("bass")
    .lpf(sine.range(200, 800).slow(8))
    .gain(0.7)
    .room(0.2)
    .cut(1),
  s("white!8")
    .decay(0.12)
    .gain(0.2)
    .hpf(5000)
)

const dropA = makeDrop({
  bdPattern: "0,7?,10",
  bdStut: false,
  sdPattern: "4,12",
  sdDegrade: 0,
  hatDecayRange: [0.05, 0.12],
  hatDecaySpeed: 2,
  hatGain: 0.3,
  rimSeg: 16,
  rimRib: [3, 1],
  rimGain: 0.4,
  bassNotes: "<2 1>",
  bassScrubRange: [.17, .3],
  bassRib: [22, 2],
  bassGain: 0.8,
  bassPhaser: .8,
})

const dropB = makeDrop({
  bdPattern: "0 3 7 10",
  bdStut: true,
  sdPattern: "4 12 15",
  sdDegrade: 0.15,
  hatDecayRange: [0.04, 0.1],
  hatDecaySpeed: 3,
  hatGain: 0.28,
  rimSeg: 8,
  rimRib: [5, 1],
  rimGain: 0.35,
  bassNotes: "<2 1 3 1>",
  bassScrubRange: [.14, .32],
  bassRib: [18, 2],
  bassGain: 0.85,
  bassPhaser: .7,
})

const breakS = stack(
  s("white!32")
    .decay(0.05)
    .gain(perlin.range(0.2, 0.4))
    .hpf(6000)
    .stut(3, 0.5, 1/16)
    .mask("<[1 1 0 1] [1 0 1 [1 1]]>/2"),
  s("sd:2")
    .struct("~ [~ x*4] ~ [[~ x]*2 x*3]")
    .gain(0.7)
    .delay(0.3)
    .delaytime(0.125),
  s("bass")
    .lpf(400)
    .gain(0.8)
    .distort(0.3)
    .struct("x ~ ~ [~ x]")
    .cut(1),
  s("bd:4")
    .struct("x ~ ~ x ~ ~ x ~")
    .gain(0.9)
)

const outro = stack(
  s("white!64")
    .decay(0.04)
    .gain(perlin.range(0.3, 0.5).slow(2))
    .hpf(sine.range(4000, 8000).slow(4))
    .stut(4, 0.7, 1/32)
    .mask("<[1 1 0 1] [1 0 1 0] [1 1 1 0] [1 0 0 0]>/4"),
  s("sd:2")
    .struct("<[~ x*2] [~ x*4] [~ x*8] ~>/4")
    .gain(sine.range(0.5, 0.8).slow(2))
    .room(0.5)
    .delay(0.4)
    .delaytime(0.0625),
  s("bd:4")
    .struct("<[x ~ ~ x] [x ~ x ~] [x ~ ~ ~] ~>/4")
    .gain(0.9),
  s("bass")
    .lpf(sine.range(300, 150).slow(8))
    .gain(0.7)
    .room(0.3)
    .cut(1)
)

arrange(
  [8, intro],
  [16, dropA],
  [4, breakS],
  [16, dropB],
  [16, dropA], 
  [8, outro],  
)
