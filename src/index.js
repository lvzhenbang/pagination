import defaults from '../config/defaults';
import version from '../config/version';

import makeRange from './utils/makeRange';
import inBrowser from './utils/inBrowser';

class Pagination {
  constructor(el, opt) {
    this.$el = el;
    this.options = {
      ...defaults,
      ...opt,
    };
    this.value = this.options.value;

    this.init();
    this.version = version;
  }

  init() {
    if (this.options.totalVisble > this.options.length) {
      throw new Error(`The 'this.options.totalVisble:' ${this.options.totalVisble} must be less than the 'this.options.length': ${this.options.length}`);
    }
    this.$el.innerHTML = '';
    this.genPrev();
    this.genItems();
    this.genNext();
  }

  genPrev() {
    const prevEl = document.createElement('span');
    prevEl.classList.add('btn');
    prevEl.classList.add('prev');
    prevEl.innerHTML = '&lt;';
    this.triggerClick(prevEl, this.pagePrev.bind(this));
    this.$el.appendChild(prevEl);
  }

  genNext() {
    const nextEl = document.createElement('span');
    nextEl.classList.add('btn');
    nextEl.classList.add('next');
    nextEl.innerHTML = '&gt;';
    this.triggerClick(nextEl, this.pageNext.bind(this));
    this.$el.appendChild(nextEl);
  }

  triggerClick(el, callback) {
    el.addEventListener('click', (e) => {
      callback(e);
      if (typeof this.options.onPageClick === 'function') {
        this.options.onPageClick.bind(this)();
      }
    });
  }

  genItems() {
    const items = this.getItems();
    const itemsEl = document.createElement('div');
    itemsEl.classList.add('page-inner');
    items.forEach((val) => {
      const itemEl = document.createElement('span');
      itemEl.classList.add('btn');
      itemEl.classList.add('page-item');
      if (this.value === val) {
        itemEl.classList.add('active');
      }
      if (!Number.isNaN(val)) {
        this.triggerClick(itemEl, this.pageCurrent.bind(this));
      }
      itemEl.innerText = val;
      itemsEl.appendChild(itemEl);
    });

    this.$el.appendChild(itemsEl);
  }

  getItems() {
    const halfVisibleNum = Math.floor(this.options.totalVisble / 2);
    const isEven = this.options.totalVisble % 2 === 0 ? 1 : 0;
    let startArr = [1, '...'];
    let endArr = ['...', this.options.length];
    let edgElNum = 2;

    if (this.options.type !== '...' || this.options.totalVisble < 7) {
      startArr = [];
      endArr = [];
      edgElNum = 0;
    }

    if (this.options.totalVisble < 3) {
      return [this.value];
    }

    if (this.value <= halfVisibleNum) {
      return [...makeRange(1, this.options.totalVisble - edgElNum), ...endArr];
    }

    if (this.value < this.options.length - halfVisibleNum) {
      const end = isEven
        ? this.value + (halfVisibleNum - edgElNum) - 1 : this.value + (halfVisibleNum - edgElNum);
      return [...startArr, ...makeRange(this.value - (halfVisibleNum - edgElNum), end), ...endArr];
    }

    return [
      ...startArr,
      ...makeRange(
        this.options.length - (this.options.totalVisble - edgElNum) + 1,
        this.options.length,
      ),
    ];
  }

  pageNext() {
    if (this.value >= this.options.length) return;
    this.value += 1;
    this.init();
  }

  pagePrev() {
    if (this.value <= 1) return;
    this.value -= 1;
    this.init();
  }

  pageCurrent(e) {
    const nextValue = parseInt(e.target.innerText, 10);
    if (this.value !== nextValue) {
      this.value = nextValue;
      this.init();
    }
  }
}

if (inBrowser) {
  window.Pagination = Pagination;
  window.console.log('plugin is running browser.');
}

export default Pagination;
