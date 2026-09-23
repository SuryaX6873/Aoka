import { Client, Logger, type ParseClient, MessageFlags, definePlugins } from "seyfert";
import { Yuna } from "yunaforseyfert";
import { CooldownMiddlewares, cooldown } from "@slipher/cooldown";

import { ActivityType, PresenceUpdateStatus } from "seyfert/lib/types";
import { formatMemoryUsage } from "seyfert/lib/common/it/logger";

import { config } from "#aoka";

const plugins = definePlugins(
  Yuna.plugin({
    parser: {
      syntax: { namedOptions: ['-', '--'] },
    },
  }),
  cooldown({
    middleware: { global: true }
  }),
)

declare module "seyfert" {
    interface SeyfertRegistry { plugins: typeof plugins }
}

declare module "seyfert" {
    interface SeyfertRegistry { middlewares: CooldownMiddlewares<"cooldown"> }
}

declare module "seyfert" {
  interface UsingClient extends ParseClient<Client<true>> { }
}

declare module "seyfert" {
  interface InternalOptions {
    withPrefix: true | false;
  }
}

const client = new Client({
  allowedMentions: {
    parse: ["everyone", "roles", "users"],
    replied_user: false
  },
  commands: {
    prefix: (message) => config.cmdPrefix,
    reply: (ctx) => true,
    deferReplyResponse: (ctx) => ({ content: "Sending request..." }),
    defaults: {
      onRunError: (context, error) => {
        context.editOrReply({ content: 'Something went wrong!', flags: MessageFlags.Ephemeral });
        context.client.logger.error(error);
      },
      onOptionsError: (context) => {
        context.editOrReply({ content: 'Invalid options provided.', flags: MessageFlags.Ephemeral });
      },
      onPermissionsFail: (context, permissions) => {
        context.editOrReply({ content: `You need ${permissions.join(', ')} permissions to use this command.`, flags: MessageFlags.Ephemeral });
      },
      onBotPermissionsFail: (context, permissions) => {
        context.editOrReply({ content: `I need ${permissions.join(', ')} permissions to run this command.`, flags: MessageFlags.Ephemeral });
      },
      onMiddlewaresError: async (context, error) => {
        const result = await context.cooldown.consume();
        context.editOrReply({ content: error, flags: MessageFlags.Ephemeral });
        if (!context.interaction) {
          setTimeout(() => context.deleteResponse(), result.remainingMs < 3000 ? result.remainingMs + 5000 : result.remainingMs);
        }
      },
      onInternalError: (client, error) => {
        client.logger.fatal(error);
      },
    },
  },
  components: {
    defaults: {
      onRunError: (context, error) => {
        context.editOrReply({ content: 'Component error!', flags: MessageFlags.Ephemeral });
      },
    },
  },
  modals: {
    defaults: {
      onRunError: (context, error) => {
        context.editOrReply({ content: 'Modal error!', flags: MessageFlags.Ephemeral });
      },
    },
  },
  gateway: {
    properties: {
      os: "android",
      browser: "Discord Android",
      device: "android"
    }
  },
  presence: (shardId) => ({
    status: PresenceUpdateStatus.Online,
    activities: [{
      name: "Custom Status",
      state: "Fight! ⚔️💥🔥",
        type: ActivityType.Custom,
    }],
    since: Date.now(),
    afk: false,
  }),
  plugins
});

Logger.customize((logger, level, args) => {
  const now = Date.now();
  if (now - Logger.__memoryCache.ts > 1000) {
    Logger.__memoryCache = { rss: process.memoryUsage?.()?.rss ?? 0, ts: now };
  }
  const color = Logger.colorFunctions.get(level) ?? Logger.noColor;
  return [formatMemoryUsage(Logger.__memoryCache.rss).replace("RAM Usage ", ""), `${color(Logger.prefixes.get(level) ?? "DEBUG")} >`, ...args];
});

client.start()
  .then(() => {
    client.uploadCommands({ cachePath: "./commands.json" });
  });