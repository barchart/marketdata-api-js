declare module "@barchart/marketdata-api-js" {
    type EventType = 'events' | 'marketDepth' | 'marketUpdate' | 'cumulativeVolume' | 'timestamp' | string;

    type MarketDataCallback = (data: any) => void;

    class ConnectionBase {
        connect(server: string, username: string, password: string): void;
        disconnect(): void;
        pause(): void;
        resume(): void;
        on(eventType: EventType, callback: MarketDataCallback, symbol?: string): void;
        off(eventType: EventType, callback: MarketDataCallback, symbol?: string): void;
        getActiveSymbolCount(): any;
        getPollingFrequency(): number | null;
        setPollingFrequency(pollingFrequency: number | null): void;
        getMarketState(): MarketState;
        getServer(): string | null;
        getPassword(): string | null;
        getUsername(): string | null;
        toString(): string;
    }

    class Connection extends ConnectionBase {
        toString(): string;
    }

    class MarketState {
        constructor(handleProfileRequest?: (symbol: string) => void);
        getBook(symbol: string): any;
        getCumulativeVolume(symbol: string, callback: Function): Promise<any>;
        getProfile(symbol: string, callback: Function): Promise<any>;
        getQuote(symbol: string): any;
        getTimestamp(): Date;
    }

    const Util: any;
    const util: any;

    const MessageParser: any;
    const messageParser: any;

    const version: string;

    export {
        Connection,
        MarketState,
        Util,
        util,
        MessageParser,
        messageParser,
        version
    }
}