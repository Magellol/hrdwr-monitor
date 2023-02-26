# hardware-monitor

### Metrics

- CPU temp
- GPU temp
- GPU VRAM load
- RAM load
- Fan speeds (RPM)

### TODO
- [ ] Enable eslint/prettier
- [ ] Make UsageGauge a bit more consistent design-wise with the thermal gauges (we're missing some gradient and glow)
- [ ] Implement idea of streaming chart for fan speeds

### Ideas

- [ ] Build with theming in mind. a theme receives the same values and render a given page. Eventually can have these themes as separate NPM package if needed
  ```
    - src/
        themes/
          A/
  ```     B/
- [ ] Add temp trending, is it going down or up based on the last 10 ticks?
- [ ] Add live "streaming" chart of visualizing fan rpms, one line per fan (cpu, sys1, sys2, etc), e.g https://stackoverflow.com/questions/15283289/labeling-animated-line-graphs-using-d3
- [ ] Take inspiration on how LED changes on computer hardward, look at iCUE rgb effects

- [ ] To support other platforms, a plugin system could convert the received data to match a common interface
- [ ] Re-inforce the idea of a dashboard by adding a few lines on top and bottom that has a lighting effect or a glare effect