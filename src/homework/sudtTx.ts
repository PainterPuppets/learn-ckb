import { config, Indexer, RPC, hd, commons } from "@ckb-lumos/lumos";
import { TransactionSkeleton, encodeToAddress, sealTransaction } from "@ckb-lumos/helpers";

const CKB_RPC_URL = "https://testnet.ckb.dev/rpc";
const CKB_INDEXER_URL = "https://testnet.ckb.dev/indexer";

const rpc = new RPC(CKB_RPC_URL);
const indexer = new Indexer(CKB_INDEXER_URL, CKB_RPC_URL);

const CONFIG = config.createConfig({
  PREFIX: "ckt",
  SCRIPTS: {
    ...config.predefined.AGGRON4.SCRIPTS,
    ANYONE_CAN_PAY: {
      CODE_HASH: "0x3419a1c09eb2567f6552ee7a8ecffd64155cffe0f1796e6e61ec088d740c1356",
      HASH_TYPE: "type",
      TX_HASH: "0xec26b0f85ed839ece5f11c4c4e837ec359f5adc4420410f6453b1f6b60fb96a6",
      INDEX: "0x0",
      DEP_TYPE: "code",
    }
  },
});

config.initializeConfig(CONFIG);

export const generateSECP256K1Account = (privKey: string) => {
  const pubKey = hd.key.privateToPublic(privKey);
  const args = hd.key.publicKeyToBlake160(pubKey);
  const template = CONFIG.SCRIPTS["SECP256K1_BLAKE160"]!;
  const lockScript = {
    codeHash: template.CODE_HASH,
    hashType: template.HASH_TYPE,
    args: args,
  };
  const address = encodeToAddress(lockScript, { config: CONFIG });
  return {
    lockScript,
    address,
    pubKey,
    privKey,
  };
};

export const issueToken = async (fromAddress: string, privKey: string) => {
  let txSkeleton = TransactionSkeleton({ cellProvider: indexer });

  txSkeleton = await commons.sudt.issueToken(
    txSkeleton,
    fromAddress,
    BigInt(10000),
  )

  txSkeleton = await commons.secp256k1Blake160.payFee(
    txSkeleton,
    fromAddress,
    BigInt(1 * 10 ** 8),
  );

  txSkeleton = commons.common.prepareSigningEntries(txSkeleton);
  const message = txSkeleton.get("signingEntries").get(0)?.message;
  const Sig = hd.key.signRecoverable(message!, privKey);
  const tx = sealTransaction(txSkeleton, [Sig]);

  const hash = await rpc.sendTransaction(tx, "passthrough");
  return hash
}

export const transferToken = async (fromAddress: string, toAddress: string, privKey: string) => {
  const token = commons.sudt.ownerForSudt(fromAddress)

  let txSkeleton = TransactionSkeleton({ cellProvider: indexer });
  txSkeleton = await commons.sudt.transfer(
    txSkeleton,
    [fromAddress],
    token,
    toAddress,
    BigInt(1000),
  );

  txSkeleton = await commons.secp256k1Blake160.payFee(
    txSkeleton,
    fromAddress,
    BigInt(1 * 10 ** 8),
  );

  txSkeleton = commons.common.prepareSigningEntries(txSkeleton);
  const message = txSkeleton.get("signingEntries").get(0)?.message;
  const Sig = hd.key.signRecoverable(message!, privKey);
  const tx = sealTransaction(txSkeleton, [Sig]);

  const hash = await rpc.sendTransaction(tx, "passthrough");
  return hash
}

const bootstrap = async () => {
  const alice = generateSECP256K1Account('0xd00c06bfd800d27397002dca6fb0993d5ba6399b4238b2f29ee9deb97593d2bc');
  const bob = generateSECP256K1Account('0x63d86723e08f0f813a36ce6aa123bb2289d90680ae1e99d4de8cdb334553f24d');

  const issueTxHash = await issueToken(bob.address, bob.privKey)

  console.log('issueTxHash is', issueTxHash)

  // Wait a minute.

  const transferTxHash = await transferToken(alice.address, bob.address, alice.privKey);

  console.log('transferTxHash is', transferTxHash)
}

bootstrap();