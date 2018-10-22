
window.addEventListener('load', function() {
  // Initialize the option controls.
  if(localStorage.names != undefined && localStorage.names != null){
    options.names.value = JSON.parse(localStorage.names).join("\n");
  }
  
  if(localStorage.frequency != undefined && localStorage.frequency != null){
	  options.frequency.value = localStorage.frequency;
  }

  // Set the display activation and frequency.
  options.names.onchange = function() {
    localStorage.names = JSON.stringify(options.names.value.split('\n'));
  };

  options.frequency.onchange = function() {
    localStorage.frequency = options.frequency.value;
  };
});
