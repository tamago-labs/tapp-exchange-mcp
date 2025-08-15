// Type declarations for @tapp-exchange/sdk
declare module '@tapp-exchange/sdk' {
  import { Network } from '@aptos-labs/ts-sdk';

  // SDK Initialization
  export interface TappSDKConfig {
    network?: Network;
    url?: string;
  }

  export function initTappSDK(config?: TappSDKConfig): TappSDK;

  // Main SDK Interface
  export interface TappSDK {
    Pool: PoolModule;
    Swap: SwapModule;
    Position: PositionModule;
  }

  // Error Types
  export class TradeSizeExceedsError extends Error {
    maxAmountIn: number;
    constructor(message: string, maxAmountIn: number);
  }

  // Pool Module
  export interface PoolModule {
    getPools(params: GetPoolsParams): Promise<Pool[]>;
    getInfo(poolId: string): Promise<PoolInfo>;
  }

  export interface GetPoolsParams {
    page?: number;
    size?: number;
    sortBy?: string;
    type?: 'AMM' | 'CLMM' | 'STABLE';
  }

  export interface Pool {
    id: string;
    type: 'AMM' | 'CLMM' | 'STABLE';
    tokenA: string;
    tokenB: string;
    tokenC?: string;
    fee: number;
    tvl: number;
    volume24h?: number;
    apr?: number;
    apy?: number;
  }

  export interface PoolInfo extends Pool {
    liquidity?: number;
    sqrtPrice?: number;
    currentTick?: number;
    feeGrowthGlobal0?: number;
    feeGrowthGlobal1?: number;
  }

  // Swap Module
  export interface SwapModule {
    getEstSwapAmount(params: EstSwapAmountParams): Promise<SwapEstimateResult>;
    getRoute(token0: string, token1: string): Promise<RouteInfo>;
    swapAMMTransactionPayload(params: SwapAMMParams): TransactionPayload;
    swapCLMMTransactionPayload(params: SwapCLMMParams): TransactionPayload;
    swapStableTransactionPayload(params: SwapStableParams): TransactionPayload;
  }

  export interface EstSwapAmountParams {
    amount: number;
    poolId: string;
    pair: [number, number];
    a2b: boolean;
    field?: 'input' | 'output';
  }

  export interface SwapEstimateResult {
    amountIn: number;
    amountOut: number;
    priceImpact?: number;
    minimumReceived?: number;
    fee?: number;
    error?: TradeSizeExceedsError;
  }

  export interface RouteInfo {
    pools?: string[];
    path?: string[];
    expectedOutput?: number;
    priceImpact?: number;
    [key: string]: any; // Allow for flexible route structure
  }

  export interface SwapAMMParams {
    poolId: string;
    a2b: boolean;
    fixedAmountIn: boolean;
    amount0: number;
    amount1: number;
  }

  export interface SwapCLMMParams {
    poolId: string;
    amountIn: number;
    minAmountOut: number;
    a2b: boolean;
    fixedAmountIn: boolean;
    targetSqrtPrice: number;
  }

  export interface SwapStableParams {
    poolId: string;
    tokenIn: number;
    tokenOut: number;
    amountIn: number;
    minAmountOut: number;
  }

  // Position Module
  export interface PositionModule {
    // Pool Creation with Initial Liquidity
    createAMMPoolAndAddLiquidity(params: CreateAMMPoolAndAddLiquidityParams): TransactionPayload;
    createCLMMPoolAndAddLiquidity(params: CreateCLMMPoolAndAddLiquidityParams): TransactionPayload;
    createStablePoolAndAddLiquidity(params: CreateStablePoolAndAddLiquidityParams): TransactionPayload;

    // Add Liquidity to Existing Pools
    addAMMLiquidity(params: AddAMMLiquidityParams): TransactionPayload;
    addCLMMLiquidity(params: AddCLMMLiquidityParams): TransactionPayload;
    addStableLiquidity(params: AddStableLiquidityParams): TransactionPayload;

