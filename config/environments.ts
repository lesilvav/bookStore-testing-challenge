import * as dotenv from 'dotenv';

dotenv.config();

interface EnvironmentConfig {
  baseUrl: string;
  apiBaseUrl: string;
  headed: boolean;
}

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env: EnvironmentConfig = {
  baseUrl: required('BASE_URL', process.env.BASE_URL ?? 'https://demoqa.com'),
  apiBaseUrl: required('API_BASE_URL', process.env.API_BASE_URL ?? 'https://demoqa.com'),
  headed: process.env.HEADED === 'true',
};
