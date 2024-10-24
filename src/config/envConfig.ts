class EnvConfig {
  get app() {
    return {
      port: Number(process.env.APP_PORT) || 8888,
      passwordSalt: process.env.PASSWORD_SECRET,
      code: process.env.CODE,
    };
  }

  get jwt() {
    return {
      secret: process.env.JWT_SECRET,
      refreshExpires: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
      accessExpires: process.env.JWT_TOKEN_EXPIRES_IN,
    };
  }

  get db() {
    return {
      database: process.env.POSTGRES_DB,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.POSTGRES_HOST || 'localhost',
      port: Number(process.env.POSTGRES_PORT) || 5432,
    };
  }
}

export default new EnvConfig();
