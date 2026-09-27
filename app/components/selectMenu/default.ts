import { ComponentCommand, type ComponentContext } from 'seyfert';

export default class Default extends ComponentCommand {
    componentType = 'SelectMenu' as const;

    async run(ctx: ComponentContext<typeof this.componentType>) {
        return ctx.editOrReply({ content: 'Hello World' });
    }
}