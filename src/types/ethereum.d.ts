interface Window {
  ethereum?: {
    request(args: { method: string; params?: unknown[] }): Promise<unknown>;
    isMetaMask?: boolean;
    providers?: Array<{
      request(args: { method: string; params?: unknown[] }): Promise<unknown>;
      isMetaMask?: boolean;
    }>;
  };
}
