{ repoRoot, inputs, pkgs, lib, system }:

[
  {
    devShells.default = repoRoot.nix.shell;

    packages.marlowe-payouts = repoRoot.nix.marlowe-payouts;
  }
]
