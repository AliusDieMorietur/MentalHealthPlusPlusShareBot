INSERT INTO "User" (
  "phone",
  "name",
  "telegramChatId"
) VALUES (
  '7777777777',
  'Admin',
  '422353400'
);

INSERT INTO "Role" (
  "name"
) VALUES (
  'Admin'
);

INSERT INTO "Permission" (
  "roleId",
  "action",
  "kind",
  "entity"
) VALUES (
  (SELECT "id" FROM "Role" WHERE "name" = 'Admin'),
  'moderateContent',
  'module',
  'bot'
);

INSERT INTO "Permission" (
  "roleId",
  "action",
  "kind",
  "entity"
) VALUES (
  (SELECT "id" FROM "Role" WHERE "name" = 'Admin'),
  'moderateUsers',
  'module',
  'bot'
);



