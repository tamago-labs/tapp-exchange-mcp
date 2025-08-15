import { z } from "zod";
import { TappAgent } from "../../agent";
import { McpTool } from "../../types";

export const GetSwapEstimateTool: McpTool = {
    name: "tapp_get_swap_estimate",
    description: "Estimate the amount received or needed for a swap on Tapp Exchange",
    schema: {
        amount: z.number().describe("The amount for estimation (used as input or desired output depending on field)"),
        poolId: z.string().describe("The identifier of the pool"),
        pair: z.array(z.number()).describe("A tuple of token indexes to swap, e.g., [0, 1] means token at index 0 is being swapped for token at index 1"),
        a2b: z.boolean().describe("Swap direction - true for token at pair[0] to pair[1], false for pair[1] to pair[0]"),
        field: z.enum(['input', 'output']).optional().describe("Indicates if amount is an 'input' or 'output' amount (defaults to 'input')")
    },
    handler: async (agent: TappAgent, input: Record<string, any>) => {
        const estimate = await agent.getEstimateSwapAmount({
            amount: input.amount,
            poolId: input.poolId,
            pair: input.pair as [number, number],
            a2b: input.a2b,
            field: input.field || 'input'
        });
        return {
            status: "success",
            estimate
        };
    },
};

export const GetSwapRouteTool: McpTool = {
    name: "tapp_get_swap_route",
    description: "Get the optimal route information between two tokens",
    schema: {
        token0: z.string().describe("The address of the first token"),
        token1: z.string().describe("The address of the second token")
    },
    handler: async (agent: TappAgent, input: Record<string, any>) => {
        const route = await agent.getSwapRoute(input.token0, input.token1);
        return {
            status: "success",
            route
        };
    },
};

export const SwapAMMTool: McpTool = {
    name: "tapp_swap_amm",
    description: "Execute a swap on an AMM pool",
    schema: {
        poolId: z.string().describe("The address of the pool in which the swap is performed"),
        a2b: z.boolean().describe("Direction of the swap; true for token A to B, false for B to A"),
        fixedAmountIn: z.boolean().optional().describe("Whether the input amount is fixed (defaults to true)"),
        amount0: z.number().describe("Amount of token A"),
        amount1: z.number().describe("Amount of token B")
    },
    handler: async (agent: TappAgent, input: Record<string, any>) => {
        const result = await agent.swapAMM({
            poolId: input.poolId,
            a2b: input.a2b,
            fixedAmountIn: input.fixedAmountIn ?? true,
            amount0: input.amount0,
            amount1: input.amount1
        });
        return {
            status: "success",
            transaction: result
        };
    },
};

export const SwapCLMMTool: McpTool = {
    name: "tapp_swap_clmm",
    description: "Execute a swap on a CLMM (Concentrated Liquidity Market Maker) pool",
    schema: {
        poolId: z.string().describe("The address of the CLMM pool"),
        amountIn: z.number().describe("The input token amount for the swap"),
        minAmountOut: z.number().describe("The minimum acceptable output amount"),
        a2b: z.boolean().describe("Direction of the swap; true for token A to B, false for B to A"),
        fixedAmountIn: z.boolean().optional().describe("Indicates whether amountIn is fixed (defaults to true)"),
        targetSqrtPrice: z.number().describe("The target square root price")
    },
    handler: async (agent: TappAgent, input: Record<string, any>) => {
        const result = await agent.swapCLMM({
            poolId: input.poolId,
            amountIn: input.amountIn,
            minAmountOut: input.minAmountOut,
            a2b: input.a2b,
            fixedAmountIn: input.fixedAmountIn ?? true,
            targetSqrtPrice: input.targetSqrtPrice
        });
        return {
            status: "success",
            transaction: result
        };
    },
};

export const SwapStableTool: McpTool = {
    name: "tapp_swap_stable",
    description: "Execute a swap on a Stable pool",
    schema: {
        poolId: z.string().describe("The address of the Stable pool"),
        tokenIn: z.number().describe("The index of the token to swap from"),
        tokenOut: z.number().describe("The index of the token to swap to"),
        amountIn: z.number().describe("The input token amount for the swap"),
        minAmountOut: z.number().describe("The minimum amount of output tokens")
    },
    handler: async (agent: TappAgent, input: Record<string, any>) => {
        const result = await agent.swapStable({
            poolId: input.poolId,
            tokenIn: input.tokenIn,
            tokenOut: input.tokenOut,
            amountIn: input.amountIn,
            minAmountOut: input.minAmountOut
        });
        return {
            status: "success",
            transaction: result
        };
    },
};
