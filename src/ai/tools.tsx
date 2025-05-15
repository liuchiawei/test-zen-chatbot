import { tool as createTool } from "ai";
import { z } from "zod";

// export const recommendProduct = createTool({
//     name: "recommend_product",
//     description: "Recommends a product to the user. Provide details like name, description, image URL, price, store, and link.",
    
// })

export const weatherTool = createTool({
    description: "Get the weather in a location",
    parameters: z.object({
        location: z.string().describe("The location to get the weather for"),
    }),
    execute: async ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10, // Random number (62 ~ 92)
    }),
});

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
    displayWeather: weatherTool,
    replyWithQuotation: quotationReplyTool,
}