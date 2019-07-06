import { IRenderer } from "./base_render";
import { AsyncTaskList } from "./util";
import { PrnChars, EngineData, LineInfo, MAX_LIFE } from "./base_engine";
import { colorToStr, sGREEN, LstTailGrad, LstHeadGrad } from "./render_util";


export class TableRender implements IRenderer {
  div: HTMLDivElement;
  table: HTMLTableElement;
  tbody: HTMLTableSectionElement;
  cw: number;
  ch: number;
  constructor(div: HTMLDivElement) {
    this.div = div;
    this.table = document.createElement('table');
    div.appendChild(this.table)
    this.table.appendChild(document.createElement('tbody'));
    this.tbody = this.table.tBodies[0];
    this.cw = null;
    this.ch = null;
  }
  onInit(engineData: EngineData): Promise<any> {
    const tbody = this.tbody;
    tbody.innerHTML = '';
    tbody.appendChild(document.createElement('tr'));
    const cell = document.createElement('td');
    tbody.rows[0].appendChild(cell);
    const testSize = function (data: { maxW: number; maxH: number; }, item: string, done: () => void) {
      console.log('item =', item);
      cell.textContent = item;
      setTimeout(() => {
        const { width, height } = cell.getBoundingClientRect();
        console.log(`width = ${width}, height = ${height}`);
        data.maxW = Math.max(data.maxW, width);
        data.maxH = Math.max(data.maxH, height);
        done();
      });
    };
    const task = new AsyncTaskList(testSize, PrnChars, { maxW: 0, maxH: 0 });
    return new Promise((resolve, reject) => {
      task.start((data) => {
        this.cw = data.maxW;
        this.ch = data.maxH;
        this.onResize(engineData);
        resolve(null);
      });
    })
  }
  onResize(engineData: EngineData) {
    const { width, height } = document.body.getBoundingClientRect();
    const { tbody, cw, ch } = this;
    const nx = (width / cw) | 0;
    const ny = (height / ch) | 0;
    engineData.resizeEngine(nx, ny);
    tbody.innerHTML = '';
    for (let y = 0; y < ny; ++y) {
      const tr = document.createElement('tr');
      for (let x = 0; x < nx; ++x) {
        const td = document.createElement('td');
        td.style.width = cw + 'px';
        td.style.height = ch + 'px';
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
  }
  renderLine(column: number, lineInfo: LineInfo): void {
    const { life, numOff, tickActivate, currTick, endNewness, line } = lineInfo;
    const {tbody} = this;
    for (let y = 0; y < numOff; ++y) {
      const cell = tbody.rows[y].cells[column];
      if (cell.textContent !== '') {
        cell.textContent = '';
      }
    }
    for (let y = numOff, idx = 0; idx < line.length; ++idx, ++y) {
      const cell = tbody.rows[y].cells[column];
      cell.textContent = line[idx];
      if ((life === -1 || life === 16) && line.length - idx >= endNewness) {
        cell.style.color = sGREEN;
      } else if (life >= 0 && idx < MAX_LIFE - life) {
        cell.style.color = colorToStr(LstTailGrad[idx + life]);
      } else if (line.length - idx < endNewness) {
        cell.style.color = colorToStr(LstHeadGrad[line.length - (idx + 1)])
      } else {
        cell.style.color = sGREEN;
      }
    }
  }
}
