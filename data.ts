export interface DataSet {
  gpuTemp: number;
  gpuLoad: number;
  cpuTemp: number;
  cpuLoad: number;
  ramLoad: number;
  vramLoad: number;
}

export const data: Array<DataSet> = [
  {
    gpuTemp: 52,
    gpuLoad: 10,
    cpuTemp: 30,
    cpuLoad: 3,
    ramLoad: 40,
    vramLoad: 20,
  },
  {
    gpuTemp: 61,
    gpuLoad: 20,
    cpuTemp: 45,
    cpuLoad: 10,
    ramLoad: 45,
    vramLoad: 50,
  },
  {
    gpuTemp: 75,
    gpuLoad: 50,
    cpuTemp: 50,
    cpuLoad: 40,
    ramLoad: 55,
    vramLoad: 80
  },
  {
    gpuTemp: 92,
    gpuLoad: 95,
    cpuTemp: 70,
    cpuLoad: 80,
    ramLoad: 55,
    vramLoad: 100
  },
  {
    gpuTemp: 96,
    gpuLoad: 92,
    cpuTemp: 64,
    cpuLoad: 76,
    ramLoad: 52,
    vramLoad: 98
  },
  {
    gpuTemp: 102,
    gpuLoad: 100,
    cpuTemp: 80,
    cpuLoad: 96,
    ramLoad: 60,
    vramLoad: 100
  },
  {
    gpuTemp: 75,
    gpuLoad: 50,
    cpuTemp: 50,
    cpuLoad: 40,
    ramLoad: 55,
    vramLoad: 80
  },
  {
    gpuTemp: 61,
    gpuLoad: 20,
    cpuTemp: 45,
    cpuLoad: 10,
    ramLoad: 45,
    vramLoad: 50,
  },
  {
    gpuTemp: 54,
    gpuLoad: 8,
    cpuTemp: 34,
    cpuLoad: 4,
    ramLoad: 25,
    vramLoad: 10,
  },
];
