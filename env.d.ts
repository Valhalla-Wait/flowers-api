declare namespace NodeJS {
  type ProcessEnv = {
    APP_PORT: number;
    NODE_ENV: 'development' | 'production';

    POSTGRES_DB: string;
    POSTGRES_HOST: string;
    POSTGRES_PORT: number;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;

    CODE: string;

    JWT_SECRET: string;
    PASSWORD_SECRET: string;

    JWT_TOKEN_EXPIRES_IN: string;
    JWT_REFRESH_TOKEN_EXPIRES_IN: string;

    // NOTE
    // Базовая env при запуске через пакетный менеджер
    npm_package_version: string;
  };
}
