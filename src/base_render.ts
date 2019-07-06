import { LineInfo, EngineData } from "./base_engine";

export interface IRenderer {
  onResize(engineData: EngineData): void;
  onInit(engineData: EngineData): Promise<any>;
  renderLine(column: number, line: LineInfo): void;
}

export class SettingsPanel {
  engineData: EngineData;
  panel: HTMLDivElement;
  form: HTMLFormElement;
  densityInput: HTMLInputElement;
  rateInput: HTMLInputElement;
  chngDensityInput: HTMLInputElement;
  endChanceInput: HTMLInputElement;
  apply: HTMLInputElement;
  cancel: HTMLInputElement;
  ok: HTMLInputElement;
  constructor(engineData: EngineData, panel: HTMLDivElement) {
    this.engineData = engineData;
    this.panel = panel;
    const form = this.form = panel.getElementsByTagName('form')[0];
    this.densityInput = <HTMLInputElement>form.children.namedItem('density');
    this.rateInput = <HTMLInputElement>form.children.namedItem('rate');
    this.chngDensityInput = <HTMLInputElement>form.children.namedItem('chngDensity');
    this.endChanceInput = <HTMLInputElement>form.children.namedItem('endChance');
    this.apply = <HTMLInputElement>form.children.namedItem('apply');
    this.cancel = <HTMLInputElement>form.children.namedItem('cancel');
    this.ok = <HTMLInputElement>form.children.namedItem('ok');
    this.form.addEventListener('submit', this);
    this.cancel.addEventListener('click', this);
    this.apply.addEventListener('click', this);
  }
  handleEvent(e: UIEvent) {
    if (e.currentTarget === this.form) {
      e.preventDefault();
      if (this.saveSettings()) {
        this.hide();
      }
    } else if (e.currentTarget === this.cancel) {
      this.hide();
    } else if (e.currentTarget === this.apply) {
      this.saveSettings();
    }
  }
  saveSettings() {
    const d = +this.densityInput.value;
    const r = +this.rateInput.value;
    const cd = +this.chngDensityInput.value;
    const ec = +this.endChanceInput.value;
    if (isNaN(d) || isNaN(r) || isNaN(cd) || isNaN(ec)) {
      return false;
    }
    this.engineData.setParameters(d, r, cd, ec);
    return true;
  }
  show() {
    const {density, rate, chngDensity, endChance} = this.engineData;
    this.densityInput.value = '' + density;
    this.rateInput.value = '' + rate;
    this.chngDensityInput.value = '' + chngDensity;
    this.endChanceInput.value = '' + endChance;
    this.panel.style.display = '';
  }
  hide() {
    this.panel.style.display = 'none';
  }
}
