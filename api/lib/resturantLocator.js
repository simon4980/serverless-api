const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});

//https://github.com/sunng87/node-geohash
const geohash = require('ngeohash');
const fs = require('fs');

module.exports = class resturantLocator {
  constructor(strZipCode) {
    this.strZipCode = strZipCode;
    this.ddb = new AWS.DynamoDB();
  }

  getLocations() {
    var strZipCode = this.strZipCode;
    var ddb = this.ddb;
    return new Promise(function(resolve, reject){
      // setTimeout(function() { resolve(10); }, 3000);
      fs.readFile('zip.csv', {encoding: 'utf-8'}, function(err,data){
        if (!err) {
          var regex = new RegExp(strZipCode+',\\d{2}\\.\\d{6},-{0,1}[\\d\\.]+\\n');
          var matches = data.match(regex);
          if (matches) {
            console.log('FOUND');
            var arrZipGeo = matches[0].split(',');
            // https://github.com/sunng87/node-geohash
            var strGeoHash = geohash.encode(arrZipGeo[1].trim(), arrZipGeo[2].trim());
            console.log(strGeoHash.substring(0,4));
            // console.log(geohash.neighbors(strGeoHash));
            // console.log(strGeoHash);
            // console.log('9xj64svmxfun');
            // http://www.markomedia.com.au/dynamodb-for-javascript-cheatsheet/
            var params = {
              ExpressionAttributeValues: {
               ":v1": {
                 S: strGeoHash.substring(0,4)//"9xj64svmxfun"
                }
              },
              KeyConditionExpression: "geohashkey = :v1",
              TableName: 'restaurants'
            };

            resolve(
              {
                Items: [
                  {
"location": {
"M": {
"country": {
"S": "US"
},
"address3": {
"NULL": true
},
"city": {
"S": "Lafayette"
},
"address1": {
"S": "206 S Public Rd"
},
"display_address": {
"L": [
{
"S": "206 S Public Rd"
},
{
"S": "Lafayette, CO 80026"
}
]
},
"state": {
"S": "CO"
},
"zip_code": {
"S": "80026"
}
}
},
"distance": {
"N": "6900.938706644063"
},
"rating": {
"N": "4.5"
},
"geohashkey": {
"S": "9xj7"
},
"is_closed": {
"N": "0"
},
"transactions": {
"L": []
},
"url": {
"S": "https://www.yelp.com/biz/community-lafayette-5?adjust_creative=cr7ej9geKvPCf2hM9oDdeQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=cr7ej9geKvPCf2hM9oDdeQ"
},
"review_count": {
"N": "156"
},
"name": {
"S": "Community"
},
"display_phone": {
"S": "(720) 890-3793"
},
"rangekey": {
"S": "4e4abd49ec43e448fe1055019f05511e"
},
"categories": {
"L": [
{
"M": {
"title": {
"S": "American (New)"
},
"alias": {
"S": "newamerican"
}
}
},
{
"M": {
"title": {
"S": "Cocktail Bars"
},
"alias": {
"S": "cocktailbars"
}
}
},
{
"M": {
"title": {
"S": "Beer Bar"
},
"alias": {
"S": "beerbar"
}
}
}
]
},
"image_url": {
"S": "https://s3-media1.fl.yelpcdn.com/bphoto/-RdG45TCO8X68QBUhgk-8w/o.jpg"
},
"price": {
"S": "$$"
},
"id": {
"S": "community-lafayette-5"
},
"phone": {
"S": "+17208903793"
},
"coordinates": {
"M": {
"latitude": {
"N": "39.9967500160241"
},
"longitude": {
"N": "-105.090158981073"
}
}
}
}
                ]
              }
            );

            // ddb.query(params, function(err, data) {
            //   if(err) {
            //     console.log(err);
            //     reject(err);
            //   } else {
            //     console.log(data);
            //     resolve(data);
            //   }
            // });

          } else {
            console.log('NO MATCH');
            resolve({});
          }
        } else {
            console.log(err);
            reject(err);
        }
      });
    });
  }
}
