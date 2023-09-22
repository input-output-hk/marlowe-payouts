# This file is part of the IOGX template and is documented at the link below:
# https://www.github.com/input-output-hk/iogx#34-nixshellnix

{ iogxRepoRoot, repoRoot, inputs, inputs', pkgs, system, lib, project ? null, ... }:

let

in

{
  # name = "nix-shell";
  # prompt = "$ ";
  welcomeMessage = "Marlowe Runner";
  packages = [
    pkgs.nodejs-18_x
  ];
  # scripts = { };
  # env = { };
  enterShell = ''
    export PATH="$PATH:./node_modules/.bin/:./bin"
  '';
}
