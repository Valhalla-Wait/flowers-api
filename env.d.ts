declare namespace NodeJS {
  type ProcessEnv = {
    APP_PORT: string;

    POSTGRES_DB: string;
    POSTGRES_HOST: string;
    POSTGRES_PORT: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;

    JWT_ACCESS_USER_TOKEN_SECRET: string;
    JWT_ACCESS_ADMIN_TOKEN_SECRET: string;

    JWT_ACCESS_USER_TOKEN_EXPIRE_TIME: string;
    JWT_ACCESS_ADMIN_TOKEN_EXPIRE_TIME: string;
  };
}
