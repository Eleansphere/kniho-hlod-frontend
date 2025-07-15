export interface UserAttributes {
  id?: string;
  username: string;
  password: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export class User implements UserAttributes {
  public id!: string;
  public username!: string;
  public password!: string;
  public email!: string;
  public role!: string;
  public createdAt!: string;
  public updatedAt!: string;
}

export interface LoggedUser {
  user: User;
  token: string;
}

export interface BookAttributes {
  id?: string;
  title: string;
  author?: string;
  description?: string;
  publicationYear?: number;
  isAvailable: boolean;
  ownerId: string;
  createdAt?: string;
  updatedAt?: string;
}

export class Book implements BookAttributes {
  public id!: string;
  public title!: string;
  public author!: string;
  public description!: string;
  public publicationYear!: number;
  public isAvailable!: boolean;
  public ownerId!: string;
  public createdAt!: string;
  public updatedAt!: string;
}

export interface LoanAttributes {
  id?: string;
  borrower: string;
  loanDate: Date;
  returnDate?: Date;
  bookId: string;
  ownerId: string;
  createdAt?: string;
  updatedAt?: string;
}

export class Loan implements LoanAttributes {
  public id!: string;
  public borrower!: string;
  public loanDate!: Date;
  public returnDate!: Date;
  public bookId!: string;
  public ownerId!: string;
  public createdAt!: string;
  public updatedAt!: string;
}

export type Entity = User | Book | Loan;

export interface EntityWithIndex {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
