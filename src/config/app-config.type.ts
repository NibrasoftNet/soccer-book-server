export type AppConfig = {
  nodeEnv: string;
  name: string;
  workingDirectory: string;
  frontendDomain?: string;
  backendDomain: string;
  port: number;
  host: string;
  apiPrefix: string;
  fallbackLanguage: string;
  headerLanguage: string;
};
