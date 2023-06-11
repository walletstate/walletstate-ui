export interface Wallet {
  id: string;
  name: string;
}

export interface CreateWallet {
  name: string;
}

export interface JoinWallet {
  inviteCode: string;
}

export interface WalletInvite {
  id: string;
  wallet: string;
  inviteCode: string;
  createdBy: string;
  validTo: string;
}
