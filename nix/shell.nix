{ repoRoot, inputs, pkgs, lib, system }:

lib.iogx.mkShell {

  welcomeMessage = "Marlowe Withdraw dApp";

  packages = [
    pkgs.nodejs-18_x
    pkgs.docker
    inputs.n2c.packages.skopeo-nix2container
  ];

  shellHook = ''
    export PATH="$PATH:./node_modules/.bin/:./bin"
  '';

  # scripts = { };
  # env = { };
  # name = "nix-shell";
  # prompt = "$ ";

  preCommit = {
    shellcheck.enable = true;
    shellcheck.extraOptions = "";
    nixpkgs-fmt.enable = true;
    nixpkgs-fmt.extraOptions = "";
  };
}
