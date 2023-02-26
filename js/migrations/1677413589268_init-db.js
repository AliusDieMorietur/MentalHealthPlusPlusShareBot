exports.up = (pgm) => {
  pgm.createTable("User", {
    id: {
      type: "bigint",
      primaryKey: true,
      sequenceGenerated: { precedence: "ALWAYS" },
    },
    status: { type: "text", default: "active" },
    phone: { type: "varchar(15)", unique: true },
    language: { type: "text" },
    name: { type: "text" },
    telegramChatId: { type: "text" },
    telegramBlocked: { type: "boolean", notNull: true, default: false },
    data: { type: "jsonb", notNull: true, default: "{}" },
    createdAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
  pgm.createTable("Role", {
    id: {
      type: "bigint",
      primaryKey: true,
      sequenceGenerated: { precedence: "ALWAYS" },
    },
    name: {
      type: "text",
      notNull: true,
      unique: true,
    },
    status: { type: "text", notNull: true, default: "active" },
    createdAt: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
  pgm.createTable("Permission", {
    id: {
      type: "bigint",
      primaryKey: true,
      sequenceGenerated: {
        precedence: "ALWAYS",
      },
    },
    roleId: {
      type: "bigint",
      references: '"Role" (id)',
      notNull: true,
      onDelete: "cascade",
    },
    action: { type: "text", notNull: true },
    kind: { type: "text", notNull: true },
    entity: { type: "text", notNull: true },
  });
  pgm.createTable("UserRole", {
    userId: {
      type: "bigint",
      primaryKey: true,
      notNull: true,
      references: '"User" (id)',
      onDelete: "cascade",
    },
    roleId: {
      type: "bigint",
      primaryKey: true,
      notNull: true,
      references: '"Role" (id)',
      onDelete: "cascade",
    },
  });
  pgm.createTable("ActivityHistory", {
    id: {
      type: "bigint",
      primaryKey: true,
      sequenceGenerated: {
        precedence: "ALWAYS",
      },
    },
    userId: {
      type: "bigint",
      notNull: true,
      references: '"User" (id)',
      onDelete: "cascade",
    },
    kind: { type: "text", notNull: true },
    processId: { type: "text" },
    payload: { type: "jsonb", notNull: true, default: "{}" },
    status: { type: "text", notNull: true, default: "ongoing" },
    createdAt: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
  pgm.createIndex("ActivityHistory", "userId");
};
