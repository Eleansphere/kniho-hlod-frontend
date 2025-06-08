export interface UserAttributes {
  id?: string;
  username: string;
  password: string;
  email: string;
  role: string;
}

export class User implements UserAttributes {
  public id!: string;
  public username!: string;
  public password!: string;
  public email!: string;
  public role!: string;
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
}

export class Book implements BookAttributes {
  public id!: string;
  public title!: string;
  public author!: string;
  public description!: string;
  public publicationYear!: number;
  public isAvailable!: boolean;
  public ownerId!: string;
}

export interface LoanAttributes {
  id?: string;
  borrower: string;
  loanDate: Date;
  returnDate?: Date;
  bookId: string;
  ownerId: string;
}

export class Loan implements LoanAttributes {
  public id!: string;
  public borrower!: string;
  public loanDate!: Date;
  public returnDate!: Date;
  public bookId!: string;
  public ownerId!: string;
}

export type Entity = User | Book | Loan;

export interface EntityWithIndex {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
