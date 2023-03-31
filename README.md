# hardware-monitor

### Metrics

- CPU temp (DONE)
- GPU temp (DONE)
- GPU VRAM load (DONE)
- RAM load (DONE)
- Fan speeds RPM (TODO)

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

- `node`
- `just`
- `yarn`

The project doesn't currently compile on macos but I'm investigating this. I'm currently using my windows machine when I need
to compile and test the rust backend.

### Known issues

- Installing `rustup` through nix doesn't compile the project; it looks it can't find the `ld` missing lib.
  I may have to exclusively compile this on windows to test, it's a bit of a shame...