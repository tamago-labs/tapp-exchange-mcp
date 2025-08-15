// Global type declarations for the Tapp Exchange MCP project

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TAPP_NETWORK?: 'mainnet' | 'testnet' | 'devnet';
      TAPP_RPC_URL?: string;
      TAPP_PRIVATE_KEY?: string;
      TAPP_API_TIMEOUT?: string;
    }
  }
}

// Module augmentations
declare module '@aptos-labs/ts-sdk' {
  // Ensure any additional types we might need from Aptos SDK are available
  export interface TransactionPayload {
    function: string;
    type_arguments: string[];
    arguments: any[];
  }
}

export {};
