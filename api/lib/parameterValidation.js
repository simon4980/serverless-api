module.exports = class parameterValidation {

  constructor(objConfig, objParameters) {
    this.setObjConfig(objConfig);
    this.setObjParameters(objParameters);
    this.objFailedRules = {};
  }

  getObjConfig() {
    return this.objConfig;
  }

  getObjParameters() {
    return this.objParameters;
  }

  setObjConfig(objConfig) {
    if (typeof(objConfig) == 'object') {
      this.objConfig = objConfig
    } else {
      this.objConfig = {}
    }
  }

  setObjParameters(objParameters) {
    if (typeof(objParameters) == 'object') {
      this.objParameters = objParameters
    } else {
      this.objParameters = {}
    }
  }

  validate() {
    var arrRules, arrRule;
    var strRule;

    Object.keys(this.getObjConfig()).forEach(key => {
      // If string convert to array
      if (typeof(this.getObjConfig()[key]) == 'string') {
          arrRules = [this.getObjConfig()[key]];
      } else {
        arrRules = this.getObjConfig()[key];
      }
      Object.keys(arrRules).forEach(intRuleKey => {
        // Do not continue if we already have failed a rule for key
        if (key in this.objFailedRules) {
          return;
        }

        arrRule = arrRules[intRuleKey].split('[');
        strRule = arrRule[0];
        // Only one then add the other value.
        if (arrRule.length == 1) {
          arrRule[1] = null;
        } else {
          arrRule[1] = arrRule[1].substring(0, (arrRule[1].length - 1))
        }

        // If failed add to list
        if (this[strRule](key, arrRule[1]) == false) {
            this.objFailedRules[key] = strRule;
        }
      });
    });

    return (Object.keys(this.objFailedRules).length === 0 && this.objFailedRules.constructor === Object);
  }

  failedRules() {
    return this.objFailedRules;
  }

  required(key) {
    // Key exists and has a value.
    if (key in this.getObjParameters() && this.getObjParameters()[key].trim()) {
      return true;
    }

    return false;
  }

  numeric(key) {
    return this.getObjParameters()[key].match(/^\d+$/) != null;
  }

  regex(key, regexVal) {
    var re = new RegExp(regexVal);
    return this.getObjParameters()[key].match(re) != null;
  }
}
