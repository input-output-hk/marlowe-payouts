# Docker Image


Use the following Nix command to build the Docker image for Marlowe Payouts.
```bash
nix build .#oci-images.x86_64-linux.marlowe-payouts
```

The image can be uploaded to Docker via the following command.
```bash
skopeo --insecure-policy copy nix:result docker://docker.io/mydocker/marlowe-payouts:latest
```

Run the container and connect to `http://localhost:8080`.
```bash
docker run -p 8080:8080 mydocker/marlowe-payouts
```
