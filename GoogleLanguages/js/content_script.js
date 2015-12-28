/**
 * Content script for Google Languages
 * @author Pete
 */

var searchFormId = 'tsf';
var inputTextFieldId = 'lst-ib';
 
// available search languages
var languageOptionValueTextPairs = {
  "": "bármely nyelv", // szándékosan üres string (üres a value) - kicsit gagyi megoldás, de jó az vidékre :D
  "lang_hu": "magyar",
  "lang_en": "angol",
  "lang_af": "afrikansz",
  "lang_ar": "arab",
  "lang_be": "belorusz",
  "lang_bg": "bolgár",
  "lang_cs": "cseh",
  "lang_da": "dán",
  "lang_eo": "eszperantó",
  "lang_et": "észt",
  "lang_tl": "filippinó",
  "lang_fi": "finn",
  "lang_fr": "francia",
  "lang_el": "görög",
  "lang_iw": "héber",
  "lang_hi": "hindi",
  "lang_nl": "holland",
  "lang_hr": "horvát",
  "lang_id": "indonéz",
  "lang_is": "izlandi",
  "lang_ja": "japán",
  "lang_ca": "katalán",
  "lang_zh-CN": "kínai&nbsp;(egyszerűsített)",
  "lang_zh-TW": "kínai&nbsp;(hagyományos)",
  "lang_ko": "koreai",
  "lang_pl": "lengyel",
  "lang_lv": "lett",
  "lang_lt": "litván",
  "lang_de": "német",
  "lang_no": "norvég",
  "lang_it": "olasz",
  "lang_ru": "orosz",
  "lang_hy": "örmény",
  "lang_fa": "perzsa",
  "lang_pt": "portugál",
  "lang_ro": "román",
  "lang_es": "spanyol",
  "lang_sv": "svéd",
  "lang_sr": "szerb",
  "lang_sk": "szlovák",
  "lang_sl": "szlovén",
  "lang_sw": "szuahéli",
  "lang_th": "thai",
  "lang_tr": "török",
  "lang_uk": "ukrán",
  "lang_vi": "vietnámi"
};

// file types that we can search for
var fileTypesValueTextPairs =  {
  "": "bármely formátum",
  "pdf": "Adobe Acrobat PDF (.pdf)",
  "ps": "Adobe Postscript (.ps)",
  "dwf": "Autodesk DWF (.dwf)",
  "kml": "Google Earth KML (.kml)",
  "kmz": "Google Earth KMZ (.kmz)",
  "xls": "Microsoft Excel (.xls)",
  "ppt": "Microsoft Powerpoint (.ppt)",
  "doc": "Microsoft Word (.doc)",
  "rtf": "Rich Text Format (.rtf)",
  "swf": "Shockwave Flash (.swf)"
};

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

function getNewQueryStringKeyValue(queryString, key, value) {
  var queryStringValuesAsDict = parseQueryStringAsDict(queryString);
  if(queryStringValuesAsDict === null) {
    queryStringValuesAsDict = { }; // initialize as a new object
  }
  
  if(!queryStringValuesAsDict['q']) { // check if "q" key is set (it's the search value the user looks for in the search field)
    // set q to the value that the user searches for
    var inputTextField = document.getElementById(inputTextFieldId);
    queryStringValuesAsDict['q'] = inputTextField.value.replace(' ', '+');

  }
  queryStringValuesAsDict[key] = value;
  
  var newQueryString = "";  
  for (var currentValue in queryStringValuesAsDict) {
    if (queryStringValuesAsDict.hasOwnProperty(currentValue)) {
        console.log(currentValue+'='+queryStringValuesAsDict[currentValue])
        if(newQueryString !== "") {
          newQueryString += "&";
        }
        newQueryString += currentValue+'='+queryStringValuesAsDict[currentValue];
    }
  }
  console.log('newQueryString: ', newQueryString)
  return newQueryString;
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

/**
 * @see http://stackoverflow.com/a/11920807/517705
 */
function getHashValue(key) {
  var regexpMatchArray = window.location.hash.match(new RegExp(key+'=([^&]*)'));
  return (regexpMatchArray !== null && regexpMatchArray.length >= 2) ? regexpMatchArray[1] : '';
}

function getKeyFromHashValueOrQueryString(hashKey) {
  var hashValue = getHashValue(hashKey);
  // var hashValues = getQueryStringValuesInHash();
  // var hashValue = hashValues[hashKey];
  
  if(hashValue) {
    return hashValue;
  }
  
  // egyébként meg a query stringből szedjük ki (pl. ?lr=lang_hu&...)
  return getQueryStringValue(hashKey);
}

function getNewSelectList(selectId, selectClassName, selectFormName, optionValueTextPairs, currentValueSelected){
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
      if(currentValueSelected === optionValue){
        newOption.setAttribute("selected", "selected");      
      }
      newOption.text = optionValueTextPairs[optionValue];
      newSelect.appendChild(newOption);    
    }
  }

  return newSelect;
}

function onSearchSubmit(e) { 
  console.log('Submit button has been clicked: ', e);
}

window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false); //remove listener, no longer needed
    init();  
},false);

