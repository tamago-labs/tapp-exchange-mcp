import { z } from "zod";
import { TappAgent } from "../../agent";
import { McpTool } from "../../types";

export const GetPositionsTool: McpTool = {
    name: "tapp_get_positions",
    description: "Get a paginated list of liquidity positions for a user address",
    schema: {
        userAddr: z.string().optional().describe("The user's wallet address to fetch positions for (defaults to current agent address)"),
        page: z.number().optional().describe("The page number for pagination (defaults to 1)"),
        size: z.number().optional().describe("The number of results per page (defaults to 10)")
    },
    handler: async (agent: TappAgent, input: Record<string, any>) => {
        const positions = await agent.getPositions({
            userAddr: input.userAddr,
            page: input.page || 1,
            size: input.size || 10
        });
        return {
            status: "success",
            positions,
            pagination: {
                page: input.page || 1,
                size: input.size || 10,
                total: positions.length
            }
        };
    },
};

export const CollectFeeTool: McpTool = {
    name: "tapp_collect_fee",
    description: "Collect fees from a specific liquidity position in a given pool",
    schema: {
        poolId: z.string().describe("The address of the pool from which to collect fees"),
        positionAddr: z.string().describe("The address of the liquidity position")
    },
    handler: async (agent: TappAgent, input: Record<string, any>) => {
        const result = await agent.collectFee({
            poolId: input.poolId,
            positionAddr: input.positionAddr
        });
        return {
            status: "success",
            transaction: result
        };
    },
};
