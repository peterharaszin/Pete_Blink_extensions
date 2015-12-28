(function ($) {  

  function changeFontToCourierNew() {
    console.log('Font changer callback');
  }

  $(function(){
    console.log('Google Docs mods by Pete');
    
    $(document).bind('keydown', 'ctrl+shift+alt+c', changeFontToCourierNew);
  });
})(jQuery);