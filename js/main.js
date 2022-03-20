var totalDuration = 0;
var lastDuration = 0;
var numberOfBreathes = 0;

// 4-7-8 https://www.cordem.org/globalassets/files/academic-assembly/2017-aa/handouts/day-three/biofeedback-exercises-for-stress-2---fernances-j.pdf
var breatheInTime = 2500;
var holdTime = 4500;
var breatheOutTime = 5000;
var holdTime2 = 4500;
var vibrateOn=true;
var hold2vibrateOn=false;
var vibrateDurationBreatheOut = 100;
var vibrateDurationHold = 250;
var vibrateDurationBreath = 400;

function increaseValue(elementId) {
	var value = parseFloat(document.getElementById(elementId).value);
	value = isNaN(value) ? 0 : value;
	value+=0.5;
	document.getElementById(elementId).value = value;
	
	updateVals(elementId, value);
}

function decreaseValue(elementId) {
	var value = parseFloat(document.getElementById(elementId).value);
	value = isNaN(value) ? 0 : value;
	value < 1 ? value = 1 : '';
	value-=0.5;
	document.getElementById(elementId).value = value;
	
  	updateVals(elementId, value);
}

function vibrateClick(elementId)
{
	vibrateOn = !vibrateOn;
	
	document.getElementById(elementId).checked = vibrateOn;
	tizen.preference.setValue('vibrateOn', vibrateOn);
	
	console.log("vibrateOn: " + vibrateOn);
}

function hold2Click(elementId)
{
	hold2vibrateOn = !hold2vibrateOn;
	
	document.getElementById(elementId).checked = hold2vibrateOn;
	tizen.preference.setValue('hold2vibrateOn', hold2vibrateOn);
	
	console.log("hold2vibrateOn: " + hold2vibrateOn);
}

function updateVals(elementId, value)
{
	if(elementId === 'breatheInDuration' )
	{
		breatheInTime = value*1000;
		tizen.preference.setValue('breatheInTime', breatheInTime);
	}
	else if(elementId === 'breatheOutDuration' )
	{
		breatheOutTime = value*1000;
		tizen.preference.setValue('breatheOutTime', breatheOutTime);
	}
	else if(elementId === 'holdDuration' )
	{
		holdTime = value*1000;
		tizen.preference.setValue('holdTime', holdTime);
	}
	else if(elementId === 'holdDuration2' )
	{
		holdTime2 = value*1000;
		tizen.preference.setValue('holdTime2', holdTime2);
	}

	console.log("breatheInTime: " + breatheInTime);
	console.log("breatheOutTime: " + breatheOutTime);
	console.log("holdTime: " + holdTime);
	console.log("holdTime2: " + holdTime2);
}

