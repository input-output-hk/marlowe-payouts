# This file is part of the IOGX template and is documented at the link below:
# https://www.github.com/input-output-hk/iogx#34-nixshellnix

{ iogxRepoRoot, repoRoot, inputs, inputs', pkgs, system, lib, project ? null, ... }:

let

  nodejs = pkgs.nodejs-18_x;

in

{
  # name = "nix-shell";
  # prompt = "$ ";
  welcomeMessage = "Marlowe withdraw dapp";
  packages = [
    nodejs
  ];
  # scripts = { };
  # env = { };
  enterShell = ''
    export PATH="$PATH:./node_modules/.bin/:./bin"
  '';
}
