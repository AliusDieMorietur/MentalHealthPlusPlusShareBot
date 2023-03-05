export default {
  id: { type: "number", idProperty: true },
  status: { type: "string", default: "active" },
  phone: { type: "string", unique: true },
  language: { type: "string" },
  name: { type: "string" },
  telegramChatId: { type: "string" },
  telegramBlocked: { type: "boolean", notNull: true, default: false },
  data: { type: "jsonb", notNull: true, default: "{}" },
  createdAt: { type: "timestamp", notNull: true },
};
