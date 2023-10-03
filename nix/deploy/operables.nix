{ repoRoot, inputs, pkgs, lib, system }:

{
  marlowe-payouts = inputs.std.lib.ops.mkOperable {
    package = repoRoot.nix.marlowe-payouts;
    runtimeInputs = [ pkgs.darkhttpd ];
    runtimeScript = ''
      exec darkhttpd "''${CONFIG_HTML_ROOT:-${repoRoot.nix.marlowe-payouts}}" --port 8080 --mimetypes ${pkgs.mailcap}/etc/mime.types
    '';
  };
}
