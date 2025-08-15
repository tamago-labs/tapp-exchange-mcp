import {
    Account,
    AccountAddress,
    Aptos,
    AptosConfig as AptosSDKConfig,
    Ed25519PrivateKey,
    Secp256k1PrivateKey,
    Network,
    PrivateKey,
    PrivateKeyVariants
} from "@aptos-labs/ts-sdk";
import { initTappSDK, TappSDK } from '@tapp-exchange/sdk';
import { getTappConfig } from "../config";
import {
    TappPool,
    TappPosition,
    SwapEstimate,
    TransactionResponse,
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
    AddStableLiquidityParams
} from "../types";

// Key format detection utility (reused from base Aptos MCP)
class KeyFormatDetector {
    static detectAndCreateKey(privateKeyInput: string): Ed25519PrivateKey | Secp256k1PrivateKey {
        const cleanKey = this.cleanPrivateKey(privateKeyInput);
        const format = this.detectKeyFormat(privateKeyInput, cleanKey);

        console.error(`Auto-detected key format: ${format}`);

        switch (format) {
            case 'secp256k1':
                return new Secp256k1PrivateKey(
                    PrivateKey.formatPrivateKey(cleanKey, PrivateKeyVariants.Secp256k1)
                );
            case 'ed25519':
            default:
                return new Ed25519PrivateKey(
                    PrivateKey.formatPrivateKey(cleanKey, PrivateKeyVariants.Ed25519)
                );
        }
    }

    private static cleanPrivateKey(privateKey: string): string {
        let cleaned = privateKey.trim();

        const prefixes = [
            'secp256k1-priv-',
            'ed25519-priv-',
            'private-key-',
            'priv-',
        ];

        for (const prefix of prefixes) {
            if (cleaned.toLowerCase().startsWith(prefix.toLowerCase())) {
                cleaned = cleaned.substring(prefix.length);
                break;
            }
        }

        if (!cleaned.startsWith('0x') && this.isHexString(cleaned)) {
            cleaned = '0x' + cleaned;
        }

        return cleaned;
    }

    private static detectKeyFormat(originalKey: string, cleanedKey: string): 'secp256k1' | 'ed25519' {
        if (originalKey.toLowerCase().includes('secp256k1')) {
            return 'secp256k1';
        }

        if (originalKey.toLowerCase().includes('ed25519')) {
            return 'ed25519';
        }

        const keyHex = cleanedKey.startsWith('0x') ? cleanedKey.slice(2) : cleanedKey;

        if (keyHex.length === 64) {
            return this.advancedKeyFormatDetection(keyHex);
        }

        if (keyHex.length === 66 && keyHex.startsWith('00')) {
            return 'secp256k1';
        }

        return 'ed25519';
    }

    private static advancedKeyFormatDetection(keyHex: string): 'secp256k1' | 'ed25519' {
        try {
            const secp256k1Order = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141');
            const keyValue = BigInt('0x' + keyHex);

            if (keyValue >= secp256k1Order) {
                return 'ed25519';
            }

            return 'ed25519';
        } catch (error) {
            console.warn('Error in advanced key detection:', error);
        }

        return 'ed25519';
    }

    private static isHexString(str: string): boolean {
        return /^[0-9a-fA-F]+$/.test(str);
    }

    static validateKey(privateKeyInput: string): { isValid: boolean; format: string; error?: string } {
        try {
            const key = this.detectAndCreateKey(privateKeyInput);
            const account = Account.fromPrivateKey({ privateKey: key });

            return {
                isValid: true,
                format: key instanceof Secp256k1PrivateKey ? 'secp256k1' : 'ed25519',
            };
        } catch (error) {
            return {
                isValid: false,
                format: 'unknown',
                error: error instanceof Error ? error.message : 'Unknown validation error'
            };
        }
    }
}

export class TappAgent {
    public account: Account;
    public aptos: Aptos;
    public sdk: TappSDK; // Properly typed Tapp SDK instance
    public network: 'mainnet' | 'testnet' | 'devnet';
    public keyFormat: 'secp256k1' | 'ed25519';

