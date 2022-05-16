import { config } from "@ckb-lumos/lumos";

export const LINA_SCRIPTS: config.ScriptConfigs = {
  ...config.predefined.LINA.SCRIPTS,
  PW_LOCK: {
      CODE_HASH:
          "0xbf43c3602455798c1a61a596e0d95278864c552fafe231c063b3fabf97a8febc",
      HASH_TYPE: "type",
      TX_HASH:
          "0x1d60cb8f4666e039f418ea94730b1a8c5aa0bf2f7781474406387462924d15d4",
      INDEX: "0x0",
      DEP_TYPE: "code",
  },
  CHEQUE: {
      CODE_HASH:
          "0xe4d4ecc6e5f9a059bf2f7a82cca292083aebc0c421566a52484fe2ec51a9fb0c",
      HASH_TYPE: "type",
      TX_HASH:
          "0x04632cc459459cf5c9d384b43dee3e36f542a464bdd4127be7d6618ac6f8d268",
      INDEX: "0x0",
      DEP_TYPE: "dep_group",
  },
  OMNI_LOCK: {
      CODE_HASH:
          "0x9f3aeaf2fc439549cbc870c653374943af96a0658bd6b51be8d8983183e6f52f",
      HASH_TYPE: "type",
      TX_HASH:
          "0xaa8ab7e97ed6a268be5d7e26d63d115fa77230e51ae437fc532988dd0c3ce10a",
      INDEX: "0x1",
      DEP_TYPE: "code",
  },
}
export const LINA_CONFIG = {
  PREFIX: config.predefined.LINA.PREFIX,
  SCRIPTS: LINA_SCRIPTS
}

export const AGGRON4_SCRIPTS: config.ScriptConfigs = {
  ...config.predefined.AGGRON4.SCRIPTS,
  PW_LOCK: {
      CODE_HASH:
          "0x58c5f491aba6d61678b7cf7edf4910b1f5e00ec0cde2f42e0abb4fd9aff25a63",
      HASH_TYPE: "type",
      TX_HASH:
          "0x57a62003daeab9d54aa29b944fc3b451213a5ebdf2e232216a3cfed0dde61b38",
      INDEX: "0x0",
      DEP_TYPE: "code",
  },
  CHEQUE: {
      CODE_HASH:
          "0x60d5f39efce409c587cb9ea359cefdead650ca128f0bd9cb3855348f98c70d5b",
      HASH_TYPE: "type",
      TX_HASH:
          "0x7f96858be0a9d584b4a9ea190e0420835156a6010a5fde15ffcdc9d9c721ccab",
      INDEX: "0x0",
      DEP_TYPE: "dep_group",
  },
  OMNI_LOCK: {
      CODE_HASH:
          "0x79f90bb5e892d80dd213439eeab551120eb417678824f282b4ffb5f21bad2e1e",
      HASH_TYPE: "type",
      TX_HASH:
          "0x9154df4f7336402114d04495175b37390ce86a4906d2d4001cf02c3e6d97f39c",
      INDEX: "0x0",
      DEP_TYPE: "code",
  },
}

export const AGGRON4_CONFIG = {
  PREFIX: config.predefined.AGGRON4.PREFIX,
  SCRIPTS: AGGRON4_SCRIPTS
}
