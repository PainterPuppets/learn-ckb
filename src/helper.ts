import NodeRSA from 'node-rsa';
import { UPAuthResponse } from './interface';
import { utils, HexString } from '@ckb-lumos/lumos';
import axios from 'axios'
import { createHash } from 'crypto'
const AGGREGATOR_URL = process.env.AGGREGATOR_URL || 'https://t.aggregator.unipass.id/dev/'

interface RSAPubkey {
  e: number
  n: string
}

interface Pubkey {
  secp256k1?: string
  rsa_pubkey?: RSAPubkey
}

interface UserInfo {
  username: string
  local_keys: Pubkey[]
}

export function sha256(message: string) {
  return `0x${createHash('SHA256').update(Buffer.from(message)).digest('hex')}`;
}

export function getPubkeyFromUPKey(upPubkey: string) {
  const key = new NodeRSA()

  const pubkeyBuffer = Buffer.from(upPubkey.replace('0x', ''), 'hex')
  const e = pubkeyBuffer.slice(0, 4).readUInt32BE(0)
  const n = pubkeyBuffer.slice(4)

  key.importKey(
    {
      e,
      n,
    },
    'components-public',
  )
  key.setOptions({ signingScheme: 'pkcs1-sha256' })

  return key
}

export async function verifyUniPassSig(
  username: string,
  msg: string,
  authResp: UPAuthResponse,
): Promise<boolean> {
  const { keyType, pubkey, sig } = authResp


  const isPubkeyOnChain = await checkPubkeyOnChain(username, keyType, pubkey)
  if (!isPubkeyOnChain) {
    throw new Error(`pubkey not valid on chain`)
  }

  if (keyType !== 'RsaPubkey') {
    throw new Error(`UnSupported keyType ${keyType}`)
  }

  const key = getPubkeyFromUPKey(pubkey)
  // console.log(key.exportKey())

  // prefix message for plain msg
  let messageBuffer = Buffer.from(msg)
  const prefix = Buffer.from(
    `\u0018UniPass Signed Message:\n${messageBuffer.length.toString()}`,
    'utf-8',
  )
  messageBuffer = Buffer.concat([prefix, messageBuffer])


  const ret = key.verify(
    messageBuffer,
    Buffer.from(sig.replace('0x', ''), 'hex'),
  )

  return ret
}

async function checkPubkeyOnChain(
  username: string,
  keyType: string,
  pubkey: string,
): Promise<boolean> {
  const { local_keys } = await fetchUserInfoOnChain(username)

  console.log('local_keys', local_keys)

  const mapLocalPubkey = (x: Pubkey) => {
    let keyType = ''
    let keyValue = ''
    if (x.rsa_pubkey) {
      keyType = 'RsaPubkey'
      const { e, n } = x.rsa_pubkey
      const nA = Buffer.from(n.replace('0x', ''), 'hex')
      const eA = Buffer.alloc(4)
      eA.writeUInt32BE(e, 0)
      keyValue = '0x' + Buffer.concat([eA, nA]).toString('hex')
    } else if (x.secp256k1) {
      keyType = 'Secp256k1Pubkey'
      keyValue = x.secp256k1
    }
    return { keyType, keyValue }
  }

  const keyExist = local_keys
    .map(mapLocalPubkey)
    .find((x) => x.keyType === keyType && x.keyValue === pubkey)

  return !!keyExist
}

async function fetchUserInfoOnChain(username: string) {
  const usernameHash = sha256(username)

  const req = {
    id: 2,
    jsonrpc: '2.0',
    method: 'get_up_pending_user_info',
    params: [usernameHash],
  }

  const resp = await axios.post(AGGREGATOR_URL, req)
  if (resp.status !== 200) {
    throw new Error(`aggregator request failed with HTTP code ${resp.status}`)
  }
  if (resp.data.error !== undefined) {
    throw new Error(
      `aggregator request rpc failed with error: ${JSON.stringify(
        resp.data.error,
      )}`,
    )
  }
  return resp.data.result[0] as UserInfo
}



export function pubkeyToLockArgs(pubkey: string): string {
  return utils.ckbHash(hexToBytes(pubkey).buffer).serializeJson().slice(0, 42);
}

export function hexToBytes(hex: HexString): Uint8Array {
  hex = hex.startsWith('0x') ? hex.slice(2) : hex;
  const match = hex.match(/.{1,2}/g);
  if (!match) throw new Error(`cannot parse ${hex} into Uint8Array`);

  return Uint8Array.from(match.map((byte) => parseInt(byte, 16)));
}
