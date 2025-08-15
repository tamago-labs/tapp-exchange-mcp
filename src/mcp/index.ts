import { GetPoolsTool, GetPoolInfoTool } from "./tapp/pool-tools";
import { 
    GetSwapEstimateTool, 
    GetSwapRouteTool, 
    SwapAMMTool, 
    SwapCLMMTool, 
    SwapStableTool 
} from "./tapp/swap-tools";
import {
    CreateAMMPoolAndAddLiquidityTool,
    CreateCLMMPoolAndAddLiquidityTool,
    CreateStablePoolAndAddLiquidityTool,
    AddAMMLiquidityTool,
    AddCLMMLiquidityTool,
    AddStableLiquidityTool,
    RemoveSingleAMMLiquidityTool,
    RemoveMultipleAMMLiquidityTool,
    RemoveSingleCLMMLiquidityTool,
    RemoveMultipleCLMMLiquidityTool,
    RemoveSingleStableLiquidityTool,
    RemoveMultipleStableLiquidityTool
} from "./tapp/liquidity-tools";
import { GetPositionsTool, CollectFeeTool } from "./tapp/position-tools";

export const TappExchangeMcpTools = {
    // Pool Management Tools
    "GetPoolsTool": GetPoolsTool,
    "GetPoolInfoTool": GetPoolInfoTool,

    // Swap Tools
    "GetSwapEstimateTool": GetSwapEstimateTool,
    "GetSwapRouteTool": GetSwapRouteTool,
    "SwapAMMTool": SwapAMMTool,
    "SwapCLMMTool": SwapCLMMTool,
    "SwapStableTool": SwapStableTool,

    // Pool Creation and Initial Liquidity Tools
    "CreateAMMPoolAndAddLiquidityTool": CreateAMMPoolAndAddLiquidityTool,
    "CreateCLMMPoolAndAddLiquidityTool": CreateCLMMPoolAndAddLiquidityTool,
    "CreateStablePoolAndAddLiquidityTool": CreateStablePoolAndAddLiquidityTool,

    // Add Liquidity Tools
    "AddAMMLiquidityTool": AddAMMLiquidityTool,
    "AddCLMMLiquidityTool": AddCLMMLiquidityTool,
    "AddStableLiquidityTool": AddStableLiquidityTool,

    // Remove Liquidity Tools
    "RemoveSingleAMMLiquidityTool": RemoveSingleAMMLiquidityTool,
    "RemoveMultipleAMMLiquidityTool": RemoveMultipleAMMLiquidityTool,
    "RemoveSingleCLMMLiquidityTool": RemoveSingleCLMMLiquidityTool,
    "RemoveMultipleCLMMLiquidityTool": RemoveMultipleCLMMLiquidityTool,
    "RemoveSingleStableLiquidityTool": RemoveSingleStableLiquidityTool,
    "RemoveMultipleStableLiquidityTool": RemoveMultipleStableLiquidityTool,

    // Position Management Tools
    "GetPositionsTool": GetPositionsTool,
    "CollectFeeTool": CollectFeeTool
};
