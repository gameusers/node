const dbGameUsers = db.getSiblingDB("gameusers");

dbGameUsers.createUser({
  user: "gameusers",
  pwd: "password",
  roles: [
    {
      role: "dbOwner",
      db: "gameusers",
    },
  ],
});
