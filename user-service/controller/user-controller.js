import { SignJWT, jwtVerify, generateKeyPair, } from 'jose'
import { unauthorized, unauthenticated, ok } from './response.js'
//import 'dotenv/config'

const { publicKey, privateKey } = await generateKeyPair('ES256')

const adminAccounts = {
  'admin': 'adminPW',
}
const userAccounts = {
  'user': 'userPW',
}



async function checkJWT(req) {
  try {
    if (!req.headers.cookie) { return false; }
  } catch (error) {
    console.log(error)
    return false;
    // headers don't exist
  }
  let cookies = req.headers.cookie.split("; ").filter(x => x.startsWith("JWT="))
  if (cookies.length != 1) { return false }
  let jwt_received = cookies[0].split("=")[1]
  try {
    const { payload, protectedHeader } = await jwtVerify(jwt_received, publicKey, { issuer: 'user-service' })
    return payload
  } catch (err) {
    console.log("invalid jwt")
    return false
  }
}

export async function login(req, res) {
  //password salt and hash here
  let { username, password } = req.body;

  let isAdmin = false;

  if (userAccounts[username] != null) {
    isAdmin = false
  }
  else if (adminAccounts[username] != null) {
    isAdmin = true
  }
  else {
    return res.status(401).json({ message: `user ${username} does not exist!` });
  }

  let jwt_cookie = await new SignJWT({ 'isAdmin': isAdmin })
    .setProtectedHeader({ alg: 'ES256' })
    .setIssuedAt()
    .setIssuer('user-service')
    .setExpirationTime('2h')
    .sign(privateKey)
  res.cookie('JWT', jwt_cookie,)// { httpOnly: true, secure: process.env.ENV == "PROD" });
  return res.status(201).json({ message: `Successful login as ${username} !` });
}

export async function logout(req, res) {
  res.cookie('JWT', "")
  return res.status(201).json({ message: `Successful logout!` });
}

export async function adminFunc(req, res) {
  let payload = await checkJWT(req);
  if (payload === false) { return unauthenticated(res) }
  if (!payload.isAdmin) { return unauthorized(res) }
  return ok(res)
}

export async function allFunc(req, res) {
  let payload = await checkJWT(req);
  console.log(payload)
  if (payload === false) {
    console.log("hi")
    return unauthenticated(res)
  }
  return ok(res)
}