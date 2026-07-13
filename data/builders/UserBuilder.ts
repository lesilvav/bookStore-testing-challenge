import { faker } from '@faker-js/faker';

export interface TestUser {
  userName: string;
  password: string;
}

/**
 * Builds unique test user credentials to avoid collisions on the shared
 * demo environment (see doc/bookStore_BusinessContext.md > Shared demo
 * environment causes data collisions).
 */
export class UserBuilder {
  private userName: string = `user_${faker.string.alphanumeric(10)}`;
  private password: string = `${faker.internet.password({ length: 10 })}1!`;

  withUserName(userName: string): this {
    this.userName = userName;
    return this;
  }

  withPassword(password: string): this {
    this.password = password;
    return this;
  }

  build(): TestUser {
    return { userName: this.userName, password: this.password };
  }
}
