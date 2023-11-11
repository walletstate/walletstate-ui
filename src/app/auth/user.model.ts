import { UserInfo } from './auth.model';

export class User {
  id: string;
  username: string;
  wallet?: string;
  expireAt: Date;

  constructor(id: string, username: string, expireAt: Date, wallet?: string) {
    this.id = id;
    this.username = username;
    this.wallet = wallet;
    this.expireAt = expireAt;
  }

  toJsonString(): string {
    return JSON.stringify(this);
  }

  isExpired(): boolean {
    return new Date().getTime() > this.expireAt.getTime();
  }

  notExpired(): boolean {
    return !this.isExpired();
  }

  expiresInMillis() {
    return this.notExpired() ? this.expireAt.getTime() - new Date().getTime() : 0;
  }

  withWallet(wallet: string, expireInSeconds: number) {
    return new User(this.id, this.username, new Date(new Date().getTime() + expireInSeconds * 1000), wallet);
  }

  static parse(jsonString: string): User {
    if (!jsonString) return null;

    const userData: { id: string; username: string; expireAt: string; wallet?: string } = JSON.parse(jsonString);
    if (!userData) return null;

    return new User(userData.id, userData.username, new Date(userData.expireAt), userData.wallet);
  }

  static build(userInfo: UserInfo, expireInSeconds: number): User {
    return new User(
      userInfo.id,
      userInfo.username,
      new Date(new Date().getTime() + expireInSeconds * 1000),
      userInfo.wallet
    );
  }
}
