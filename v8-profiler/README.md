## Steps

1. Run `npm install .`
2. Run the express server on node v8 profiler with `./run-profiler.sh`
3. Insert the user `./test.sh`
4. Run the stress test `./stress.sh`
5. Run the magic `./make-it-rain-baby-sh`
6. open processed.txt and have fun

## Flame graph
1. install 0x
```bash
npm install -g 0x
```
2.  run `./generate-flame-graphs.sh`
3. Insert the user `./test.sh`
4. Run the stress test `./stress.sh`
5. open the flamegraph.html

## Install PERF 
```bash
git clone --depth 1 https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git
cd linux/tools/perf
make
cp perf /usr/bin
sudo apt-get install libpython3.11-dev
perf -v
```
```
perf version 6.7.rc1.gc42d9eeef8e5
```