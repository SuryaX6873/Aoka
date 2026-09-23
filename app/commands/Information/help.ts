import {
  Declare,
  Command,
  Options,
  createStringOption,
  type CommandContext,
  Embed,
} from "seyfert";
import { Cooldown } from "@slipher/cooldown";

import { bot, emoji } from "#config";

@Declare({
  name: "help",
  aliases: ["h"],
  description: "Display commands list and usage helper.",
  contexts: ["Guild"],
  integrationTypes: ["GuildInstall"],
  botPermissions: ["EmbedLinks"],
})
@Cooldown.user(10_000)
@Options({
  command: createStringOption({
    description: `Input command name.`
  })
})

export default class NameCommand extends Command {
  async run(ctx: CommandContext) {
    if (ctx.options?.command?.length) helpCommand(ctx);
    else commandsList(ctx);
  }
}

async function helpCommand(ctx) {
  const embed = new Embed().setColor(bot.primaryColor).setTitle("Help Command")
  ctx.write({ embeds: [embed] });
}

async function commandsList(ctx) {
  const embed = new Embed().setColor(bot.primaryColor).setTitle("Commands List");
  ctx.write({ embeds: [embed] });
}