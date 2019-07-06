export class AsyncTaskList<T, V> {
  fn: (fdata: T, item: V, next: () => void) => void;
  idx: number;
  items: V[];
  data: T;
  done: null | ((data: T) => void);
  constructor(fn: (fdata: T, item: V, next: () => void) => void, items: V[], data: T) {
    this.fn = fn;
    this.idx = 0;
    this.items = items;
    this.data = data;
    this.next = this.next.bind(this);
    this.done = null;
  }
  next() {
    if (this.idx >= this.items.length) {
      if (typeof this.done === 'function') {
        this.done(this.data);
      }
    } else {
      this.fn(this.data, this.items[this.idx++], this.next);
    }
  }
  start(done: (data: T) => void) {
    this.done = done;
    this.next();
  }
}
class Random {
  random(): number {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] / 0x100000000;
  }
  randint(a: number, b: number): number {
    a = Math.ceil(a);
    b = Math.floor(b);
    return Math.floor(this.random() * (b - a + 1)) + a;
  }
  shuffle(lst: any[]) {
    let currentIndex = lst.length, temporaryValue: any, randomIndex: number;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(this.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = lst[currentIndex];
      lst[currentIndex] = lst[randomIndex];
      lst[randomIndex] = temporaryValue;
    }

    return lst;
  }
}
export const safeRnd = new Random();
export function throttled(fn: (...args: any[]) => void, ms: number): (...args: any[]) => void {
  let id = null;
  let args = null;
  const fnInner = function () {
    const arg1 = args;
    args = null;
    id = null;
    fn.apply(null, arg1);
  };
  return function () {
    args = [];
    for (let i = 0; i < arguments.length; ++i) {
      args.push(arguments[i]);
    }
    if (id != null) {
      clearTimeout(id);
    }
    id = setTimeout(fnInner, ms);
  }
}
