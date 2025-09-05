const axios = require("axios");

module.exports = {
  config: {
    name: "4k",
    version: "1.0",
    role: 0,
    author: "",
    countDown: 5,
    longDescription: "",
    category: "Ai",
    guide: {
      en: "Reply to an image to upscale it to 4K resolution."
    }
  },
  onStart: async function ({ message, event }) {
    if (!event.messageReply || !event.messageReply.attachments || !event.messageReply.attachments[0]) {
      return message.reply("Please reply to an image to upscale it.");
    }
    const imgurl = encodeURIComponent(event.messageReply.attachments[0].url);
    // Utilisation de l'API universelle zetbot-page.onrender.com
    const upscaleUrl = `https://zetbot-page.onrender.com/api/upscale2?url=${imgurl}&scale=2`;

    message.reply("Waait...", async (err, info) => {
      try {
        const { data: { enhanced_image_url } } = await axios.get(upscaleUrl);
        const attachment = await global.utils.getStreamFromURL(enhanced_image_url, "upscaled-image.png");

        message.reply({
          body: "Your 4K image:",
          attachment: attachment
        });
        let processingMsgID = info.messageID;
        message.unsend(processingMsgID);

      } catch (error) {
        console.error(error);
        message.reply("❌| There was an error upscaling your image.");
      }
    });
  }
};
