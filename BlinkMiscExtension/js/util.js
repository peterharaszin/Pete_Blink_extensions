/**
 * Get query string values (as field-value pairs)
 * 
 * @returns {object} the query string values or null if there are no query string fields
 * 
 * @see http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript/21152762#21152762
 */
function getQueryStringValues() {
  if (window.location.search === "") {
    return null;
  }

  var queryDict = {};
  window.location.search.substr(1).split("&").forEach(function(item) {
    queryDict[item.split("=")[0]] = item.split("=")[1];
  });

  return queryDict;
}

/**
 * Get the query string field's value (from the series of field-value pairs)
 * 
 * @param {string} field The field's name
 * @returns {string} The query string field's value
 */
function getQueryStringValue(field) {
  var queryDict = getQueryStringValues();
  return (queryDict[field] !== undefined ? queryDict[field] : null);
}