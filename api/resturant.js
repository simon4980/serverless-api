'use strict';
// https://www.npmjs.com/package/dynamodb-geo

const parameterValidation = require('./lib/parameterValidation.js');
const apiCheck = require('./lib/apiCheck.js');
const resturantLocator = require('./lib/resturantLocator.js');


module.exports.get = (event, context, callback) => {
  var objParamConfig = {
    zip: ['required', 'numeric', 'regex[^\\d{5}$]']
  };

  var objParameterValdiate = new parameterValidation(objParamConfig, event.queryStringParameters);
  var objApiCheck = new apiCheck(objParameterValdiate);
  var strZip = event.queryStringParameters['zip'];
  var objLocations = new resturantLocator(strZip);

  // Failed on run, stop execution
  if (objApiCheck.run() == false) {
    callback(null, objApiCheck.getResponse());
    return;
  }

  objLocations.getLocations().then(function(data){
    console.log("SUCCESS");
    console.log(data)
    objApiCheck.setData(data)
    callback(null, objApiCheck.getResponse());
  }).catch(function(err){
    console.log('ERROR');
    console.log(err);
    objApiCheck.setError();
    objApiCheck.setMessage(err);
    callback(null, objApiCheck.getResponse());
  });
}
