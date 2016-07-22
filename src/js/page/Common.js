import ns from '../module/ns';

export default class Common {
  constructor(opts = {}) {
    this.initialize();
  }

  initialize() {
    console.log('page common');
  }
}