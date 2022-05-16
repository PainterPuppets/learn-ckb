import { config, helpers } from "@ckb-lumos/lumos";
import { LINA_CONFIG, AGGRON4_CONFIG } from './config';
import { UPAuthResponse } from './interface';
import { verifyUniPassSig } from './helper';


// compare hash(pubkey) with expected_ckb_addr 
export function verify(payload: { 
  expectedCkbAddr: string; // from event of user -NFT-> Nervape
  sig: string; 
  msg: string;
}): boolean {

  const res = JSON.parse(payload.sig) as UPAuthResponse
  // verify msg
  try {
    verifyUniPassSig(
      payload.msg,
      res,
    )
  } catch {
    return false;
  }

  console.log('verifyUniPassSig success')

  // verify addr
  if (payload.expectedCkbAddr.startsWith("ckb")) {
    config.initializeConfig(LINA_CONFIG);
  } else if (payload.expectedCkbAddr.startsWith("ckt")) {
    config.initializeConfig(AGGRON4_CONFIG);
  }
  const script = helpers.addressToScript(payload.expectedCkbAddr)
  console.log(script)

  // const pubKey = getPubkeyFromUPKey(res.pubkey).exportKey();

  // const expectedArgs = hd.key.publicKeyToBlake160(pubKey);

  // console.log(script.args);
  // console.log(expectedArgs);

  return true;
};

