import { tickLine } from "./engine";
import { EngineData, TickRate } from "./base_engine";
import { IRenderer, SettingsPanel } from "./base_render";
import { TableRender } from "./table_render";
import { throttled, safeRnd } from "./util";

const engineData = new EngineData();
let renderer: IRenderer = null;
let intervalId = null;
let settings: SettingsPanel = null;

function tickFunction () {
  const lstLines = engineData.lstLines;
  const RangeMe = new Array(lstLines.length);
  for (let i = 0; i < RangeMe.length; ++i) {
    RangeMe[i] = i;
  }
  safeRnd.shuffle(RangeMe);
  RangeMe.forEach(c => {
    if (tickLine(lstLines[c], engineData)) {
      renderer.renderLine(c, lstLines[c])
    }
  });
}

document.addEventListener('DOMContentLoaded', async function () {
  renderer = new TableRender(<HTMLDivElement>document.getElementById('div-main'));
  const initPane = document.getElementById('div-init');
  initPane.style.display = '';
  await renderer.onInit(engineData);
  window.addEventListener('resize', throttled(function (e) {
    renderer.onResize(engineData);
  }, 100))
  window.addEventListener('keydown', function (e) {
    if (e.key === ' ') {
      if (intervalId == null) {
        intervalId = setInterval(tickFunction, 1e3 / TickRate);
      } else {
        clearInterval(intervalId);
        intervalId = null;
      }
    } else if (e.key === 't') {
      if (intervalId != null) {
        clearInterval(intervalId);
        intervalId = null;
      } else {
        tickFunction();
      }
    } else if (e.key === 's') {
      settings.show();
    }
  });
  settings = new SettingsPanel(engineData, <HTMLDivElement>document.getElementById('div-settings'))
  intervalId = setInterval(tickFunction, 1e3 / TickRate);
  initPane.style.display = 'none';
});