    // Remove Liquidity
    removeSingleAMMLiquidity(params: RemoveSingleAMMLiquidityParams): TransactionPayload;
    removeMultipleAMMLiquidity(params: RemoveMultipleAMMLiquidityParams): TransactionPayload;
    removeSingleCLMMLiquidity(params: RemoveSingleCLMMLiquidityParams): TransactionPayload;
    removeMultipleCLMMLiquidity(params: RemoveMultipleCLMMLiquidityParams): TransactionPayload;
    removeSingleStableLiquidity(params: RemoveSingleStableLiquidityParams): TransactionPayload;
    removeMultipleStableLiquidity(params: RemoveMultipleStableLiquidityParams): TransactionPayload;

    // Position Management
    getPositions(params: GetPositionsParams): Promise<Position[]>;
    collectFee(params: CollectFeeParams): TransactionPayload;
  }

  // Pool Creation Parameters
  export interface CreateAMMPoolAndAddLiquidityParams {
    tokenAddress: string[];
    fee: number;
    amounts: number[];
  }

  export interface CreateCLMMPoolAndAddLiquidityParams {
    tokenAddress: string[];
    fee: number;
    amounts: number[];
    initialPrice: number;
    minPrice: number;
    maxPrice: number;
    isMaxAmountB: boolean;
  }

  export interface CreateStablePoolAndAddLiquidityParams {
    tokenAddress: string[];
    fee: number;
    amounts: number[];
    amplificationFactor: number;
    offpeg_fee_multiplier?: number;
  }

  // Add Liquidity Parameters
  export interface AddAMMLiquidityParams {
    poolId: string;
    amountA: number;
    amountB: number;
  }

  export interface AddCLMMLiquidityParams {
    poolId: string;
    amountA: number;
    amountB: number;
    fee: number;
    isMaxAmountB: boolean;
    minPrice: number;
    maxPrice: number;
  }

  export interface AddStableLiquidityParams {
    poolId: string;
    amounts: number[];
  }

  // Remove Liquidity Parameters
  export interface RemoveSingleAMMLiquidityParams {
    poolId: string;
    positionAddr: string;
    mintedShare: number;
    minAmount0: number;
    minAmount1: number;
  }

  export interface RemoveMultipleAMMLiquidityParams {
    poolId: string;
    positions: {
      positionAddr: string;
      mintedShare: number;
      minAmount0: number;
      minAmount1: number;
    }[];
  }

  export interface RemoveSingleCLMMLiquidityParams {
    poolId: string;
    positionAddr: string;
    mintedShare: number;
    minAmount0: number;
    minAmount1: number;
  }

  export interface RemoveMultipleCLMMLiquidityParams {
    poolId: string;
    positions: {
      positionAddr: string;
      mintedShare: number;
      minAmount0: number;
      minAmount1: number;
    }[];
  }

  export interface RemoveSingleStableLiquidityParams {
    poolId: string;
    position: {
      positionAddr: string;
      mintedShare: number;
      amounts: number[];
    };
  }

  export interface RemoveMultipleStableLiquidityParams {
    poolId: string;
    positions: {
      positionAddr: string;
      mintedShare: number;
      amounts: number[];
    }[];
  }

  // Position Management Parameters
  export interface GetPositionsParams {
    userAddr: string;
    page?: number;
    size?: number;
  }

  export interface CollectFeeParams {
    poolId: string;
    positionAddr: string;
  }

  // Position Types
  export interface Position {
    positionAddr: string;
    poolId: string;
    mintedShare: number;
    amountA?: number;
    amountB?: number;
    amounts?: number[];
    minPrice?: number;
    maxPrice?: number;
    fees?: {
      amountA: number;
      amountB: number;
    };
    tickLower?: number;
    tickUpper?: number;
    liquidity?: number;
  }

  // Transaction Payload Types (generic for Move transaction payloads)
  export interface TransactionPayload {
    function: string;
    type_arguments: string[];
    arguments: any[];
  }
}
