# LLRT Amazon JS Runtime

## What is LLRT?

LLRT (Low Latency Runtime) is Amazon's experimental JavaScript runtime designed for serverless environments. Built with Rust and using QuickJS as the JavaScript engine, LLRT provides:

- **Fast startup times**: Up to 10x faster cold starts compared to Node.js
- **Low memory footprint**: Minimal memory usage for serverless workloads
- **AWS SDK v3 built-in**: Native support for AWS services
- **Lightweight**: Single binary under 3MB

LLRT is optimized for AWS Lambda but can run standalone JavaScript applications.

## Installation

### macOS (Apple Silicon)

```bash
curl -L -o llrt.zip https://github.com/awslabs/llrt/releases/latest/download/llrt-darwin-arm64.zip
unzip llrt.zip
chmod +x llrt-darwin-arm64
mv llrt-darwin-arm64 ~/bin/llrt
```

### macOS (Intel)

```bash
curl -L -o llrt.zip https://github.com/awslabs/llrt/releases/latest/download/llrt-darwin-x64.zip
unzip llrt.zip
chmod +x llrt-darwin-x64
mv llrt-darwin-x64 ~/bin/llrt
```

### Linux (x64)

```bash
curl -L -o llrt.zip https://github.com/awslabs/llrt/releases/latest/download/llrt-linux-x64.zip
unzip llrt.zip
chmod +x llrt-linux-x64
mv llrt-linux-x64 ~/bin/llrt
```

### Linux (ARM64)

```bash
curl -L -o llrt.zip https://github.com/awslabs/llrt/releases/latest/download/llrt-linux-arm64.zip
unzip llrt.zip
chmod +x llrt-linux-arm64
mv llrt-linux-arm64 ~/bin/llrt
```

Make sure `~/bin` is in your PATH:
```bash
export PATH="$HOME/bin:$PATH"
```

## Running

```bash
./run.sh
```

Output:
```
Sum of 10 + 20 = 30
```

## Links

- https://github.com/awslabs/llrt
