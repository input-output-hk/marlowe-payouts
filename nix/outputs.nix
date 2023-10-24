{ repoRoot, inputs, pkgs, lib, system }:

[
  {
    devShells.default = repoRoot.nix.shell;

    packages.marlowe-payouts = repoRoot.nix.marlowe-payouts;

    hydraJobs.devShells.default = repoRoot.nix.shell;
    hydraJobs.marlowe-payouts = repoRoot.nix.marlowe-payouts;
    hydraJobs.required = lib.iogx.mkHydraRequiredJob { };
  }
]
