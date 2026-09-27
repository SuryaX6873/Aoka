import {
  Modal,
  Command,
  Declare,
  type ModalSubmitInteraction,
  type CommandContext,
} from 'seyfert';

@Declare({
  name: 'modal',
  description: 'I will send you a hello world message',
})
export default class HelloWorldCommand extends Command {
  async run(ctx: CommandContext) {
    const modal = new Modal()
      .setCustomId('hello')
      .setTitle('Hello')
      .run(this.handleModal);

    await ctx.modal(modal);
  }

  async handleModal(i: ModalSubmitInteraction) {
    return i.write({ content: 'Hello World 👋' });
  }
}