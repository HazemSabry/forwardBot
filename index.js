const { Telegraf } = require("telegraf");

const botToken = "6865669632:AAGrm1HTNq9sW23LMZrndsLtfaUP44I9crI";
const groupId = -4032452179; // Replace with your group ID (negative value)
const channelId = -1002029233259; // Replace with your channel ID (negative value)
const yourUserId = 1258287656; // Replace with your user ID

const bot = new Telegraf(botToken);

// Middleware to forward messages from the group to the channel
bot.use(async (ctx, next) => {
  // Check if the message is from the group
  if (ctx.message && ctx.message.chat.id === groupId) {
    try {
      if (ctx.message.text) {
        // Forward text messages
        await ctx.telegram.copyMessage(
          channelId,
          ctx.message.chat.id,
          ctx.message.message_id,
          {
            disable_notification: false,
          }
        );
        console.log(
          `Text message forwarded from group to channel: ${ctx.message.text}`
        );
      } else if (ctx.message.photo) {
        // Forward photo messages
        const photo = ctx.message.photo[ctx.message.photo.length - 1];
        await ctx.telegram.sendPhoto(channelId, photo.file_id, {
          caption: ctx.message.caption || "",
          disable_notification: false,
        });
        console.log(`Photo forwarded from group to channel`);
      } else if (ctx.message.video) {
        // Forward video messages
        await ctx.telegram.sendVideo(channelId, ctx.message.video.file_id, {
          caption: ctx.message.caption || "",
          disable_notification: false,
        });
        console.log(`Video forwarded from group to channel`);
      } else if (ctx.message.document) {
        // Forward document messages
        const document = ctx.message.document;
        await ctx.telegram.sendDocument(channelId, document.file_id, {
          caption: ctx.message.caption || "",
          disable_notification: false,
        });
        console.log(`Document forwarded from group to channel`);
      }
    } catch (error) {
      console.error("Error forwarding message:", error);
      // Send a private message to the bot owner
      bot.telegram.sendMessage(
        yourUserId,
        `Error forwarding message:\n${error}`
      );
    }
  }

  // Continue to the next middleware
  next();
});

// Start the bot
bot.launch().then(() => {
  console.log("Bot is running");
});

// Error handling for unhandled errors
bot.catch((error, ctx) => {
  console.error("Unhandled error:", error);
  // Send a private message to the bot owner
  bot.telegram.sendMessage(yourUserId, `Unhandled error:\n${error}`);
  ctx.reply("An unexpected error occurred. The issue has been reported.");
});
