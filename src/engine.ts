import { LineInfo, TickRates, TickRate, MAX_LIFE, PrnChars, EngineData } from "./base_engine";
import { safeRnd } from "./util";

export function tickLine(lineInfo: LineInfo, engineData: EngineData) {
  if (!lineInfo.started) {
    let Num = 0;
    const lstLines = engineData.lstLines;
    for (let i = 0; i < lstLines.length; ++i) {
      if (lstLines[i].line.length > 0) {
        Num += 1;
      }
    }
    if (100 * ((Num + 1) / lstLines.length) <= engineData.density && 100 * TickRate * safeRnd.random() < engineData.rate) {
      lineInfo.revive();
      lineInfo.tickActivate = TickRates[safeRnd.randint(0, TickRates.length - 1)];
    }
    return false;
  }
  lineInfo.currTick -= 1;
  if (lineInfo.currTick <= 0) {
    for (let i = 0; i < lineInfo.line.length; ++i) {
      if (100 * safeRnd.random() < engineData.chngDensity && (lineInfo.life < 0 || i >= MAX_LIFE - lineInfo.life)) {
        lineInfo.line[i] = PrnChars[safeRnd.randint(0, PrnChars.length - 1)];
      }
    }
    lineInfo.currTick = lineInfo.tickActivate;
    const lineMax = engineData.ny;
    if (lineInfo.life === -1 && lineInfo.numOff + lineInfo.line.length < lineMax) {
      lineInfo.line.push(PrnChars[safeRnd.randint(0, PrnChars.length - 1)]);
      if (engineData.endChance > 0 && safeRnd.random() * 100 * TickRate < engineData.endChance) {
        lineInfo.life = MAX_LIFE + 1;
      }
    }
    if (lineInfo.life === -1 && lineInfo.numOff + (lineInfo.line.length) >= lineMax) {
      lineInfo.life = MAX_LIFE;
    } else if (lineInfo.life > 0) {
      lineInfo.life -= 1;
    } else if (lineInfo.life === 0 && lineInfo.line.length > 0) {
      lineInfo.line.shift();
      lineInfo.numOff += 1;
    } else if (lineInfo.life === 0) {
      lineInfo.kill();
    }
    if (lineInfo.started && lineInfo.life > 0 && lineInfo.endNewness > 0) {
      lineInfo.endNewness -= 1;
    }
  } else {
    return false;
  }
  return true;
}