function init(){
  var searchForm = document.getElementById(searchFormId);
  var inputTextField = document.getElementById(inputTextFieldId);  
  
  var currentLanguageKeySelected = getKeyFromHashValueOrQueryString("lr");
  var googleSearchSubmitButton = document.querySelector('button[name="btnG"]');
  var googleSearchSubmitButtonParentNode = googleSearchSubmitButton.parentNode;
  var googleSearchFormNode = googleSearchSubmitButtonParentNode.parentNode;

  var newFieldset = document.createElement("fieldset");
  newFieldset.setAttribute("id", "google-search-languages-container");

  var newLanguageSelect = getNewSelectList("google-search-languages-select", 
                                   "goog-menu advsearch-menu jfk-scrollbar",
                                   "lr",
                                   languageOptionValueTextPairs,
                                   currentLanguageKeySelected);

  newFieldset.appendChild(newLanguageSelect);

  // Insert the new element into the DOM before the Google button container
  googleSearchFormNode.insertBefore(newFieldset, googleSearchSubmitButtonParentNode);

  // filetypes event handler
  var fileTypes = Object.keys(fileTypesValueTextPairs);
  // remove "" key from this array (it's unnecessary)
  fileTypes.splice(0,1);
  // anything after "filetype:" except spaces
  var fileTypeRegExp = new RegExp("filetype:([^\\s]+)");  
  
  // var currentFileTypeSelected = getKeyFromHashValueOrQueryString("as_filetype");
  // var matchingFileType = inputTextField.value.match(fileTypeRegExp);
  var currentSearchValueInUrl = getKeyFromHashValueOrQueryString("q");
  // decoding URI and replacing + to spaces
  var currentSearchValue = decodeURI(currentSearchValueInUrl).replace(/\+/g, ' ');
  // get the filetype typed by the user (if any)
  var matchingFileType = currentSearchValue.match(fileTypeRegExp);
  var currentFileTypeSelected = ( matchingFileType !== null && matchingFileType.length === 2 ? matchingFileType[1] : "" );

  var newFileTypeSelect = getNewSelectList("google-search-filetypes-select", 
                                   "goog-menu advsearch-menu jfk-scrollbar",
                                   "lr",
                                   fileTypesValueTextPairs,
                                   currentFileTypeSelected);

  newFieldset.appendChild(newFileTypeSelect);

  // Insert the new element into the DOM before the Google button container
  googleSearchFormNode.insertBefore(newFieldset, googleSearchSubmitButtonParentNode);

  // console.log('inputTextField: ', inputTextField);
  // console.log('inputTextField.value: ', inputTextField.value);
  // console.log('inputTextField.onsubmit: ', inputTextField.onsubmit);
  // console.log('window.onsubmit: ', window.onsubmit);
  // console.log('searchForm.onsubmit: ', searchForm.onsubmit);

  searchForm.addEventListener('submit', onSearchSubmit, false);
  // searchForm.addEventListener('submit', onSearchSubmit, true);
  googleSearchSubmitButton.addEventListener('click', onSearchSubmit, false);
  // TODO: it does not work yet...
  inputTextField.addEventListener('keyup', function(e){
    // console.log('keyup: ', e);
    var enterKeyCode = 13;
    if (e.keyCode == enterKeyCode) { // Enter key
      console.log('enter key pressed');
    }  
  }, false);
  
  newLanguageSelect.addEventListener("change", function() {
    var queryStringWithNewLangKey = getNewQueryStringKeyValue(window.location.hash.substring(0), 'lr', newLanguageSelect.value);
    window.location.hash = '#'+queryStringWithNewLangKey;
  });
  
  newFileTypeSelect.addEventListener("change", function() {
      var currentSearchValue = inputTextField.value;
      var currentFileTypeSelected = newFileTypeSelect.value;
      // var fileTypeRegExpRealValues = new RegExp("filetype:("+fileTypes.join('|')+")");
            
      // if selected filetype is equal to empty string, just delete the filetype:xyz part
      // (not to type: "filetype:" without any real value)
      var replaceSearchPartTo = ( currentFileTypeSelected === "" ? "": "filetype:"+currentFileTypeSelected );
      
      var newSearchValue = currentSearchValue.replace(fileTypeRegExp, replaceSearchPartTo);
      
      // if a new filetype is selected and nothing had to be
      // replaced (no filetypes were selected earlier),
      // only append the string
      if(currentFileTypeSelected !== "" && currentSearchValue === newSearchValue) {
        newSearchValue = currentSearchValue.trim() + " " + replaceSearchPartTo;
      }
      
      inputTextField.value = newSearchValue; 

      // set new hash value
      var queryStringWithNewSearchValue = getNewQueryStringKeyValue(window.location.hash.substring(0), 'q', newSearchValue);
      window.location.hash = '#'+queryStringWithNewSearchValue;

  });  
  
}

/* example for a search:

https://www.google.hu/search?q=test

advanced search:

https://www.google.hu/search?
hl=hu&
as_q=test&
as_epq=&
as_oq=&
as_eq=&
as_nlo=&
as_nhi=&
lr=lang_hu&
cr=&
as_qdr=all&
as_sitesearch=&
as_occt=any&
safe=active&
as_filetype=&
as_rights=

Biztonságos keresés bekapcsolva:

https://www.google.hu/search?
hl=hu&
as_q=test&
as_epq=&
as_oq=&
as_eq=&
as_nlo=&
as_nhi=&
lr=lang_hu&
cr=&
as_qdr=all&
as_sitesearch=&
as_occt=any&
safe=active&
as_filetype=&
as_rights=

*/
