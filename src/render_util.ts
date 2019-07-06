import { MAX_LIFE, INIT_END_NEWNESS } from "./base_engine";

export const BLACK: [number, number, number] = [0, 0, 0];
export const GREEN: [number, number, number] = [0, 255, 0];
export const WHITE: [number, number, number] = [255, 255, 255];
export const YELLOW: [number, number, number] = [255, 255, 0];
// export const YELLOW: [number, number, number] = [0, 0, 255];
// export const BLACK: [number, number, number] = [255, 255, 255];
// export const GREEN: [number, number, number] = [255, 0, 255];
// export const WHITE: [number, number, number] = [0, 0, 0];
export function colorToStr(color: [number, number, number]): string {
  const [r, g, b] = color;
  const digits = '0123456789ABCDEF';
  return '#' + [r >> 4, r & 0xF, g >> 4, g & 0xF, b >> 4, b & 0xF].map(x => digits[x]).join('');
}
export const sBLACK = colorToStr(BLACK);
export const sGREEN = colorToStr(GREEN);
export const sWHITE = colorToStr(WHITE);
export const sYELLOW = colorToStr(YELLOW);
function int(a: number): number {
  return a | 0;
}

export function Combine(a: [number, number, number], b: [number, number, number], amt: number): [number, number, number] {
  return [int(b[0] * amt + a[0] * (1 - amt)), int(b[1] * amt + a[1] * (1 - amt)), int(b[2] * amt + a[2] * (1 - amt))]
}
export function InitGrad(arr: [number, number, number][], start: [number, number, number], end: [number, number, number]) {
  for (let i = 0; i < arr.length; ++i) {
    arr[i] = Combine(start, end, i / arr.length);
  }
}

export const LstTailGrad: [number, number, number][] = (new Array(MAX_LIFE)).fill(null);
export const LstHeadGrad: [number, number, number][] = (new Array(INIT_END_NEWNESS)).fill(null);

InitGrad(LstTailGrad, GREEN, BLACK);
LstTailGrad.reverse();
InitGrad(LstHeadGrad, WHITE, GREEN);
