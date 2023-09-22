{ iogxRepoRoot, repoRoot, inputs, inputs', pkgs, system, lib }:

let

  inherit (inputs') self std;
  inherit (std.lib.ops) mkOperable;
  inherit (pkgs) darkhttpd mailcap;

  marlowe-payouts = self.packages.marlowe-payouts;

in

{
  marlowe-payouts = mkOperable {
    package = marlowe-payouts;
    runtimeInputs = [ darkhttpd ];
    runtimeScript = ''
      exec darkhttpd "''${CONFIG_HTML_ROOT:-${marlowe-payouts}}" --port 8080 --mimetypes ${mailcap}/etc/mime.types
    '';
  };
}
