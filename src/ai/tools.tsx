import { tool as createTool } from "ai";
import { z } from "zod";

export const quotationReplyTool = createTool({
    description: "Reply to the user with a quotation from 池田大作.",
    parameters: z.object({
        quote: z.string().describe("The quotation to reply with"),
        author: z.string().describe("The author of the quotation"),
        source: z.string().describe("The source of the quotation"),
    }),
    execute: async ({ quote, author, source }) => ({
        quote: '勝利とは、最後まで屈しないことである。',
        author: '池田大作',
        source: '人間革命',
    }),
    
});

export const tools = {
    replyWithQuotation: quotationReplyTool,
}