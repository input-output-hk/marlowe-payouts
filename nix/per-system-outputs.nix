# This file is part of the IOGX template and is documented at the link below:
# https://www.github.com/input-output-hk/iogx#35-nixper-system-outputsnix

{ iogxRepoRoot, repoRoot, inputs, inputs', pkgs, system, lib, projects ? null, ... }:

{
  packages = {
    marlowe-payouts = repoRoot.nix.marlowe-payouts.default;
  };
  # checks = { };
  # apps = { };
  operables = repoRoot.nix.marlowe-payouts.deploy.operable;
  oci-images = repoRoot.nix.marlowe-payouts.deploy.oci-image;
  # nomadTasks = { };
  # foobar = { };
}
