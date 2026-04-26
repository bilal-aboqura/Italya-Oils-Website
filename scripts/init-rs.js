// Idempotent replica-set bootstrap for Docker Compose.
// Runs inside the mongo-init container on every deploy.
try {
  var cfg = rs.conf();
  if (cfg.members[0].host !== "mongo:27017") {
    cfg.members[0].host = "mongo:27017";
    rs.reconfig(cfg, { force: true });
    print("RS host corrected to mongo:27017");
  } else {
    print("RS OK: " + cfg.members[0].host);
  }
} catch (e) {
  rs.initiate({ _id: "rs0", members: [{ _id: 0, host: "mongo:27017" }] });
  print("RS initiated");
}
