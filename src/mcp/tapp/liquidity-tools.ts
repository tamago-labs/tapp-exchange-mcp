import { z } from "zod";
import { TappAgent } from "../../agent";
import { McpTool } from "../../types";

// Pool Creation and Initial Liquidity Addition Tools
export const CreateAMMPoolAndAddLiquidityTool: McpTool = {
    name: "tapp_create_amm_pool_and_add_liquidity",
    description: "Create an AMM pool and add initial liquidity",
    schema: {
        tokenAddress: z.array(z.string()).describe("An array of token addresses"),
        fee: z.number().describe("The fee traders will pay to use your pool's liquidity"),
        amounts: z.array(z.number()).describe("The initial token amounts")
    },
    handler: async (agent: TappAgent, input: Record<string, any>) => {
        const result = await agent.createAMMPoolAndAddLiquidity({
            tokenAddress: input.tokenAddress,
            fee: input.fee,
            amounts: input.amounts
        });
        return {
            status: "success",
            transaction: result
        };
    },
};

export const CreateCLMMPoolAndAddLiquidityTool: McpTool = {
    name: "tapp_create_clmm_pool_and_add_liquidity",
    description: "Create a CLMM pool and add initial liquidity",
    schema: {
        tokenAddress: z.array(z.string()).describe("An array of token addresses"),
        fee: z.number().describe("The fee traders will pay to use your pool's liquidity"),
        amounts: z.array(z.number()).describe("The initial token amounts"),
        initialPrice: z.number().describe("Starting price for liquidity"),
        minPrice: z.number().describe("The lower bound price of the liquidity range"),
        maxPrice: z.number().describe("The upper bound price of the liquidity range"),
        isMaxAmountB: z.boolean().describe("Whether the second token amount (amountB) is flexible based on slippage")
    },
    handler: async (agent: TappAgent, input: Record<string, any>) => {
        const result = await agent.createCLMMPoolAndAddLiquidity({
            tokenAddress: input.tokenAddress,
            fee: input.fee,
            amounts: input.amounts,
            initialPrice: input.initialPrice,
            minPrice: input.minPrice,
            maxPrice: input.maxPrice,
            isMaxAmountB: input.isMaxAmountB
        });
        return {
            status: "success",
            transaction: result
        };
    },
};

export const CreateStablePoolAndAddLiquidityTool: McpTool = {
    name: "tapp_create_stable_pool_and_add_liquidity",
    description: "Create a Stable pool and add initial liquidity",
    schema: {
        tokenAddress: z.array(z.string()).describe("An array of token addresses"),
        fee: z.number().describe("The fee traders will pay to use your pool's liquidity"),
        amounts: z.array(z.number()).describe("The initial token amounts"),
        amplificationFactor: z.number().describe("Amplification factor"),
        offpeg_fee_multiplier: z.number().optional().describe("Optional. Multiplier applied to fee when assets are off-peg. Defaults to 20_000_000_000")
    },
    handler: async (agent: TappAgent, input: Record<string, any>) => {
        const result = await agent.createStablePoolAndAddLiquidity({
            tokenAddress: input.tokenAddress,
            fee: input.fee,
            amounts: input.amounts,
            amplificationFactor: input.amplificationFactor,
            offpeg_fee_multiplier: input.offpeg_fee_multiplier
        });
        return {
            status: "success",
            transaction: result
        };
    },
};

// Add Liquidity to Existing Pools
export const AddAMMLiquidityTool: McpTool = {
    name: "tapp_add_amm_liquidity",
    description: "Add liquidity to an existing AMM pool",
    schema: {
        poolId: z.string().describe("The ID of the AMM pool"),
        amountA: z.number().describe("The amount of token A to add as liquidity"),
        amountB: z.number().describe("The amount of token B to add as liquidity")
    },
    handler: async (agent: TappAgent, input: Record<string, any>) => {
        const result = await agent.addAMMLiquidity({
            poolId: input.poolId,
            amountA: input.amountA,
            amountB: input.amountB
        });
        return {
            status: "success",
            transaction: result
        };
    },
};

export const AddCLMMLiquidityTool: McpTool = {
    name: "tapp_add_clmm_liquidity",
    description: "Add liquidity to an existing CLMM pool",
    schema: {
        poolId: z.string().describe("The unique identifier of the CLMM pool"),
        amountA: z.number().describe("The amount of token A to add"),
        amountB: z.number().describe("The amount of token B to add"),
        fee: z.number().describe("The fee tier of the pool"),
        isMaxAmountB: z.boolean().describe("Whether the second token amount (amountB) is flexible based on slippage"),
        minPrice: z.number().describe("The minimum price of the liquidity range"),
        maxPrice: z.number().describe("The maximum price of the liquidity range")
    },
    handler: async (agent: TappAgent, input: Record<string, any>) => {
        const result = await agent.addCLMMLiquidity({
            poolId: input.poolId,
            amountA: input.amountA,
            amountB: input.amountB,
            fee: input.fee,
            isMaxAmountB: input.isMaxAmountB,
            minPrice: input.minPrice,
            maxPrice: input.maxPrice
        });
        return {
            status: "success",
            transaction: result
        };
    },
};

