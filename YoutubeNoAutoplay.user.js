// ==UserScript==
// @name        YoutubeHtml5Blocker
// @namespace   localhost
// @include     http://www.youtube.com/*
// @include     https://www.youtube.com/*
// @version     1
// @grant       none
// ==/UserScript==

function contentEval(source) {
  if ('function' == typeof source) {
    source = '(' + source + ')();'
  }

  var script = document.createElement('script');
  script.setAttribute("type", "application/javascript");
  script.textContent = source;

  document.body.appendChild(script);
  document.body.removeChild(script);
}

//Using HTML5 Player
if (document.querySelector(".html5-video-player")) {
	console.log("HTML5 Player");
	
    function simulateClick(element)
    {           
        var clickEvent = new MouseEvent('click');
        element.dispatchEvent(clickEvent);
    }

    var playButton = document.querySelector(".ytp-button-pause");
        
    while (null == playButton) {    	
        playButton = document.querySelector(".ytp-button-pause");        
    }
    
    simulateClick(playButton);
}
//Using Flash Player
else if (document.querySelector("#player-api")) {
	console.log("Flash Player");
	
	function replaceFlashPlayerWithNoAutoplay() {
		var moviePlayer = document.querySelector("#movie_player");
		var autoplayStr = "&autoplay=0";
	
		var flashVars = moviePlayer.getAttributeNode("flashvars");
		flashVars.value = flashVars.value + "&autoplay=0";
	
		var playerDiv = document.querySelector("#player-api");
		embeddedFlashHTML = playerDiv.innerHTML;
		
		playerDiv.innerHTML = " ";
		playerDiv.innerHTML = embeddedFlashHTML;
	}
	
	function onYouTubePlayerReady() {
		replaceFlashPlayerWithNoAutoplay();
		onYouTubePlayerReady = undefined;
	}
	
	//Cross browser method, unsafeWindow totally supported only on Firefox
	contentEval('' + replaceFlashPlayerWithNoAutoplay);
	contentEval('' + onYouTubePlayerReady);
	
	//unsafeWindow.onYouTubePlayerReady = function() {
	//	replaceFlashPlayerWithNoAutoplay(); 
	//	unsafeWindow.onYouTubePlayerReady = null;
	//};	
}
//Not on a video page
else {
	console.log("No Player");
}
