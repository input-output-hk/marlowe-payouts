# This file is part of the IOGX template and is documented at the link below:
# https://www.github.com/input-output-hk/iogx#34-nixshellnix

{ iogxRepoRoot, repoRoot, inputs, inputs', pkgs, system, lib, project ? null, ... }:

let

  nodejs = pkgs.nodejs-18_x;
  skopeo = inputs'.n2c.packages.skopeo-nix2container;
  docker = pkgs.docker;

in

{
  # name = "nix-shell";
  # prompt = "$ ";
  welcomeMessage = "Marlowe withdraw dapp";
  packages = [
    nodejs
    skopeo
    docker
  ];
  # scripts = { };
  # env = { };
  enterShell = ''
    export PATH="$PATH:./node_modules/.bin/:./bin"
  '';
}
