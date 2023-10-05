{ repoRoot, inputs, pkgs, lib, system }:

lib.iogx.mkShell {

  welcomeMessage = "Marlowe Withdraw dApp";

  packages = [
    pkgs.nodejs-18_x
    pkgs.nodejs-18_x.pkgs.webpack
    pkgs.nodejs-18_x.pkgs.webpack-cli
  ];

  preCommit = {
    shellcheck.enable = true;
    shellcheck.extraOptions = "";
    nixpkgs-fmt.enable = true;
    nixpkgs-fmt.extraOptions = "";
  };
}
