import NodeRSA from 'node-rsa';
import { UPAuthResponse } from './interface';

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
  msg: string,
  authResp: UPAuthResponse,
): Promise<boolean> {
  const { keyType, pubkey, sig } = authResp
  if (keyType !== 'RsaPubkey') {
    throw new Error(`UnSupported keyType ${keyType}`)
  }

  const key = getPubkeyFromUPKey(pubkey)
  console.log(key.exportKey())

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