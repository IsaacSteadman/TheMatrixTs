export const INIT_END_NEWNESS = 5;
export class LineInfo {
  life: number;
  numOff: number;
  tickActivate: number;
  currTick: number;
  endNewness: number;
  started: boolean;
  line: string[];
  constructor(life?: number, numOff?: number, tickActivate?: number | null, currTick?: number, endNewness?: number) {
    if (life == null) life = -1;
    if (numOff == null) numOff = 0;
    if (tickActivate == null) tickActivate = null;
    if (currTick == null) currTick = 0;
    if (endNewness == null) endNewness = INIT_END_NEWNESS;
    this.life = life;
    this.numOff = numOff;
    this.tickActivate = tickActivate;
    this.currTick = currTick;
    this.endNewness = endNewness;
    this.started = false;
    this.line = [];
  }
  revive() {
    this.life = -1;
    this.numOff = 0;
    this.tickActivate = null;
    this.currTick = 0;
    this.endNewness = INIT_END_NEWNESS;
    this.line = [];
    this.started = true;
  }
  kill() {
    this.started = false;
    this.line = [];
  }
}
export const MAX_LIFE = 16;
export const TickRates = [1, 2, 2, 3, 3];
export const TickRate = 80;
export const PrnChars = ['+', '<', '>', '=', ':', '-', '|'];
{
  const aCode = 'a'.charCodeAt(0);
  const zeroCode = '0'.charCodeAt(0);
  for (let i = 0; i < 26; ++i) {
    PrnChars.push(String.fromCharCode(aCode + i));
  }
  for (let i = 1; i < 64; ++i) {
    PrnChars.push(String.fromCharCode(0xFF60 + i));
  }
  for (let i = 0; i < 10; ++i) {
    PrnChars.push(String.fromCharCode(zeroCode + i));
  }
}
export class EngineData {
  density: number;
  rate: number;
  chngDensity: number;
  endChance: number;
  lstLines: LineInfo[];
  nx: number;
  ny: number;
  constructor () {
    this.lstLines = [];
    this.density = 20;
    this.rate = 3;
    this.chngDensity = 1;
    this.endChance = 30;
    this.nx = 0;
    this.ny = 0;
  }
  resizeEngine(nx: number, ny: number) {
    this.nx = nx;
    this.ny = ny;
    const lstLines = this.lstLines;
    lstLines.splice(0, lstLines.length);
    for (let i = 0; i < nx; ++i) {
      lstLines.push(new LineInfo());
    }
  }
  setParameters(density: number, rate: number, chngDensity: number, endChance: number) {
    this.density = density;
    this.rate = rate;
    this.chngDensity = chngDensity;
    this.endChance = endChance;
  }
}
