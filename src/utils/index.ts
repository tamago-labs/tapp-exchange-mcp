// Utility functions for Tapp Exchange MCP server

export class TappUtils {
    /**
     * Format token amount with proper decimals
     */
    static formatTokenAmount(amount: number, decimals: number = 8): string {
        return (amount / Math.pow(10, decimals)).toFixed(decimals);
    }

    /**
     * Parse token amount to raw units
     */
    static parseTokenAmount(amount: number, decimals: number = 8): number {
        return Math.floor(amount * Math.pow(10, decimals));
    }

    /**
     * Calculate price impact for swaps
     */
    static calculatePriceImpact(
        amountIn: number,
        amountOut: number,
        expectedOut: number
    ): number {
        if (expectedOut === 0) return 0;
        return Math.abs((expectedOut - amountOut) / expectedOut) * 100;
    }

    /**
     * Validate pool type
     */
    static isValidPoolType(type: string): boolean {
        return ['AMM', 'CLMM', 'STABLE'].includes(type.toUpperCase());
    }

    /**
     * Validate Aptos address format
     */
    static isValidAptosAddress(address: string): boolean {
        // Basic validation for Aptos address format
        return /^0x[a-fA-F0-9]{1,64}$/.test(address);
    }

    /**
     * Format pool display name
     */
    static formatPoolName(tokenA: string, tokenB: string, fee: number): string {
        const symbolA = TappUtils.extractTokenSymbol(tokenA);
        const symbolB = TappUtils.extractTokenSymbol(tokenB);
        const feePercent = (fee / 10000).toFixed(2);
        return `${symbolA}/${symbolB} (${feePercent}%)`;
    }

    /**
     * Extract token symbol from address
     */
    static extractTokenSymbol(tokenAddress: string): string {
        // Try to extract symbol from common token patterns
        if (tokenAddress.includes('::aptos_coin::AptosCoin')) {
            return 'APT';
        }
        if (tokenAddress.includes('USDC')) {
            return 'USDC';
        }
        if (tokenAddress.includes('USDT')) {
            return 'USDT';
        }
        
        // Fallback to showing last part of address
        const parts = tokenAddress.split('::');
        return parts[parts.length - 1] || tokenAddress.slice(-8);
    }

    /**
     * Validate transaction parameters
     */
    static validateTransactionParams(params: any): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        // Check for required fields
        if (!params.poolId || !TappUtils.isValidAptosAddress(params.poolId)) {
            errors.push('Invalid pool ID format');
        }

        // Check for positive amounts
        const amountFields = ['amount', 'amountIn', 'amountOut', 'amount0', 'amount1', 'amountA', 'amountB'];
        amountFields.forEach(field => {
            if (params[field] !== undefined && (params[field] < 0 || !Number.isFinite(params[field]))) {
                errors.push(`Invalid ${field}: must be a positive number`);
            }
        });

        // Check arrays
        if (params.amounts && Array.isArray(params.amounts)) {
            params.amounts.forEach((amount: any, index: number) => {
                if (amount < 0 || !Number.isFinite(amount)) {
                    errors.push(`Invalid amount at index ${index}: must be a positive number`);
                }
            });
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Calculate minimum received amount with slippage tolerance
     */
    static calculateMinReceived(amount: number, slippageTolerance: number = 0.5): number {
        return Math.floor(amount * (1 - slippageTolerance / 100));
    }

    /**
     * Format error message for user-friendly display
     */
    static formatErrorMessage(error: any): string {
        if (typeof error === 'string') {
            return error;
        }
        
        if (error instanceof Error) {
            // Handle common error types
            if (error.message.includes('insufficient')) {
                return 'Insufficient balance for this transaction';
            }
            if (error.message.includes('slippage')) {
                return 'Transaction failed due to price slippage. Try increasing slippage tolerance.';
            }
            if (error.message.includes('expired')) {
                return 'Transaction expired. Please try again.';
            }
            return error.message;
        }

        return 'An unknown error occurred';
    }

    /**
     * Sleep utility for delays
     */
    static async sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Retry function with exponential backoff
     */
    static async retry<T>(
        fn: () => Promise<T>,
        maxRetries: number = 3,
        baseDelay: number = 1000
    ): Promise<T> {
        let lastError: any;
        
        for (let i = 0; i <= maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                
                if (i === maxRetries) {
                    throw lastError;
                }
                
                const delay = baseDelay * Math.pow(2, i);
                await TappUtils.sleep(delay);
            }
        }
        
        throw lastError;
    }
}
