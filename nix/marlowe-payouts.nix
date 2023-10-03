{ repoRoot, inputs, pkgs, lib, system }:

let
  npmlock2nix = import inputs.npmlock2nix { inherit pkgs; };
in

npmlock2nix.v2.build {
  nodejs = pkgs.nodejs-18_x;
  
  src = ./..;

  installPhase = "cp -r dist $out";

  buildCommands = [
    # This line is needed to prevent the error:
    #   Internal Error: EACCES: permission denied, mkdir '/homeless-shelter'
    # See https://github.com/NixOS/nix/issues/670#issuecomment-1211700127
    "export HOME=$(whoami)"
    
    "npm run build"
    "cp -r public/* dist/"
  ];
}