    constructor() {
        const config = getTappConfig();

        // Map network string to Network enum
        let networkEnum: Network;
        switch (config.network) {
            case 'mainnet':
                networkEnum = Network.MAINNET;
                break;
            case 'testnet':
                networkEnum = Network.TESTNET;
                break;
            case 'devnet':
                networkEnum = Network.DEVNET;
                break;
            default:
                networkEnum = Network.MAINNET;
        }

        this.network = config.network;

        // Initialize Aptos client
        const aptosConfig = new AptosSDKConfig({ 
            network: networkEnum,
            ...(config.rpcUrl && { fullnode: config.rpcUrl })
        });
        this.aptos = new Aptos(aptosConfig);

        // Initialize Tapp SDK
        this.sdk = initTappSDK({
            network: networkEnum,
            ...(config.rpcUrl && { url: config.rpcUrl })
        });

        // Setup account
        if (config.privateKey) {
            const validation = KeyFormatDetector.validateKey(config.privateKey);
            if (!validation.isValid) {
                throw new Error(`Invalid private key: ${validation.error}`);
            }
        }

        const privateKey = KeyFormatDetector.detectAndCreateKey(
            config.privateKey || `${(Account.generate().privateKey)}`
        );
        this.keyFormat = privateKey instanceof Secp256k1PrivateKey ? 'secp256k1' : 'ed25519';

        console.error(`✅ Successfully initialized TappAgent with ${this.keyFormat} key format`);

        this.account = Account.fromPrivateKey({ privateKey });
    }

    async getAddress(): Promise<string> {
        return this.account.accountAddress.toString();
    }

    async getKeyInfo(): Promise<{
        address: string;
        format: string;
        publicKey: string;
    }> {
        return {
            address: await this.getAddress(),
            format: this.keyFormat,
            publicKey: this.account.publicKey.toString(),
        };
    }

    // Pool Management
    async getPools(params: {
        page?: number;
        size?: number;
        sortBy?: string;
        type?: string;
    }): Promise<TappPool[]> {
        const pools = await this.sdk.Pool.getPools(params as any);
        return pools;
    }

    async getPoolInfo(poolId: string): Promise<TappPool> {
        const info = await this.sdk.Pool.getInfo(poolId);
        return info;
    }

    // Swap Operations
    async getEstimateSwapAmount(params: {
        amount: number;
        poolId: string;
        pair: [number, number];
        a2b: boolean;
        field?: 'input' | 'output';
    }): Promise<SwapEstimate> {
        const result = await this.sdk.Swap.getEstSwapAmount(params);
        return result;
    }

    async getSwapRoute(token0: string, token1: string): Promise<any> {
        const route = await this.sdk.Swap.getRoute(token0, token1);
        return route;
    }

