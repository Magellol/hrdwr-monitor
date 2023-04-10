# hardware-monitor

Monitor hardware sensor data through a cool looking UI while you're gaming.

### Disclaimer and decisions
This project isn't pretending to be replacing the most advanced hardware monitoring tools like HWiNFO, Open Hardware Monitor. I wasn't happy with how any of these softwares looked like, and as a UI engineer, I wanted to build a web-based UI and use this data. I could have stopped at building a NodeJS server fetching the same remote server I use here but I've decided that I'd push this a little further and package it as a Rust app with a webview. This was a good excuse to build something with Rust.

I'm not proficient with Rust and system programming in general, I'm more of a web guy but I was curious to see how I could have access to hardware data from Rust. Turns out it was more complicated than I thought, there wasn't any crate I could use to give me what I wanted and I've looked at a few:

- [systemstat](https://github.com/valpackett/systemstat)
- [rust-psutil](https://github.com/rust-psutil/rust-psutil)

A lot of the existing libraries I've looked at were missing the GPU sensor information, such as temperature or VRAM usage. There was [NVML](https://docs.rs/nvml-wrapper/latest/nvml_wrapper/) Rust wrapper but this is Nvidia specific and I couldn't find anything for AMD cards (I have one). I've then decided to use the windows API binding through [`winapi`](https://docs.rs/winapi/latest/winapi/) but I was quickly out of my depth and I was having a hard time making any progress. That's when I decided to rely on existing tools to expose hardware data over the network. See [Usage](#usage) for more details.

_Note that I'm currently evaluating [`windows-rs`](https://github.com/microsoft/windows-rs) and specifically this [example](https://github.com/microsoft/windows-rs/blob/0.48.0/crates/samples/windows/counter/src/main.rs) to read performance counter from the windows SDK._

All of this to say that this isn't "ideal" as it requires folks to use other tools to feed data into this one and I'm calling for help to anyone who's got even the slighest idea how I could get this data directly from this app. I'm also specifically interested in using `Rust` here but I'm aware `.NET` has tools like [`LibreHardwareMonitor`](https://github.com/LibreHardwareMonitor/LibreHardwareMonitor) with which I could rewrite this backend at some point.

### Usage

This project currently has two hard dependencies that must be running on the host machine:

- [HMWiNfo](https://www.hwinfo.com/download/)@v736-4960
- [remotehwinfo](https://github.com/Demion/remotehwinfo)@v0.5

Note that this only has been tested running specifically the aforementioned versions. Other versions may or may not work.
Also `HMWiNfo` must have the following sensors enabled:

- Total CPU Usage
- CPU Package
- GPU Temperature

Also make sure to check "fixed order" and you may also need to reset to the original order since we're relying on sensor positioning to find specific sensor data (this isn't ideal but I'm not sure how else at the moment).

TODO: Add images or tutorial how to check these out in HMWiNfo


### TODO for MVP

- [ ] Enable eslint/prettier
- [ ] Make UsageGauge a bit more consistent design-wise with the thermal gauges (we're missing some gradient and glow)
- [ ] Add number interpolation, e.g animate them when they change.

### Ideas

- [ ] Add temp trending, is it going down or up based on the last 10 ticks?
- [ ] Add live "streaming" chart of visualizing fan rpms, one line per fan (cpu, sys1, sys2, etc), e.g https://stackoverflow.com/questions/15283289/labeling-animated-line-graphs-using-d3
- [ ] Take inspiration on how LED changes on computer hardware, look at iCUE rgb effects
- [ ] Bundle this as a windows application to get access to the metrics (somehow). This is to avoid having to spin two servers (one on the window machine, one on the website host). Perhaps can use something like open hardware monitor?

### Development

This project uses nix and nix flakes to install dependencies locally in order to build the app.
