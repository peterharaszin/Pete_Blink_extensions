	/**
 * Content script for Google Languages
 * @author Pete
 */
var searchFormId = 'tsf';
var inputTextFieldId = 'lst-ib';

(function() {

    console.log("Hello from Google Languages extension!");
    console.log("Testing Zepto.js: ");
    console.log($("#tsf"));

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
    var fileTypesValueTextPairs = {
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

    function onSearchSubmit(e) {
        console.log('Submit button has been clicked: ', e);
    }

    /**
     * Undirect Google URLs -- taken from Undirect: https://chrome.google.com/webstore/detail/undirect/dohbiijnjeiejifbgfdhfknogknkglio
     * (https://github.com/xwipeoutx/undirect/blob/master/src/undirect.js)
     */
    function undirect() {
        var scriptToExecute = (function() {
            var expectedRwt = function() {
                return true;
            };

            var replaceRwtFunction = function() {
                if (window.rwt && window.rwt != expectedRwt) {
                    delete window.rwt;
                    Object.defineProperty(window, 'rwt', {
                        value: expectedRwt,
                        writable: false
                    });
                }
            };

            replaceRwtFunction();

            var timeoutId = 0;
            document.body.addEventListener("DOMNodeInserted", function() {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                timeoutId = setTimeout(replaceRwtFunction, 1000);
            }, false);
        });

        // Write script to page - since plugins often work in an isolated world, this gives us the
        // ability to replace JavaScript added by the page
        var fnContents = scriptToExecute.toString();
        var executeFnScript = '(' + fnContents + ')();';

        var script = document.createElement('script');
        script.textContent = executeFnScript;
        (document.head || document.documentElement).appendChild(script);
        script.parentNode.removeChild(script);
    }

    function init() {
        var searchForm = document.getElementById(searchFormId);
        var inputTextField = document.getElementById(inputTextFieldId);

        var currentLanguageKeySelected = getKeyFromHashValueOrQueryString("lr");
        var googleSearchSubmitButton = document.querySelector('button[name="btnG"]');
        var googleSearchSubmitButtonParentNode = googleSearchSubmitButton.parentNode.parentNode;
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
        // googleSearchFormNode.insertBefore(newFieldset, googleSearchSubmitButtonParentNode);
        // googleSearchFormNode.appendChild(newFieldset);

        // filetypes event handler
        var fileTypes = Object.keys(fileTypesValueTextPairs);
        // remove "" key from this array (it's unnecessary)
        fileTypes.splice(0, 1);
        // anything after "filetype:" except spaces
        var fileTypeRegExp = new RegExp("filetype:([^\\s]+)");

        // var currentFileTypeSelected = getKeyFromHashValueOrQueryString("as_filetype");
        // var matchingFileType = inputTextField.value.match(fileTypeRegExp);
        var currentSearchValueInUrl = getKeyFromHashValueOrQueryString("q");
        // decoding URI and replacing + to spaces
        var currentSearchValue = decodeURI(currentSearchValueInUrl).replace(/\+/g, ' ');
        // get the filetype typed by the user (if any)
        var matchingFileType = currentSearchValue.match(fileTypeRegExp);
        var currentFileTypeSelected = (matchingFileType !== null && matchingFileType.length === 2 ? matchingFileType[1] : "");

        var newFileTypeSelect = getNewSelectList("google-search-filetypes-select",
            "goog-menu advsearch-menu jfk-scrollbar",
            "lr",
            fileTypesValueTextPairs,
            currentFileTypeSelected);

        newFieldset.appendChild(newFileTypeSelect);

        // Insert the new element into the DOM before the Google button container
        // googleSearchFormNode.insertBefore(newFieldset, googleSearchSubmitButtonParentNode);
		googleSearchFormNode.appendChild(newFieldset);
        
		// console.log('inputTextField: ', inputTextField);
        // console.log('inputTextField.value: ', inputTextField.value);
        // console.log('inputTextField.onsubmit: ', inputTextField.onsubmit);
        // console.log('window.onsubmit: ', window.onsubmit);
        // console.log('searchForm.onsubmit: ', searchForm.onsubmit);

        searchForm.addEventListener('submit', onSearchSubmit, false);
        // searchForm.addEventListener('submit', onSearchSubmit, true);
        googleSearchSubmitButton.addEventListener('click', onSearchSubmit, false);
        // TODO: it does not work yet...
        inputTextField.addEventListener('keyup', function(e) {
            // console.log('keyup: ', e);
            var enterKeyCode = 13;
            if (e.keyCode == enterKeyCode) { // Enter key
                console.log('enter key pressed');
            }
        }, false);

        newLanguageSelect.addEventListener("change", function() {
            var queryStringWithNewLangKey = getNewQueryStringKeyValue(window.location.hash.substring(0), 'lr', newLanguageSelect.value);
            window.location.hash = '#' + queryStringWithNewLangKey;
        });

        newFileTypeSelect.addEventListener("change", function() {
            var currentSearchValue = inputTextField.value;
            var currentFileTypeSelected = newFileTypeSelect.value;
            // var fileTypeRegExpRealValues = new RegExp("filetype:("+fileTypes.join('|')+")");

            // if selected filetype is equal to empty string, just delete the filetype:xyz part
            // (not to type: "filetype:" without any real value)
            var replaceSearchPartTo = (currentFileTypeSelected === "" ? "" : "filetype:" + currentFileTypeSelected);

            var newSearchValue = currentSearchValue.replace(fileTypeRegExp, replaceSearchPartTo);

            // if a new filetype is selected and nothing had to be
            // replaced (no filetypes were selected earlier),
            // only append the string
            if (currentFileTypeSelected !== "" && currentSearchValue === newSearchValue) {
                newSearchValue = currentSearchValue.trim() + " " + replaceSearchPartTo;
            }

            inputTextField.value = newSearchValue;

            // set new hash value
            var queryStringWithNewSearchValue = getNewQueryStringKeyValue(window.location.hash.substring(0), 'q', newSearchValue);
            window.location.hash = '#' + queryStringWithNewSearchValue;

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
	var observer = new MutationObserver(function(mutations) {
	  mutations.forEach(function(mutation) {
		if (!mutation.addedNodes) {
			return;
		}

		for (var i = 0; i < mutation.addedNodes.length; i++) {
		  // do things to your newly added nodes here
		  var node = mutation.addedNodes[i];
		  if(node.id === inputTextFieldId) {
				// Cool, the element which we were waiting for has appeared, we can continue modifying the document
				// stop watching using:
				observer.disconnect();
				init();
				undirect();
		  }
		}
	  })
	});

	// observer.observe(document.body, { // content_script.js:404 Uncaught TypeError: Failed to execute 'observe' on 'MutationObserver': parameter 1 is not of type 'Node'.
	observer.observe(document, {
		childList: true
	  , subtree: true
	  , attributes: false
	  , characterData: false
	});

    // var readyStateCheckInterval = setInterval(function() {
        // if (document.body !== null) {
            // clearInterval(readyStateCheckInterval);
            // undirect();
        // }
    // }, 10);

    // window.addEventListener("load", function load(event) {
        // window.removeEventListener("load", load, false); //remove listener, no longer needed
        
    // }, false);
	
	console.log("stuff ");
	
	window.addEventListener("hashchange", function(e){
		console.log("hash changed! ", e);
	}, false);

})();