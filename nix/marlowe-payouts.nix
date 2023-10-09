{ repoRoot, inputs, pkgs, lib, system }:

pkgs.buildNpmPackage {

  pname = "marlowe-payouts";

  version = "0.1.0";

  src = lib.sourceByRegex ../. [
    "^src.*"
    "^public.*"
    "^contract.*"
    "^.env$"
    "^package-lock.json$"
    "^package.json$"
    "^tsconfig.json$"
    "^webpack.config.js$"
  ];

  # buildNpmPackage is able to make a pure nix build by using npmDepsHash.
  # That is the hash of package-lock.json.
  # Its value is generated using the prefetch-npm-deps command (see shell.nix).
  # We set dontNpmBuild and dontNpmInstall to true to significantly speed up the 
  # build: this works because we have a custom buildPhase that invokes webpack-cli
  # explicitely.
  npmDepsHash = import ./gen/npm-deps-hash.nix;

  nativeBuildInputs = [
    pkgs.nodejs_18
    pkgs.nodejs_18.pkgs.webpack-cli
  ];

  buildPhase = ''
    mkdir -p $out
    npm run build
    cp -r {dist,public}/* $out
  '';

  dontNpmBuild = true;
  dontNpmInstall = true;
}
