# RadDemo

RadDemo is a simple tool for creating demonstrations or presentations out of video files.

View the demo here: https://sbddesign.github.io/raddemo/

## Instructions

### Basic Steps

1. Make a cool looking animated video for your presentation.
2. Define timecodes where you want the video to automatically pause in your presentation.
3. Load your demo video with the `<video>`, plug your pause point timecodes into RadDemo, and present.

### Specific Steps

1. Start with a video for your presentation. The example included in this repo was made in After Effects and represents a software demonstration mockup. Render the video to an HTML5 compatible format.
2. Include the video in your HTML using `<video>`.
3. Include KeyboardJS and RadDemo in your HTML.<br />
`<script src="assets/js/keyboard.min.js"></script>`<br />
`<script src="assets/js/raddemo.js"></script>`<br />
`<link rel="stylesheet" type="text/css" href="assets/css/raddemo.css" />`<br />
4. Invoke the RadDemo function in your HTML or scripts file at a point after KeyboardJS and RadDemo. Pass an array of pausePoints into the function. For example, if you want your demo video to stop at 3 seconds, 8 seconds, and 13 seconds, then you would do it like so:<br />
```
<script>
    radDemo({
        pausePoints: [3,8,13]
    });
</script>
```

If everything works correctly, then you will see your video when you load the HTML page, and be able to control it with  the keyboard, and the video will stop automatically at your pause points.

#### Parameters

- **videoID** - (String) this corresponds to the `id` attribute of your `<video>` element. Default: "demo-video"
- **interval** - (Integer) this is the time (in milliseconds) between RadDemo checking to see if it has reached a pausePoint. Set it higher if you are worried about performance, or set it lower if precision is critical to your demo. Default: 200
- **pausePoints** - (Array) these are the points where you want your demo to pause (in seconds). If your pause point needs to fall somewhere very specific, like 10 seconds and 15 frames (in a 29.97fps video), then use a decimal number like 10.5. Default: [2, 4, 6, 8, 10] *(Completely arbitrary)*
- **pauseFormat** - (String) this specifies the format of your pausePoints. RadDemo supports 2 formats: pure seconds i.e. `[2, 4.0, 5.25, 9]`, as well as SMTP timecodes i.e. `['0:00:02:00', '0:00:04:00', '0:00:05:08', '0:00:09:00']`. If you use SMTP, you should also specify a framerate. Default: "seconds"
- **framerate** - (Integer) this specifies the framerate of your video file. This is important if you are providing SMTP timecodes and using a framerate other than 29.97fps. Default: 29.97
- **debug** - (Boolean) setting this to `true` displays the tiemcode of the video. This can be useful if you are having trouble getting your pausePoints set just right. Default: false

Example:
```
radDemo({
    videoID: "my-video",
    pausePoints: [3, 10.5, 17.25, 22],
    interval: 100
});

```


### Controls

- Play/Pause - Spacebar
- Rewind - Left Arrow, Escape
- Fast-forward - Right Arrow

## Credit

This project utilizes KeyboardJS for key binding. https://github.com/RobertWHurst/KeyboardJS
