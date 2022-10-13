import { config, Indexer, RPC, hd, commons } from "@ckb-lumos/lumos";
import { TransactionSkeleton, encodeToAddress, sealTransaction } from "@ckb-lumos/helpers";

const CKB_RPC_URL = "https://testnet.ckb.dev/rpc";
const CKB_INDEXER_URL = "https://testnet.ckb.dev/indexer";

const rpc = new RPC(CKB_RPC_URL);
const indexer = new Indexer(CKB_INDEXER_URL, CKB_RPC_URL);

config.initializeConfig(config.predefined.AGGRON4);

export const generateHDAccount = (privKey: string)=> {  
  const pubKey = hd.key.privateToPublic(privKey);
  const args = hd.key.publicKeyToBlake160(pubKey);
  const template = config.getConfig().SCRIPTS["SECP256K1_BLAKE160"]!;
  const lockScript = {
    codeHash: template.CODE_HASH,
    hashType: template.HASH_TYPE,
    args: args,
  };

  const address = encodeToAddress(lockScript);

  return {
    lockScript,
    address,
    pubKey,
    privKey,
  };
}

const bootstrap = async () => {
  const alice = generateHDAccount('0xd00c06bfd800d27397002dca6fb0993d5ba6399b4238b2f29ee9deb97593d2bc');
  const bob = generateHDAccount('0x63d86723e08f0f813a36ce6aa123bb2289d90680ae1e99d4de8cdb334553f24c');

  // console.log(bob)
  const token = commons.sudt.ownerForSudt(alice.address)

  let txSkeleton = TransactionSkeleton({ cellProvider: indexer });
  txSkeleton = await commons.sudt.transfer(
    txSkeleton,
    [alice.address],
    token,
    bob.address,
    BigInt(1000),
  );

  txSkeleton = await commons.common.transfer(
    txSkeleton,
    [bob.address],
    alice.address,
    BigInt(100 * 10 ** 8),
  );

  txSkeleton = await commons.common.payFeeByFeeRate(
    txSkeleton,
    [bob.address],
    1000,
  );

  txSkeleton = commons.common.prepareSigningEntries(txSkeleton);
  const signingEntries = txSkeleton.get("signingEntries");
  const aliceSig = hd.key.signRecoverable(signingEntries.get(0)?.message!, alice.privKey);
  const bobSig = hd.key.signRecoverable(signingEntries.get(1)?.message!, bob.privKey);

  const tx = sealTransaction(txSkeleton, [aliceSig, bobSig]);

  const hash = await rpc.sendTransaction(tx, "passthrough");
  console.log(hash)
}

bootstrap();