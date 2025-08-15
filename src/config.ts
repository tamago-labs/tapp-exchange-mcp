import { config } from 'dotenv';
import { TappConfig } from './types';

config();

export function getTappConfig(): TappConfig {
    const network = (process.env.TAPP_NETWORK as 'mainnet' | 'testnet' | 'devnet') || 'mainnet';
    
    return {
        network,
        rpcUrl: process.env.TAPP_RPC_URL,
        privateKey: process.env.TAPP_PRIVATE_KEY,
        apiTimeout: process.env.TAPP_API_TIMEOUT ? parseInt(process.env.TAPP_API_TIMEOUT) : 30000
    };
}
