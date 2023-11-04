"use strict";
// import jwt from 'jsonwebtoken';
// import jwksClient from 'jwks-rsa';
// import { AuthenticationError } from '@apollo/server';
// // ... other imports
// const client = jwksClient({
//   jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
// });
// function getKey(header, callback){
//   client.getSigningKey(header.kid, function(err, key) {
//     var signingKey = key.publicKey || key.rsaPublicKey;
//     callback(null, signingKey);
//   });
// }
// export const checkAuth = (context: { req: Request }) => {
//   const token = context.req.headers.authorization || '';
//   if (!token) {
//     throw new AuthenticationError('You must be logged in');
//   }
//   jwt.verify(token, getKey, {
//     algorithms: ['RS256'],
//     audience: process.env.AUTH0_AUDIENCE,
//     issuer: `https://${process.env.AUTH0_DOMAIN}/`
//   }, (err, decoded) => {
//     if (err) {
//       throw new AuthenticationError('You must be logged in');
//     }
//     context.req.user = decoded;
//   });
// };
