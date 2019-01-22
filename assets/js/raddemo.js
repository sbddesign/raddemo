// RadDemo v0.2
// https://github.com/sbddesign/raddemo

function radDemo(settings){

    if(settings === undefined) var settings = new Object();
    if(settings.videoID === undefined) settings['videoID'] = "demo-video";
    if(settings.interval === undefined) settings['interval'] = 200;
    if(settings.pausePoints === undefined) settings['pausePoints'] = new Array(2, 4, 6, 8, 10);
    if(settings.pauseFormat === undefined) settings['pauseFormat'] = 'seconds';
    if(settings.framerate === undefined) settings['framerate'] = 29.97;
    if(settings.debug === undefined) settings['debug'] = false;


    //Variables
    var video       = document.getElementById(settings.videoID),
        interval    = settings.interval,
        subinterval = interval/2,
        pausePoints = settings.pausePoints,
        pauseFormat = settings.pauseFormat,
        framerate   = settings.framerate,
        debug       = settings.debug,
        reportCurrentTime,
        prevPausePoint,
        currentPausePoint,
        nextPausePoint,
        currentTime;

    video.insertAdjacentHTML('afterend', '<div id="rd-pause"></div>');

    if(pauseFormat === 'SMTP'){
        convertTimecodeListToSecondsList(pausePoints, framerate);
    }

    var pause = document.getElementById("rd-pause");

    if(debug === true) {
        pause.insertAdjacentHTML('afterend', '<div id="rd-debug">0</div>');
        debug = document.getElementById("rd-debug");
    }

    //Function that starts the RadDemo
    function startRadDemo(video){
        pause.classList.add('hide-fade');
        video.play();
        if(!video.paused) {
            reportCurrentTime = setInterval(function(){
                if(video.readyState > 0) {
                    currentTime = video.currentTime;

                    if(debug) debug.innerHTML = video.currentTime;

                    pausePoints.forEach(function(value, index){

                        //If current time is within .1s of this pause point
                        if( currentTime > value - (subinterval/1000) && currentTime < value + (subinterval/1000)) {
                            stopRadDemo(video);
                            redefinePausePoints(index)
                        }
                    });
                }
            }, interval);
        }
    }

    //Function that stops the RadDemo
    function stopRadDemo(video){
        pause.classList.remove('hide-fade');
        video.pause();
        clearInterval(reportCurrentTime);
    }

    function restartRadDemo(video){
        stopRadDemo(video);
        startRadDemo(video);
    }

    //Function that toggles the RadDemo
    function toggleRadDemo(video) {

        if(video.paused && Math.ceil(video.currentTime) === Math.ceil(video.duration)) { //If we have reached end of video
            stopRadDemo(video);
            video.currentTime = 0;
        } else if(video.paused) { //If the video is paused somewhere that's not the end
            startRadDemo(video);
        } else { //All other situations
            stopRadDemo(video);
        }
    }

    function navigateRadDemo(video, destination) {

        if(pausePoints[destination] === undefined) {
            video.currentTime = 0;
            redefinePausePoints(0);
        } else {
            video.currentTime = pausePoints[destination];
            redefinePausePoints(destination);
        }

        restartRadDemo(video);
    }

    function redefinePausePoints(index) {
        currentPausePoint=index;
        prevPausePoint = currentPausePoint-1;
        nextPausePoint = currentPausePoint+1;
    }

    function convertTimecodeToSeconds(timecode, framerate) {
        var timeArray = timecode.split(':');
        var hoursInSeconds      =   parseInt(timeArray[0]) * 60 * 60,
            minutesInSeconds    =   parseInt(timeArray[1]) * 60,
            seconds             =   parseInt(timeArray[2]),
            framesInSeconds     =   parseInt(timeArray[3]) * (1/framerate);

        return hoursInSeconds + minutesInSeconds + seconds + framesInSeconds;
    }

    function convertTimecodeListToSecondsList(timecodeList, framerate) {
        for (var i = 0; i < timecodeList.length; i++){
            timecodeList[i] = convertTimecodeToSeconds(timecodeList[i], framerate);
        }
        console.log(timecodeList);
    }

    //Bind the spacebar to start and stop the RadDemo
    keyboardJS.bind('space', function(e) {
        toggleRadDemo(video);
    });

    //Bind the right arrow to go to next pause point
    keyboardJS.bind('right', function(e) {
        navigateRadDemo(video, nextPausePoint);
    });

    //Bind the escape key and left arrow to go back to previous pause point
    keyboardJS.bind(['escape', 'left'], function(e) {
        navigateRadDemo(video, prevPausePoint);
    });
}