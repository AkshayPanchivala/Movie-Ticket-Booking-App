import React, { createContext, useContext, useEffect, useState } from 'react';
import * as configService from '@/services/config.service';
import { AppConfig } from '@/services/config.service';

interface ConfigContextType {
  config: AppConfig | null;
  platformFee: number;
  currencySymbol: string;
  isLoading: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await configService.getConfig();
        setConfig(response.data);
      } catch (error) {
        console.error('Failed to fetch config:', error);
        // Set defaults if fetch fails
        setConfig({
          platform_fee: 50,
          currency: 'INR',
          currency_symbol: '₹',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const value = {
    config,
    platformFee: config?.platform_fee || 50,
    currencySymbol: config?.currency_symbol || '₹',
    isLoading,
  };

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
