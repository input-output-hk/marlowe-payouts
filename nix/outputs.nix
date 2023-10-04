{ repoRoot, inputs, pkgs, lib, system }:

[
  {
    devShells.default = repoRoot.nix.shell;

    packages.marlowe-payouts = repoRoot.nix.marlowe-payouts;

    operables = repoRoot.nix.deploy.operables;

    oci-images = repoRoot.nix.deploy.oci-images;
  }
]
