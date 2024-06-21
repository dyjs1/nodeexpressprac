import dotenv from 'dotenv'

dotenv.config();

export const config = {
    jwtSecret : process.env.JWT_SECRET_KEY,
    jwtExpire : process.env.JWT_EXPIRE,
    dbHost : process.env.DB_HOST,
    dbUser : process.env.DB_USER,
    dbPassword : process.env.DB_PASSWORD,
    dbDatabase : process.env.DB_DATABASE,
}