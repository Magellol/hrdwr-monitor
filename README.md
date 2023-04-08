# hardware-monitor

### Metrics

- CPU temp (DONE)
- GPU temp (DONE)
- GPU VRAM load (DONE)
- RAM load (DONE)
- Fan speeds RPM (TODO)

### Usage

This project currently has two hard dependencies that must be running on the host machine:

- [HMWiNfo](https://www.hwinfo.com/download/)@v736-4960
- [remotehwinfo](https://github.com/Demion/remotehwinfo)@v0.5

Note that this only has been tested running specifically the aforementioned versions. Other versions may or may not work.
Also `HMWiNfo` must have the following sensor enabled:

- Total CPU Usage
- CPU Package
- GPU Temperature

Also make sure to check "fixed order" and you may also need to reset to the original order since we're relying on sensor positioning to find specific sensor data (this isn't ideal but I'm not sure how else at the moment).

TODO: Add images or tutorial how to check these out in HMWiNfo

### Vision

TBD.


### TODO for MVP

- [ ] Enable eslint/prettier
- [ ] Make UsageGauge a bit more consistent design-wise with the thermal gauges (we're missing some gradient and glow)
- [ ] Add number interpolation, e.g animate them when they change.
- [ ] Re-enable building the app on windows (or cross compiling to windows)

### Ideas

- [ ] Add temp trending, is it going down or up based on the last 10 ticks?
- [ ] Add live "streaming" chart of visualizing fan rpms, one line per fan (cpu, sys1, sys2, etc), e.g https://stackoverflow.com/questions/15283289/labeling-animated-line-graphs-using-d3
- [ ] Take inspiration on how LED changes on computer hardware, look at iCUE rgb effects
- [ ] Bundle this as a windows application to get access to the metrics (somehow). This is to avoid having to spin two servers (one on the window machine, one on the website host). Perhaps can use something like open hardware monitor?

### Development

This project uses nix and nix flakes to install dependencies locally in order to build the app.
