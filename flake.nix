# https://www.github.com/input-output-hk/iogx#31-flakenix

{
  description = "Change the description field in your flake.nix";

  inputs = {
    iogx.url = "github:input-output-hk/iogx";
    n2c.url = "github:nlewo/nix2container";
    std = {
      url = "github:divnix/std";
      inputs.n2c.follows = "n2c";
      # devshell.url = "github:numtide/devshell";
    };
  };

  outputs = inputs: inputs.iogx.lib.mkFlake {
    inherit inputs;
    repoRoot = ./.;
    systems = [ "x86_64-linux" ];
  };

  nixConfig = {
    extra-substituters = [
      "https://cache.iog.io"
    ];
    extra-trusted-public-keys = [
      "hydra.iohk.io:f/Ea+s+dFdN+3Y/G+FDgSq+a5NEWhJGzdjvKNGv0/EQ="
    ];
    allow-import-from-derivation = true;
  };
}
