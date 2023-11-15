import NextAuth from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID,
      clientSecret: process.env.KEYCLOAK_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
      authorization: { params: { scope: "openid" } },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken
      session.user.id = token.id
      session.user.groups = token.groups
      return session
    },
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        token.id = profile.id
        token.groups = profile.groups ? profile.groups : [];
        token.groups.push("default");
      }
      return token
    }
  }
}

export default NextAuth(authOptions)
