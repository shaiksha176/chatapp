const mongoose = require("mongoose");
const schema = mongoose.Schema;

const chat_schema = new schema({
  chats: [
    {
      message: {
        type: String,
      },
      sentBy: {
        type: String,
      },
    },
  ],
});

const Chat = mongoose.model("Chat", chat_schema);
module.exports = Chat;
