module.exports = class apiCheck {

  constructor(objValidator) {
    this.objValidator = objValidator;
    this.response = {
      statusCode: 200,
      body: {
        status: 'Success',
        message: '',
        data:null
      }
    };
  }

  getResponse() {
    // this.response.body = JSON.stringify(this.response.body);
    console.log(this.response.body);
    return this.response;
  }

  run() {
    if (this.objValidator && this.objValidator.validate() == false) {
        this.response.statusCode = 400;
        this.response.body.message = 'Error validating parameters.';
        this.response.body.error = this.objValidator.failedRules();

        return false;
    }

    return true;
  }

  setData(data) {
    // console.log(JSON.stringify(data));
    this.response.body.data = data;
  }

  setSuccess() {
    this.response.status = 'Success';
  }

  setError() {
    this.response.status = 'Error';
  }

  setMessage(message) {
    this.response.body.message = message;
  }

  setStatusCode(intStatusCode) {
    if (intStatusCode >= 200 || intStatusCode <= 511) {
      this.response.statusCode = intStatusCode;
    }
  }


}
