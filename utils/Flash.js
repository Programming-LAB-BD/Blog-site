class Flash {
  constructor(req) {
    this.req = req;
    this.success = this.extractFlashMassege("success");
    this.fail = this.extractFlashMassege("fail");
  }

  extractFlashMassege(name) {
    let massege = this.req.flash(name);
    return massege.length > 0 ? massege[0] : false;
  }

  hasMassege() {
    return !this.success && !this.fail ? false : true;
  }

  static getMassege(req) {
    let flash = new Flash(req);
    return {
      success: flash.success,
      fail: flash.fail,
      hasMassege: flash.hasMassege(),
    };
  }
}

module.exports = Flash;
