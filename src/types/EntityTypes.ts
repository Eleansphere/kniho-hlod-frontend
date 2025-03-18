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
    author: string;
    owner_id: string;
}

export class Book implements BookAttributes {
    public id!: string;
    public title!: string;
    public author!: string;
    public owner_id!: string;
}

export interface LoanAttributes {
    id?: string;
    book_id: string;
    borrower: string;
    loan_date: Date;
    return_date: Date;
    owner_id: string;
}

export class Loan implements LoanAttributes {
    public id!: string;
    public book_id!: string;
    public borrower!: string;
    public loan_date!: Date;
    public return_date!: Date;
    public owner_id!: string;
}

export type Entity = User | Book | Loan;

export interface EntityWithIndex {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}
