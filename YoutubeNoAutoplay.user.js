// ==UserScript==
// @name        YoutubeNoAutoplay
// @namespace   localhost
// @include     http://www.youtube.com/*
// @include     https://www.youtube.com/*
// @version     1
// @grant       none
// ==/UserScript==

function contentEval(source) {
  var script = document.createElement('script');
  script.setAttribute("type", "application/javascript");
  script.textContent = source;

  document.body.appendChild(script);
  document.body.removeChild(script);
}

function ytplayerStateChanged(newState) {
    console.log("newState: " + newState);
    console.log("toBlock: " + ytplayerStateChanged.toBlock);
    
    if (ytplayerStateChanged.toBlock) {
        ytplayerStateChanged.toBlock = false;
        ytplayerStateChanged.ytplayer.pauseVideo();            
    }
    
    if (newState == -1) {
        ytplayerStateChanged.toBlock = true;
    }
}

contentEval('' + ytplayerStateChanged);

function onYouTubePlayerReady(playerId) { 
    if (document.querySelector(".html5-video-player")) { 
        onYouTubePlayerReadyHTML5(playerId); 
    }
    else {
        onYouTubePlayerReadyFlash(playerId); 
    }    
};


if (document.querySelector(".html5-video-player")) { //Using HTML5 Player
	console.log("HTML5 Player");
	
    function simulateClick(element)
    {           
        var clickEvent = new MouseEvent('click');
        element.dispatchEvent(clickEvent);
    }

    var playButton = document.querySelector(".ytp-button-pause");
        
    if (playButton) {
        simulateClick(playButton);   
    }
    
    function onYouTubePlayerReadyHTML5(playerId) {
        var ytplayer = playerId;
        
        console.log("ytplayer: " + ytplayer);

        ytplayer.pauseVideo();
        
        ytplayerStateChanged.toBlock = false;
        ytplayerStateChanged.ytplayer = ytplayer;
        
        ytplayer.addEventListener("onStateChange", "ytplayerStateChanged");              
	}
        
	//Cross browser method, unsafeWindow totally supported only on Firefox
	contentEval('' + simulateClick);
    contentEval('' + onYouTubePlayerReadyHTML5);
	contentEval('' + onYouTubePlayerReady);
}
else if (document.querySelector("#player-api")) { //Using Flash Player
	console.log("Flash Player");
	
	function replaceFlashPlayerWithNoAutoplay() {
		//On channel presentation page
		var moviePlayer = document.querySelector("#c4-player");
		
		if (!moviePlayer) {
			//On classic video page
			moviePlayer = document.querySelector("#movie_player");
		}		
	
		var flashVars = moviePlayer.getAttributeNode("flashvars");
		flashVars.value.replace("&autoplay=1", "");
		flashVars.value = flashVars.value + "&autoplay=0";
	
		//On channel presentation page
		var playerDiv = document.querySelector("#upsell-video");
		
		if (!playerDiv) {
			//On classic video page
			playerDiv = document.querySelector("#player-api");
		}
		
		embeddedFlashHTML = playerDiv.innerHTML;
		
		playerDiv.innerHTML = " ";
		playerDiv.innerHTML = embeddedFlashHTML;
	}
	
	function onYouTubePlayerReadyFlash(playerId) {
        onYouTubePlayerReady = undefined;
        
		replaceFlashPlayerWithNoAutoplay();
        
        var ytplayer = playerId;
        
        console.log("ytplayer: " + ytplayer);

        ytplayer.pauseVideo();
        
        ytplayerStateChanged.toBlock = false;
        ytplayerStateChanged.ytplayer = ytplayer;
        
        ytplayer.addEventListener("onStateChange", "ytplayerStateChanged");		
	}
    	
	//Cross browser method, unsafeWindow totally supported only on Firefox
	contentEval('' + replaceFlashPlayerWithNoAutoplay);
    contentEval('' + onYouTubePlayerReadyFlash);
	contentEval('' + onYouTubePlayerReady);	
}
else { //Not on a video page
	console.log("No Player");
}

