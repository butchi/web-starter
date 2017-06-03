import ns from './ns';
import PageCommon from '../page/common';
import PageIndex from '../page/index';

export default class Router {
  constructor() {
    this.initialize();
  }

  initialize() {
    const $body = $('body');

    this.pageCommon = new PageCommon();

    if($body.hasClass('page-index')) {
      this.pageIndex = new PageIndex();
    }
  }
}
