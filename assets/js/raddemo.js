// RadDemo v0.3
// https://github.com/sbddesign/raddemo

function radDemo(settings){

    if(settings === undefined) var settings = new Object();
    if(settings.videoID === undefined) settings['videoID'] = "raddemo";
    if(settings.interval === undefined) settings['interval'] = 200;
    if(settings.pausePoints === undefined) settings['pausePoints'] = new Array(2, 4, 6, 8, 10);
    if(settings.pauseFormat === undefined) settings['pauseFormat'] = 'seconds';
    if(settings.framerate === undefined) settings['framerate'] = 29.97;
    if(settings.debug === undefined) settings['debug'] = false;
    if(settings.playlist === undefined) {
        settings['playlist'] = [
            'assets/video/RadDemo.mp4',
            'assets/video/RadDemo_inverted.mp4'
        ];
    }

    //Variables
    var video                   = document.getElementById(settings.videoID),
        interval                = settings.interval,
        subinterval             = interval/2,
        playlist                = settings.playlist,
        currentPlaylistVideo    = 0,
        debug                   = settings.debug,
        videoStatus             = 'paused',
        reportCurrentTime,
        prevPausePoint,
        currentPausePoint,
        nextPausePoint          = 0,
        currentTime;

    loadPausePoints();

    video.insertAdjacentHTML('afterend', '<div id="rd-pause"></div>');

    var pause = document.getElementById("rd-pause");

    if(debug === true) {
        pause.insertAdjacentHTML('afterend', '<div id="rd-debug">0</div>');
        debug = document.getElementById("rd-debug");
    }

    //Function that starts the RadDemo
    function startRadDemo(video, next){
        if(video.dataset.nowplaying === undefined) { // Video has not been started ever
            navigatePlaylist(video, false);
        } else if(video.dataset.nowplaying !== undefined && videoStatus === 'ended') { //Video has ended
            navigatePlaylist(video, true);
        }
        pause.classList.add('hide-fade');
        video.play();
        videoStatus = 'playing';
        if(!video.paused && pausePoints) {
            reportCurrentTime = setInterval(function(){
                if(video.readyState > 0) {
                    currentTime = video.currentTime;

                    if(debug) debug.innerHTML = video.currentTime;

                    pausePoints.forEach(function(value, index){

                        //If current time is within .1s of this pause point
                        if( currentTime > value - (subinterval/1000) && currentTime < value + (subinterval/1000)) {
                            stopRadDemo(video);
                            redefinePausePoints(index);
                        }
                    });
                }
            }, interval);
        }
    }

    //Function that stops the RadDemo
    function stopRadDemo(video, ended){
        pause.classList.remove('hide-fade');
        if(!video.paused) video.pause();
        if(ended) {
            videoStatus = 'ended';
        } else {
            videoStatus = 'paused';
        }
        clearInterval(reportCurrentTime);
    }

    function restartRadDemo(video, ended){
        stopRadDemo(video, ended);
        startRadDemo(video);
    }

    //Function that toggles the RadDemo
    function toggleRadDemo(video) {

        if(Math.ceil(video.currentTime) === Math.ceil(video.duration)) { //If we have reached end of video
            restartRadDemo(video, true);
            video.currentTime = 0;
        } else if(video.paused) { //If the video is paused somewhere that's not the end
            startRadDemo(video);
        } else { //All other situations
            stopRadDemo(video);
        }
    }

    function navigateRadDemo(video, destination) {
        if(!pausePoints || pausePoints[destination] === undefined) { //No more pausePoints in set, so we must be finished with video (or no pausePoints defined at all)
            video.currentTime = video.duration;
            toggleRadDemo(video);
            redefinePausePoints(0);
        } else {
            video.currentTime = pausePoints[destination];
            redefinePausePoints(destination);
            restartRadDemo(video);
        }
    }

    function navigatePlaylist(video, next, destination){
        if(next === true) {
            currentPlaylistVideo++;
        } else if (destination) {
            currentPlaylistVideo = destination-1;
        }
        if(playlist[currentPlaylistVideo] === undefined) {
            currentPlaylistVideo = 0;
        }
        loadPausePoints();
        video.setAttribute('src', playlist[currentPlaylistVideo].videoSource);
        video.dataset.nowplaying = currentPlaylistVideo;
    }

    function loadPausePoints(){
        pausePoints     = playlist[currentPlaylistVideo].pausePoints;

        if(!pausePoints) return false;

        framerate       = playlist[currentPlaylistVideo].framerate;

        if(playlist[currentPlaylistVideo].pauseFormat === 'SMTP'){
            convertTimecodeListToSecondsList(pausePoints, framerate);
            playlist[currentPlaylistVideo].pauseFormat = 'seconds';
        }
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

    //Bind the 1-0 number keys to navigate the playlist
    keyboardJS.bind(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0',], function(e) {
        navigatePlaylist(video, false, e.key);
    });
}