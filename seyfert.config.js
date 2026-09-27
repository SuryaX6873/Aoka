process.on("unhandledRejection", info => console.error("UnhandledRejection?!", info));
process.on("uncaughtException", info => console.error("UncaughtException?!", info));

import { config } from "seyfert";

export default config.bot({
    token: process.env.Token ?? "Invalid Bot Token!",
    locations: {
        base: "app",
        commands: "commands",
        components: "components",
        events: "events",
    },
    intents: ["Guilds", "GuildMessages", "MessageContent"]
});