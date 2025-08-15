import { z } from "zod";
import type { 
  Pool, 
  Position, 
  SwapEstimateResult,
  SwapAMMParams,
  SwapCLMMParams,
  SwapStableParams,
  CreateAMMPoolAndAddLiquidityParams,
  CreateCLMMPoolAndAddLiquidityParams,
  CreateStablePoolAndAddLiquidityParams,
  RemoveSingleAMMLiquidityParams,
  RemoveMultipleAMMLiquidityParams,
  RemoveSingleCLMMLiquidityParams,
  RemoveMultipleCLMMLiquidityParams,
  RemoveSingleStableLiquidityParams,
  RemoveMultipleStableLiquidityParams,
  CollectFeeParams,
  AddAMMLiquidityParams,
  AddCLMMLiquidityParams,
  AddStableLiquidityParams,
  TradeSizeExceedsError
} from '@tapp-exchange/sdk';

// Basic MCP Tool interface
export interface McpTool {
    name: string;
    description: string;
    schema: Record<string, z.ZodType>;
    handler: (agent: any, input: Record<string, any>) => Promise<any>;
}

// Re-export types from SDK for convenience
export type TappPool = Pool;
export type TappPosition = Position;
export type SwapEstimate = SwapEstimateResult;

// Re-export all parameter types
export type {
  SwapAMMParams,
  SwapCLMMParams,
  SwapStableParams,
  CreateAMMPoolAndAddLiquidityParams,
  CreateCLMMPoolAndAddLiquidityParams,
  CreateStablePoolAndAddLiquidityParams,
  RemoveSingleAMMLiquidityParams,
  RemoveMultipleAMMLiquidityParams,
  RemoveSingleCLMMLiquidityParams,
  RemoveMultipleCLMMLiquidityParams,
  RemoveSingleStableLiquidityParams,
  RemoveMultipleStableLiquidityParams,
  CollectFeeParams,
  AddAMMLiquidityParams,
  AddCLMMLiquidityParams,
  AddStableLiquidityParams,
  TradeSizeExceedsError
};

export interface TransactionResponse {
    hash: string;
    success: boolean;
    error?: string;
}

export interface TappConfig {
    network: 'mainnet' | 'testnet' | 'devnet';
    rpcUrl?: string;
    privateKey?: string;
    apiTimeout?: number;
}
