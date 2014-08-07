var argv = require('minimist')(process.argv.slice(2));
var csv = require("fast-csv");

var grants = {};
var crsid = argv['crs'] || 'bds10';
crsid = crsid.toLowerCase();

/**
 * Parse a grants CSV file and keep track of the awarded grants per CRSid
 *
 * @param {String}      filename        Relative path to the grants CSV file that needs to be parsed
 * @param {Function}    callback        Standard callback function
 */
var parseCSV = function(filename, callback) {
    csv
     .fromPath(filename, {headers : true, trim: true})
     .on("record", function(data) {
         // Add the CRSid associated to the grant entry
         var crs = data['CRSID'];
         if (crs) {
             crs = crs.toLowerCase();
             grants[crs] = grants[crs] || [];
             grants[crs].push(data);
         }

        // Add the CRSid of the PI associated to the grant entry
        var pi = data['Award PI CRSID'];
        if (pi) {
            pi = pi.toLowerCase();
            if (pi !== crs) {
                grants[pi] = grants[pi] || [];
                grants[pi].push(data);
            }
        }
     })
     .on("end", callback);
}

parseCSV('Staff with associated grants - start-2013.csv', function() {
    parseCSV('Staff with associated grants 2014 at July 14.csv', function() {
        console.log(grants[crsid] || [])
    });
});