export const AddStableLiquidityTool: McpTool = {
    name: "tapp_add_stable_liquidity",
    description: "Add liquidity to an existing stable pool",
    schema: {
        poolId: z.string().describe("The ID of the stable pool"),
        amounts: z.array(z.number()).describe("An array of token amounts")
    },
    handler: async (agent: TappAgent, input: Record<string, any>) => {
        const result = await agent.addStableLiquidity({
            poolId: input.poolId,
            amounts: input.amounts
        });
        return {
            status: "success",
            transaction: result
        };
    },
};

// Remove Liquidity Tools
export const RemoveSingleAMMLiquidityTool: McpTool = {
    name: "tapp_remove_single_amm_liquidity",
    description: "Remove liquidity from a single AMM position",
    schema: {
        poolId: z.string().describe("The ID of the AMM pool"),
        positionAddr: z.string().describe("The address of the liquidity position"),
        mintedShare: z.number().describe("The amount of share tokens to burn"),
        minAmount0: z.number().describe("Minimum amount of token0"),
        minAmount1: z.number().describe("Minimum amount of token1")
    },
    handler: async (agent: TappAgent, input: Record<string, any>) => {
        const result = await agent.removeSingleAMMLiquidity({
            poolId: input.poolId,
            positionAddr: input.positionAddr,
            mintedShare: input.mintedShare,
            minAmount0: input.minAmount0,
            minAmount1: input.minAmount1
        });
        return {
            status: "success",
            transaction: result
        };
    },
};

export const RemoveMultipleAMMLiquidityTool: McpTool = {
    name: "tapp_remove_multiple_amm_liquidity",
    description: "Remove liquidity from multiple AMM positions",
    schema: {
        poolId: z.string().describe("The ID of the pool"),
        positions: z.array(z.object({
            positionAddr: z.string().describe("The address of the liquidity position"),
            mintedShare: z.number().describe("The amount of share tokens to burn"),
            minAmount0: z.number().describe("Minimum amount token0"),
            minAmount1: z.number().describe("Minimum amount token1")
        })).describe("An array of position objects")
    },
    handler: async (agent: TappAgent, input: Record<string, any>) => {
        const result = await agent.removeMultipleAMMLiquidity({
            poolId: input.poolId,
            positions: input.positions
        });
        return {
            status: "success",
            transaction: result
        };
    },
};

export const RemoveSingleCLMMLiquidityTool: McpTool = {
    name: "tapp_remove_single_clmm_liquidity",
    description: "Remove liquidity from a single CLMM position",
    schema: {
        poolId: z.string().describe("The ID of the CLMM pool"),
        positionAddr: z.string().describe("The address of the liquidity position"),
        mintedShare: z.number().describe("The amount of share tokens to burn"),
        minAmount0: z.number().describe("Minimum amount of token0"),
        minAmount1: z.number().describe("Minimum amount of token1")
    },
    handler: async (agent: TappAgent, input: Record<string, any>) => {
        const result = await agent.removeSingleCLMMLiquidity({
            poolId: input.poolId,
            positionAddr: input.positionAddr,
            mintedShare: input.mintedShare,
            minAmount0: input.minAmount0,
            minAmount1: input.minAmount1
        });
        return {
            status: "success",
            transaction: result
        };
    },
};

export const RemoveMultipleCLMMLiquidityTool: McpTool = {
    name: "tapp_remove_multiple_clmm_liquidity",
    description: "Remove liquidity from multiple CLMM positions",
    schema: {
        poolId: z.string().describe("The ID of the CLMM pool"),
        positions: z.array(z.object({
            positionAddr: z.string().describe("The address of the liquidity position"),
            mintedShare: z.number().describe("The amount of share tokens to burn"),
            minAmount0: z.number().describe("Minimum amount of token0"),
            minAmount1: z.number().describe("Minimum amount of token1")
        })).describe("An array of position objects")
    },
    handler: async (agent: TappAgent, input: Record<string, any>) => {
        const result = await agent.removeMultipleCLMMLiquidity({
            poolId: input.poolId,
            positions: input.positions
        });
        return {
            status: "success",
            transaction: result
        };
    },
};

export const RemoveSingleStableLiquidityTool: McpTool = {
    name: "tapp_remove_single_stable_liquidity",
    description: "Remove liquidity from a single STABLE position",
    schema: {
        poolId: z.string().describe("The ID of the stable pool"),
        position: z.object({
            positionAddr: z.string().describe("The address of the individual liquidity position"),
            mintedShare: z.number().describe("The amount of share tokens to burn"),
            amounts: z.array(z.number()).describe("The minimum token amounts to receive")
        }).describe("The position object")
    },
    handler: async (agent: TappAgent, input: Record<string, any>) => {
        const result = await agent.removeSingleStableLiquidity({
            poolId: input.poolId,
            position: input.position
        });
        return {
            status: "success",
            transaction: result
        };
    },
};

export const RemoveMultipleStableLiquidityTool: McpTool = {
    name: "tapp_remove_multiple_stable_liquidity",
    description: "Remove liquidity from multiple STABLE positions",
    schema: {
        poolId: z.string().describe("The ID of the stable pool"),
        positions: z.array(z.object({
            positionAddr: z.string().describe("The address of the individual liquidity position"),
            mintedShare: z.number().describe("The amount of share tokens to burn"),
            amounts: z.array(z.number()).describe("The minimum token amounts to receive")
        })).describe("An array of position objects")
    },
    handler: async (agent: TappAgent, input: Record<string, any>) => {
        const result = await agent.removeMultipleStableLiquidity({
            poolId: input.poolId,
            positions: input.positions
        });
        return {
            status: "success",
            transaction: result
        };
    },
};
