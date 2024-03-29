# hrdwrd-monitor

<img width="800" alt="image" src="https://user-images.githubusercontent.com/3819093/232328723-deabedcb-fb6a-4714-9e94-01cccfe1cdc5.png">

_This is very much experimental_

Monitor hardware sensor data through a cool looking UI while you're gaming.

### Demo

https://hrdwr-monitor.netlify.app

_Note_: the demo has been tested on chrome, firefox ans safari. Safari performance kinda sucks at the moment. See [Known issues](#known-issues) — Don't try this on a phone, your eyes are going to bleed, remember this is a computer hardware monitoring tool.

### Disclaimer

This project isn't pretending to be replacing the most advanced hardware monitoring tools like HWiNFO, Open Hardware Monitor. I wasn't happy with how any of these softwares looked like, and as a UI engineer, I wanted to build a web-based UI and use this data. I could have stopped at building a NodeJS server fetching the same remote server I use here but I've decided that I'd push this a little further and package it as a Rust app with a webview. This was a good excuse to build something with Rust.

I'm not proficient with Rust and system programming in general, I'm more of a web guy but I was curious to see how I could have access to hardware data from Rust. Turns out it was more complicated than I thought, there wasn't any simple high level API I could use. A lot of the existing libraries I've looked at were missing the GPU sensor information, such as temperature or VRAM usage and some may work with Nvidia cards but not AMDs (I have one). That's when I decided to rely on existing tools to expose hardware data over the network for now. See [Usage](#usage) for more details.

All of this to say that this isn't "ideal" as it requires folks to use other tools to feed data into this one and I'm calling for help to anyone who's got even the slighest idea how I could get this data directly from this app. There is an issue open to gather ideas to solve this: https://github.com/Magellol/hardware-monitor/issues/1

### Usage

This project currently has two hard dependencies that must be running on the host machine:

- [HMWiNfo](https://www.hwinfo.com/download/)@v736-4960
- [remotehwinfo](https://github.com/Demion/remotehwinfo)@v0.5 — This project reads sensor data from HMWiNfo and exposes it over the network.

Note that this only has been tested running specifically the aforementioned versions. Other versions may or may not work.
Also `HMWiNfo` must have the following sensors enabled:

- Total CPU Usage
- CPU Package
- GPU Temperature
- Physical Memory Load
- GPU Utilization
- GPU Memory Controller Utilization

Also make sure to check "fixed order" and you may also need to reset to the original order since we're relying on sensor positioning to find specific sensor data (this isn't ideal but I'm not sure how else at the moment).

TODO: Add images or tutorial how to check these out in HMWiNfo

### Contributing

This project uses nix and nix flakes to install dependencies locally in order to build the app.

You can run `just dev` to only run the client part, e.g the UI. By default, mock data will be used. To disable it, you can pass an argument to the command.

```console
$ just dev # with mock data
$ just dev false # no mock data
```

This is a [`tauri`](https://tauri.app/) app, so you can run `yarn tauri dev` to build the rust app, the client and package the whole thing. The app builds on windows and MacOS (haven't tested linux yet). On MacOS, the data will fake, I haven't gotten around getting actual sensors data on MacOS yet.

Here's a list of improvements I had in mind.

#### Improvements

- [ ] Enable eslint/prettier
- [ ] Build on CI
- [ ] Make UsageGauge a bit more consistent design-wise with the thermal gauges (we're missing some gradient and glow)
- [ ] Add number interpolation, e.g animate them when they change.
- [ ] Add temp trending, is it going down or up based on the last 10 ticks?
- [ ] Better loading state
- [ ] Let users configure temp and load thresholds
- [ ] Add FAN RPM. Build a live "streaming" chart for visualizing one line per fan (cpu, sys1, sys2, etc), e.g https://stackoverflow.com/questions/15283289/labeling-animated-line-graphs-using-d3
- [ ] System status message updates should animate vertically (sliding up)
- [ ] Update system status based on data thresholds, e.g should not be ok if reaching 100% of temps tresholds.

### Known issues

- The app currently builds on MacOS but the performance aren't great. This is because of the Safari webview, chrome doesn't have that issue. https://github.com/Magellol/hardware-monitor/issues/2