    async swapAMM(params: SwapAMMParams): Promise<TransactionResponse> {
        try {
            const data = this.sdk.Swap.swapAMMTransactionPayload(params);
            const response = await this.aptos.transaction.submit.simple({
                sender: this.account.accountAddress,
                data: data
            } as any);

            return {
                hash: response.hash,
                success: true
            };
        } catch (error) {
            return {
                hash: '',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    async swapCLMM(params: SwapCLMMParams): Promise<TransactionResponse> {
        try {
            const data = this.sdk.Swap.swapCLMMTransactionPayload(params);
            const response = await this.aptos.transaction.submit.simple({
                sender: this.account.accountAddress,
                data: data
            } as any);

            return {
                hash: response.hash,
                success: true
            };
        } catch (error) {
            return {
                hash: '',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    async swapStable(params: SwapStableParams): Promise<TransactionResponse> {
        try {
            const data = this.sdk.Swap.swapStableTransactionPayload(params);
            const response = await this.aptos.transaction.submit.simple({
                sender: this.account.accountAddress,
                data: data
            } as any);

            return {
                hash: response.hash,
                success: true
            };
        } catch (error) {
            return {
                hash: '',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    // Liquidity Operations
    async createAMMPoolAndAddLiquidity(params: CreateAMMPoolAndAddLiquidityParams): Promise<TransactionResponse> {
        try {
            const data = this.sdk.Position.createAMMPoolAndAddLiquidity(params);
            const response = await this.aptos.transaction.submit.simple({
                sender: this.account.accountAddress,
                data: data
            } as any);

            return {
                hash: response.hash,
                success: true
            };
        } catch (error) {
            return {
                hash: '',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    async createCLMMPoolAndAddLiquidity(params: CreateCLMMPoolAndAddLiquidityParams): Promise<TransactionResponse> {
        try {
            const data = this.sdk.Position.createCLMMPoolAndAddLiquidity(params);
            const response = await this.aptos.transaction.submit.simple({
                sender: this.account.accountAddress,
                data: data
            } as any);

            return {
                hash: response.hash,
                success: true
            };
        } catch (error) {
            return {
                hash: '',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    async createStablePoolAndAddLiquidity(params: CreateStablePoolAndAddLiquidityParams): Promise<TransactionResponse> {
        try {
            const data = this.sdk.Position.createStablePoolAndAddLiquidity(params);
            const response = await this.aptos.transaction.submit.simple({
                sender: this.account.accountAddress,
                data: data
            } as any);

            return {
                hash: response.hash,
                success: true
            };
        } catch (error) {
            return {
                hash: '',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    async addAMMLiquidity(params: AddAMMLiquidityParams): Promise<TransactionResponse> {
        try {
            const data = this.sdk.Position.addAMMLiquidity(params);
            const response = await this.aptos.transaction.submit.simple({
                sender: this.account.accountAddress,
                data: data
            } as any);

            return {
                hash: response.hash,
                success: true
            };
        } catch (error) {
            return {
                hash: '',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    async addCLMMLiquidity(params: AddCLMMLiquidityParams): Promise<TransactionResponse> {
        try {
            const data = this.sdk.Position.addCLMMLiquidity(params);
            const response = await this.aptos.transaction.submit.simple({
                sender: this.account.accountAddress,
                data: data
            } as any);

            return {
                hash: response.hash,
                success: true
            };
        } catch (error) {
            return {
                hash: '',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    async addStableLiquidity(params: AddStableLiquidityParams): Promise<TransactionResponse> {
        try {
            const data = this.sdk.Position.addStableLiquidity(params);
            const response = await this.aptos.transaction.submit.simple({
                sender: this.account.accountAddress,
                data: data
            } as any);

            return {
                hash: response.hash,
                success: true
            };
        } catch (error) {
            return {
                hash: '',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    // Remove Liquidity Operations
    async removeSingleAMMLiquidity(params: RemoveSingleAMMLiquidityParams): Promise<TransactionResponse> {
        try {
            const data = this.sdk.Position.removeSingleAMMLiquidity(params);
            const response = await this.aptos.transaction.submit.simple({
                sender: this.account.accountAddress,
                data: data
            } as any);

            return {
                hash: response.hash,
                success: true
            };
        } catch (error) {
            return {
                hash: '',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    async removeMultipleAMMLiquidity(params: RemoveMultipleAMMLiquidityParams): Promise<TransactionResponse> {
        try {
            const data = this.sdk.Position.removeMultipleAMMLiquidity(params);
            const response = await this.aptos.transaction.submit.simple({
                sender: this.account.accountAddress,
                data: data
            } as any);

            return {
                hash: response.hash,
                success: true
            };
        } catch (error) {
            return {
                hash: '',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    async removeSingleCLMMLiquidity(params: RemoveSingleCLMMLiquidityParams): Promise<TransactionResponse> {
        try {
            const data = this.sdk.Position.removeSingleCLMMLiquidity(params);
            const response = await this.aptos.transaction.submit.simple({
                sender: this.account.accountAddress,
                data: data
            } as any);

            return {
                hash: response.hash,
                success: true
            };
        } catch (error) {
            return {
                hash: '',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    async removeMultipleCLMMLiquidity(params: RemoveMultipleCLMMLiquidityParams): Promise<TransactionResponse> {
        try {
            const data = this.sdk.Position.removeMultipleCLMMLiquidity(params);
            const response = await this.aptos.transaction.submit.simple({
                sender: this.account.accountAddress,
                data: data
            } as any);

            return {
                hash: response.hash,
                success: true
            };
        } catch (error) {
            return {
                hash: '',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    async removeSingleStableLiquidity(params: RemoveSingleStableLiquidityParams): Promise<TransactionResponse> {
        try {
            const data = this.sdk.Position.removeSingleStableLiquidity(params);
            const response = await this.aptos.transaction.submit.simple({
                sender: this.account.accountAddress,
                data: data
            } as any);

            return {
                hash: response.hash,
                success: true
            };
        } catch (error) {
            return {
                hash: '',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    async removeMultipleStableLiquidity(params: RemoveMultipleStableLiquidityParams): Promise<TransactionResponse> {
        try {
            const data = this.sdk.Position.removeMultipleStableLiquidity(params);
            const response = await this.aptos.transaction.submit.simple({
                sender: this.account.accountAddress,
                data: data
            } as any);

            return {
                hash: response.hash,
                success: true
            };
        } catch (error) {
            return {
                hash: '',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    // Position Management
    async getPositions(params: {
        userAddr?: string;
        page?: number;
        size?: number;
    }): Promise<TappPosition[]> {
        const userAddr = params.userAddr || await this.getAddress();
        const positions = await this.sdk.Position.getPositions({
            ...params,
            userAddr
        });
        return positions;
    }

    async collectFee(params: CollectFeeParams): Promise<TransactionResponse> {
        try {
            const data = this.sdk.Position.collectFee(params);
            const response = await this.aptos.transaction.submit.simple({
                sender: this.account.accountAddress,
                data: data
            } as any);

            return {
                hash: response.hash,
                success: true
            };
        } catch (error) {
            return {
                hash: '',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
}

// Export the KeyFormatDetector for testing purposes
export { KeyFormatDetector };
