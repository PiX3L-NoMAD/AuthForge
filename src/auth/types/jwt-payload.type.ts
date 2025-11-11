/**
 * Purpose: Shared type for the JWT payload attached to request.user.
 * Match this to JwtStrategy.validate().
 */
export type JwtPayload = {
    userId: string;
    email: string;
    username?: string;
    iat?: number;
    exp?: number;
}