window.onload = function () {
	tizen.power.request("SCREEN", "SCREEN_NORMAL");
	
	const mainMenu = document.getElementById('mainMenu');
	const startButton = document.getElementById('startBtn');
    const container = document.getElementById('container');
    const mainPage = document.getElementById('mainPage');
    
	var breatheInTimeEl = document.getElementById('breatheInDuration');
	var breatheOutTimeEl = document.getElementById('breatheOutDuration');
	var holdTimeEl = document.getElementById('holdDuration');
	var holdTime2El = document.getElementById('holdDuration2');
	var vibrateEl = document.getElementById('vibrate');
	var hold2vibrateEl = document.getElementById('hold2vibrate');
	
	initVars();
	
	breatheInTimeEl.value = breatheInTime/1000;
	breatheOutTimeEl.value = breatheOutTime/1000;
	holdTimeEl.value = holdTime/1000;
	holdTime2El.value = holdTime2/1000;
	
	/*try {
	    var vibration_feature = tizen.systeminfo.getCapability('http://tizen.org/feature/feedback.vibration');
	    console.log('Feedback vibration = ' + vibration_feature);
	} catch (error) {
	    console.log('Error name: ' + error.name + ', message: ' + error.message);
	    vibrateOn = false;
	}*/
	vibrateEl.checked = vibrateOn;
	hold2vibrateEl.checked = hold2vibrateOn;
	
    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
	try {
		if( mainPage.style.display === "block" )
		{
			tizen.power.release("SCREEN"); // Release SCREEN resource.
			tizen.application.getCurrentApplication().exit();
		}	
		else
		{
			stopBreathe();
			showMainMenu();
		}
	} catch (ignore) {
	}
    });

    startButton.addEventListener("click", onClickBreatheStart);
    container.addEventListener("click", onClickBreatheStop);
    
    const text = document.getElementById('containerArea');
   
  
    var timer1 = null;
    var timer2 = null;
    var mainTimer = null;
    var durationTimer = null;
    
    function initVars()
    {    	
    	if (tizen.preference.exists('breatheInTime')) {
    		breatheInTime = tizen.preference.getValue('breatheInTime');
        }
    	if (tizen.preference.exists('breatheOutTime')) {
    		breatheOutTime = tizen.preference.getValue('breatheOutTime');
        }
    	if (tizen.preference.exists('holdTime')) {
    		holdTime = tizen.preference.getValue('holdTime');
        }
    	if (tizen.preference.exists('holdTime2')) {
    		holdTime2 = tizen.preference.getValue('holdTime2');
        }
    	if (tizen.preference.exists('vibrateOn')) {
    		vibrateOn = tizen.preference.getValue('vibrateOn');
        }
    	if (tizen.preference.exists('hold2vibrateOn')) {
    		hold2vibrateOn = tizen.preference.getValue('hold2vibrateOn');
        }
    }
        
    function displayHold2() {
    	if(vibrateOn) 
      	  navigator.vibrate(vibrateDurationHold);
    	text.innerText = 'Hold';
    }
    
    function displayBreatheOut() {
    	if(vibrateOn) 
      	  navigator.vibrate(vibrateDurationBreatheOut);
    	text.innerText = 'Breathe Out!';
        container.className = 'container shrink';
        container.style.animationDuration = breatheOutTime/1000 + 's';
        
        ++numberOfBreathes;
        
        if(hold2vibrateOn)
    	{
        	 timer1 = setTimeout(displayHold2, breatheOutTime);
    	}
    } 
    
    function displayHold() {
    	if(vibrateOn) 
      	  navigator.vibrate(vibrateDurationHold);
    	text.innerText = 'Hold';
    	timer2 = setTimeout(displayBreatheOut, holdTime);
    }
    
    function breathAnimation() {
      if(vibrateOn) 
    	  navigator.vibrate(vibrateDurationBreath);
        
      text.innerText = 'Breathe In!';
      
      container.className = 'container grow';
      container.style.animationDuration = breatheInTime/1000 + 's';
      
      console.log("breatheInTime: " + breatheInTime);
      console.log("breatheOutTime: " + breatheOutTime);
      console.log("holdTime: " + holdTime);
      console.log("holdTime2: " + holdTime2);
      
      timer1 = setTimeout(displayHold, breatheInTime);
    }
    
    function calculateDuration()
    {
    	++totalDuration;
    	++lastDuration;
    }

    function onClickBreatheStart()
    {
    	lastDuration = 0;
    	//totalDuration = 0;
    	mainMenu.style.display = "none";
    	container.style.display = "block";
    	    	
    	breathAnimation();
    	var animationTime = breatheInTime+breatheOutTime+holdTime;
    	if(hold2vibrateOn)
    		animationTime += holdTime2;
    	
    	mainTimer = setInterval(breathAnimation, animationTime);
    	durationTimer = setInterval(calculateDuration, 1000);
    }
    
    function stopBreathe()
    {
    	clearTimeout(timer1);
    	clearTimeout(timer2);
    	clearInterval(mainTimer);
    	clearInterval(durationTimer);
    	durationTimer = null;
    }
    
    function onClickBreatheStop(event)
    {
    	if(durationTimer==null) // means stopped
		{
    		var browserHeight = document.documentElement.clientHeight;
    		if (event.offsetY > browserHeight/2) {
    			onClickBreatheStart();
    		}
    		else
			{
    			location.reload();
			}
		}
    	else 
    	{
    		showStoppedMenu();
		}
    	
    }
    function showStoppedMenu()
    {
		stopBreathe();
		container.className = 'container';
    	text.innerHTML = '&#60;&#60;MAIN MENU&#62;&#62;<br><br>Stopped!<br><br>Total: ' + totalDuration + ' secs<br>Breathes: ' + numberOfBreathes + '<br>Last: ' + lastDuration + ' secs<br><br>&#60;&#60;Click to continue&#62;&#62;';
    }
 
    function showMainMenu()
    {
    	container.style.display = "none";
    	mainMenu.style.display = "none";
    	mainPage.style.display = "block";
    }
    
    showMainMenu();
};
