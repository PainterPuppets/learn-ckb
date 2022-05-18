import { config, helpers } from "@ckb-lumos/lumos";
import { LINA_CONFIG, AGGRON4_CONFIG } from "./config";
import { UPAuthResponse } from "./interface";
import { verifyUniPassSig, sha256 } from "./helper";

// compare hash(pubkey) with expected_ckb_addr
export async function verify(payload: {
  expectedCkbAddr: string; // from event of user -NFT-> Nervape
  username: string;
  sig: string;
  msg: string;
}): Promise<boolean> {
  try {
    const res = JSON.parse(payload.sig) as UPAuthResponse;
    const ret = await verifyUniPassSig(payload.username, payload.msg, res);

    if (!ret) {
      return false;
    }

    // verify addr
    if (payload.expectedCkbAddr.startsWith("ckb")) {
      config.initializeConfig(LINA_CONFIG);
    } else if (payload.expectedCkbAddr.startsWith("ckt")) {
      config.initializeConfig(AGGRON4_CONFIG);
    }

    const script = helpers.addressToScript(payload.expectedCkbAddr);

    const usernameHash = sha256(payload.username);

    return script.args === usernameHash.slice(0, 42);
  } catch {
    return false;
  }
}
