# Tapp Exchange MCP Server

An MCP (Model Context Protocol) server implementation for [Tapp Exchange](https://tapp-exchange.gitbook.io/tapp-exchange), a next-generation decentralized exchange built on Aptos blockchain.

## Overview

Tapp Exchange is a decentralized trading platform that brings together innovations from leading DEX protocols. Built on concepts from Uniswap v4, Tapp offers a powerful hooks system and advanced singleton vault design for unmatched capital efficiency.

This MCP server provides AI agents like Claude with the ability to interact with Tapp Exchange, enabling:

- **Pool Management**: Query available pools, get detailed pool information
- **Trading Operations**: Execute swaps on AMM, CLMM, and Stable pools
- **Liquidity Management**: Add/remove liquidity, create new pools
- **Position Tracking**: Monitor liquidity positions and collect fees

## Features

### Pool Types Supported
- **AMM Pools**: Traditional Automated Market Maker pools
- **CLMM Pools**: Concentrated Liquidity Market Maker pools (like Uniswap v3)
- **Stable Pools**: Optimized for stablecoin trading with low slippage

### Core Functionality
- Pool discovery and analytics
- Multi-pool type swap execution
- Liquidity provision and management
- Fee collection from positions
- Position monitoring and analytics

## Installation

```bash
npm install @tamago-labs/tapp-exchange-mcp
```

## Configuration

Create a `.env` file in your project root:

```bash
# Network Configuration
TAPP_NETWORK=mainnet  # or testnet, devnet

# Optional: Custom RPC URL
# TAPP_RPC_URL=https://fullnode.mainnet.aptoslabs.com/v1

# Optional: Private Key (if not provided, a new random key will be generated)
# TAPP_PRIVATE_KEY=your_private_key_here

# Optional: API Configuration
# TAPP_API_TIMEOUT=30000
```

## Usage

### As an MCP Server

```bash
npx tapp-exchange-mcp
```

### Integration with Claude Desktop

Add to your Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "tapp-exchange": {
      "command": "npx",
      "args": ["@tamago-labs/tapp-exchange-mcp"]
    }
  }
}
```

### Programmatic Usage

```typescript
import { TappAgent } from '@tamago-labs/tapp-exchange-mcp';

const agent = new TappAgent();

// Get available pools
const pools = await agent.getPools({
  page: 1,
  size: 10,
  sortBy: 'tvl'
});

// Execute a swap
const swapResult = await agent.swapAMM({
  poolId: 'pool_address',
  a2b: true,
  fixedAmountIn: true,
  amount0: 1000000,
  amount1: 0
});
```

## Available Tools

### Pool Management
- `tapp_get_pools` - Get paginated list of available pools
- `tapp_get_pool_info` - Get detailed information about a specific pool

### Swap Operations
- `tapp_get_swap_estimate` - Estimate swap amounts and price impact
- `tapp_get_swap_route` - Get optimal route between two tokens
- `tapp_swap_amm` - Execute swap on AMM pool
- `tapp_swap_clmm` - Execute swap on CLMM pool
- `tapp_swap_stable` - Execute swap on Stable pool

### Liquidity Management
- `tapp_create_amm_pool_and_add_liquidity` - Create new AMM pool with initial liquidity
- `tapp_create_clmm_pool_and_add_liquidity` - Create new CLMM pool with initial liquidity
- `tapp_create_stable_pool_and_add_liquidity` - Create new Stable pool with initial liquidity
- `tapp_add_amm_liquidity` - Add liquidity to existing AMM pool
- `tapp_add_clmm_liquidity` - Add liquidity to existing CLMM pool
- `tapp_add_stable_liquidity` - Add liquidity to existing Stable pool
- `tapp_remove_single_amm_liquidity` - Remove liquidity from single AMM position
- `tapp_remove_multiple_amm_liquidity` - Remove liquidity from multiple AMM positions
- `tapp_remove_single_clmm_liquidity` - Remove liquidity from single CLMM position
- `tapp_remove_multiple_clmm_liquidity` - Remove liquidity from multiple CLMM positions
- `tapp_remove_single_stable_liquidity` - Remove liquidity from single Stable position
- `tapp_remove_multiple_stable_liquidity` - Remove liquidity from multiple Stable positions

### Position Management
- `tapp_get_positions` - Get user's liquidity positions
- `tapp_collect_fee` - Collect fees from liquidity positions

## Testing

Run the included test scripts to verify functionality:

```bash
# Test pool operations
npm run test:pools

# Test swap operations
npm run test:swap

# Test liquidity operations
npm run test:liquidity
```

## Development

### Building

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## Architecture

The MCP server is built with:

- **TappAgent**: Core agent class that interfaces with Tapp Exchange SDK
- **MCP Tools**: Individual tools for each exchange operation
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Error Handling**: Robust error handling and validation
- **Key Management**: Automatic key format detection and validation

## Key Features

### Multi-Pool Support
- **AMM**: Traditional x*y=k pools
- **CLMM**: Concentrated liquidity with custom price ranges
- **Stable**: Stablecoin-optimized pools with low slippage

### Advanced Liquidity Management
- Single and batch position management
- Automated fee collection
- Position analytics and monitoring

### Safety Features
- Input validation and sanitization
- Transaction simulation before execution
- Slippage protection
- Gas estimation and optimization

## Dependencies

- `@aptos-labs/ts-sdk` - Aptos blockchain SDK
- `@tapp-exchange/sdk` - Official Tapp Exchange SDK
- `@modelcontextprotocol/sdk` - MCP framework
- `zod` - Runtime type validation

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests for any improvements.

## License

MIT License - see LICENSE file for details.

## Links

- [Tapp Exchange Documentation](https://tapp-exchange.gitbook.io/tapp-exchange)
- [Tapp Exchange SDK](https://tapp-exchange.gitbook.io/tapp-exchange/developer-docs/sdk)
- [Aptos Blockchain](https://aptos.dev)
- [Model Context Protocol](https://modelcontextprotocol.io)

## Support

For questions and support:
- GitHub Issues: [Create an issue](https://github.com/tamago-labs/tapp-exchange-mcp/issues)
- Documentation: [Tapp Exchange Docs](https://tapp-exchange.gitbook.io/tapp-exchange)
