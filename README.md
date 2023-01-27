# hardware-monitor

### Metrics

- CPU temp
- GPU temp
- RAM load
- Fan speeds (RPM)

### TODO
- [ ] Enable eslint/prettier
- [x] Add just


### Ideas

- [ ] Build with theming in mind. a theme receives the same values and render a given page. Eventually can have these themes as separate NPM package if needed
- [ ] Add temp trending, is it going down or up based on the last 10 ticks?

  ```
    - src/
        themes/
          A/
  ```     B/
- [ ] To support other platforms, a plugin system could convert the received data to match a common interface