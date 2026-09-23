import {
  Declare,
  Command,
  type CommandContext,
  Embed,
  MessageFlags,
} from "seyfert";
import { Cooldown } from "@slipher/cooldown";

import { bot } from "#config";

@Declare({
  name: "ping",
  aliases: [],
  description: "Show client & runtime latency.",
  contexts: ["Guild", "BotDM"],
  integrationTypes: ["GuildInstall","UserInstall"],
  botPermissions: ["EmbedLinks"],
})
@Cooldown.user(5_000)

export default class PingCommand extends Command {
  async run(ctx: CommandContext) {
    const ping = ctx.client.gateway.latency;
    const pong = Date.now() - (ctx?.interaction?.createdTimestamp ?? ctx?.message?.createdTimestamp);
    
    const embed = new Embed()
    .setColor(bot.primaryColor)
    .addFields({
      name: "Client Latency",
      value: `\`${ping} ms\``,
      inline: true
    },
    {
      name: "Runtime Latency",
      value: `\`${pong} ms\``,
      inline: true
    })

    await ctx.editOrReply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral
    });
  }
}