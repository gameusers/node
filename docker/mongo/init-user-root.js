const dbAdmin = db.getSiblingDB("admin");

dbAdmin.createUser({
  user: "root",
  pwd: "password",
  roles: [
    {
      role: "root",
      db: "admin",
    },
  ],
});
