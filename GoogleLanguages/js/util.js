/**
 * Utility functions
 * @author Pete
 */

/**
 * 
 * @param queryString
 * @returns {*}
 */
function parseQueryStringAsDict(queryString) {
    if (!queryString || queryString === "") {
        return null;
    }

    var queryDict = {};
    queryString.substr(1).split("&").forEach(function(item) {
        queryDict[item.split("=")[0]] = item.split("=")[1];
    });

    return queryDict;
}

/**
 * Get query string values (as field-value pairs)
 *
 * @returns {object} the query string values or null if there are no query string fields
 *
 * @see http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript/21152762#21152762
 */
function getQueryStringValues() {
    return parseQueryStringAsDict(window.location.search);
}

/**
 * Get query string values in the hash (as field-value pairs)
 *
 * @returns {object} the query string values in the hash string or null if there are no query string fields
 *
 * @see http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript/21152762#21152762
 */
function getQueryStringValuesInHash() {
    return parseQueryStringAsDict(window.location.hash);
}

/**
 * Get the query string field's value (from the series of field-value pairs)
 *
 * @param {string} field The field's name
 * @returns {string} The query string field's value
 */
function getQueryStringValue(field) {
    var queryDict = getQueryStringValues();
    return (queryDict[field] !== undefined ? queryDict[field] : "");
}

/**
 * @see http://stackoverflow.com/a/11920807/517705
 */
function getHashValue(key) {
    var regexpMatchArray = window.location.hash.match(new RegExp(key + '=([^&]*)'));
    return (regexpMatchArray !== null && regexpMatchArray.length >= 2) ? regexpMatchArray[1] : '';
}

/**
 *
 * @param hashKey
 * @returns {string}
 */
function getKeyFromHashValueOrQueryString(hashKey) {
    var hashValue = getHashValue(hashKey);
    // var hashValues = getQueryStringValuesInHash();
    // var hashValue = hashValues[hashKey];

    if (hashValue) {
        return hashValue;
    }

    // egyébként meg a query stringből szedjük ki (pl. ?lr=lang_hu&...)
    return getQueryStringValue(hashKey);
}

function getNewSelectList(selectId, selectClassName, selectFormName, optionValueTextPairs, currentValueSelected) {
    var newSelect = document.createElement("select");
    newSelect.setAttribute("id", selectId);
    newSelect.setAttribute("class", selectClassName);
    newSelect.setAttribute("role", "menu");
    newSelect.setAttribute("name", selectFormName);

    // var optionValueTextPairsKeys = Object.keys(optionValueTextPairs);
    for (var optionValue in optionValueTextPairs) {
        if (optionValueTextPairs.hasOwnProperty(optionValue)) {
            // console.log(optionValue + " -> " + optionValueTextPairs[optionValue]);
            var newOption = document.createElement("option");
            newOption.setAttribute("value", optionValue);
            newOption.setAttribute("class", "goog-menuitem");
            newOption.setAttribute("role", "menuitem");
            if (currentValueSelected === optionValue) {
                newOption.setAttribute("selected", "selected");
            }
            newOption.text = optionValueTextPairs[optionValue];
            newSelect.appendChild(newOption);
        }
    }

    return newSelect;
}

/**
 *
 * @param queryString
 * @param key
 * @param value
 * @returns {string}
 */
function getNewQueryStringKeyValue(queryString, key, value) {
    var queryStringValuesAsDict = parseQueryStringAsDict(queryString);
    if (queryStringValuesAsDict === null) {
        queryStringValuesAsDict = {}; // initialize as a new object
    }

    if (!queryStringValuesAsDict['q']) { // check if "q" key is set (it's the search value the user looks for in the search field)
        // set q to the value that the user searches for
        var inputTextField = document.getElementById(inputTextFieldId);
        queryStringValuesAsDict['q'] = inputTextField.value.replace(' ', '+');

    }
    queryStringValuesAsDict[key] = value;

    var newQueryString = "";
    for (var currentValue in queryStringValuesAsDict) {
        if (queryStringValuesAsDict.hasOwnProperty(currentValue)) {
            console.log(currentValue + '=' + queryStringValuesAsDict[currentValue]);
            if (newQueryString !== "") {
                newQueryString += "&";
            }
            newQueryString += currentValue + '=' + queryStringValuesAsDict[currentValue];
        }
    }
    console.log('newQueryString: ', newQueryString);
    return newQueryString;
}
