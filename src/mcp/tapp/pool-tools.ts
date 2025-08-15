import { z } from "zod";
import { TappAgent } from "../../agent";
import { McpTool } from "../../types";

export const GetPoolsTool: McpTool = {
    name: "tapp_get_pools",
    description: "Get a paginated list of available pools on Tapp Exchange, optionally filtered by type and sorted by TVL",
    schema: {
        page: z.number().optional().describe("The page number to fetch (defaults to 1)"),
        size: z.number().optional().describe("Number of items per page (defaults to 10)"),
        sortBy: z.string().optional().describe("Field to sort by (defaults to 'tvl')"),
        type: z.string().optional().describe("Pool type filter: 'AMM', 'CLMM', or 'STABLE'")
    },
    handler: async (agent: TappAgent, input: Record<string, any>) => {
        const pools = await agent.getPools(input);
        return {
            status: "success",
            pools,
            pagination: {
                page: input.page || 1,
                size: input.size || 10,
                total: pools.length
            }
        };
    },
};

export const GetPoolInfoTool: McpTool = {
    name: "tapp_get_pool_info",
    description: "Get detailed information about a specific pool by its ID",
    schema: {
        poolId: z.string().describe("The pool ID to get information for")
    },
    handler: async (agent: TappAgent, input: Record<string, any>) => {
        const poolInfo = await agent.getPoolInfo(input.poolId);
        return {
            status: "success",
            pool: poolInfo
        };
    },
};
