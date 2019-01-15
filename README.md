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
`<script src="assets/js/raddemo.js"></script>`
4. Invoke the RadDemo function in your HTML or scripts file at a point after KeyboardJS and RadDemo. Pass an array of pausePoints into the function. For example, if you want your demo video to stop at 3 seconds, 8 seconds, and 13 seconds, then you would do it like so:<br />
```
<script>
    radDemo([3,8,13]);
</script>
```

If everything works correctly, then you will see your video when you load the HTML page, and be able to control it with  the keyboard, and the video will stop automatically at your pause points.

### Controls

- Play/Pause - Spacebar
- Rewind - Left Arrow, Escape
- Fast-forward - Right Arrow

## Credit

This project utilizes KeyboardJS for key binding. https://github.com/RobertWHurst/KeyboardJS