export interface UPAuthResponse {
  keyType: 'Secp256k1Pubkey' | 'Secp256r1Pubkey' | 'RsaPubkey';
  pubkey: string;
  sig: string;
}
