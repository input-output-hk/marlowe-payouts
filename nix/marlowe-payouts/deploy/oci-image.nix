{ iogxRepoRoot, repoRoot, inputs, inputs', pkgs, system, lib }:

let

  inherit (inputs') self std n2c;
  inherit (pkgs.lib) mapAttrsToList mapAttrs;
  inherit (pkgs.lib.strings) concatMapStrings;
  inherit (self) operables;

  images = {
    marlowe-payouts = std.lib.ops.mkStandardOCI {
      name = "marlowe-payouts";
      operable = operables.marlowe-payouts;
      uid = "0";
      gid = "0";
      labels = {
        description = "Marlowe Withdraw dapp.";
        source = "https://github.com/input-output-hk/marlowe-payouts";
        license = "Apache-2.0";
      };
    };
  };

  forAllImages = f: concatMapStrings (s: s + "\n") (mapAttrsToList f images);

in

images // {
  all = {
    copyToDockerDaemon = std.lib.ops.writeScript {
      name = "copy-to-docker-daemon";
      text = forAllImages (name: img:
        "${n2c.skopeo-nix2container}/bin/skopeo --insecure-policy copy nix:${img} docker-daemon:${name}:latest"
      );
    };
  };
}
