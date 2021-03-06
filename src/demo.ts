import { verify } from "./verify";
import { pubkeyToLockArgs } from './helper';
import { createHash } from 'crypto';

export function sha256(message: string) {
  return `0x${createHash('SHA256').update(Buffer.from(message)).digest('hex')}`;
}

const expectedCkbAddr = "ckt1qqlpadldfqym94sx2zlfdfq2h776lvlmjs4hkdlvwuy7vn3v6zncxq0wps007w2j825lu53hac6r4cztnumdnkgtyedjc";
const sig = `{"keyType":"RsaPubkey","pubkey":"0x0001000190433fc51c84f2528699f965f737e5f114f20dd71a2e549f4baba61d1b1258df43e62c2b670044ddc1fd8745c957a2fe895cd55a700430b1edd1074ecc37be67b0a39557ef0a7106e6aabca099a366c8b96f4461524fb144df89cb6d17b0d1e1c31bd0ed4229529b49dc689dba4c56a0fd6911ecf3cf580296756c0fb979989893905db6ac5152432a273142ab85df80a43c330a06501f952ae69158912f09f055445ebe1a88b656250382a148bcf6da01341cd67730f98ae5779a70c2259123a150da9b9dcce6de57f1a8e653f772713e9f59063e20c28ab3d2a7b247c11e71bf07878657274a151ba38f8e3f5c62ed6a077c907eea131b2e9a54a32fae9f9f","sig":"0x60ddd398f947d098f97349cdf2615f794772700d443ed7863798b398f35a2be5ace5eebc51135f3c252c3114d67ddc33961195380628559fed84d22fbfea99233d9b4497011d67e9bbf696ee0930422b582e1f6e527ec1922b7b5860a8db4c514292c1f30b3040ad04b9c23cda21591e7e5a34f51c9a5f43f867b075c10ec5043e94690ce998010978f2862b3dd0c707c33798beb35508d71b5e60164adb715ef91cf32d8f301940a13fc634581a97b6f173b9a80c755215d5c5fd4354e3f3ddd32efaeedfa3cd920b52df41edd54df909f8314c73b34e28d7d47d254f95b6566a837d848f14d10f193b2cdb8ad358fbe650967c7f33a7a24c793185bc97c82c"}`;
const msg = `{"abc": "233", "cde": "2323"}`;
const username = 'painterpuppets';

verify({
  expectedCkbAddr,
  username,
  sig,
  msg,
}).then((result) => {
  console.log('verify result: ', result)
});

