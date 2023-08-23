
export interface Cashier {
  _id: string;
  recipesPrinted: string[];
  username: string;
  email: string;
  role: string;
  idRestaurant: string;
  salt: string;
  digest: string;
  __v: number;
}

export interface CashiersResponse {
  error: boolean;
  errormessage: string;
  cashiers: Cashier[];
}

export interface Waiter {
  _id: string;
  ordersAwaiting: string[];
  ordersServed: string[];
  username: string;
  email: string;
  role: string;
  idRestaurant: string;
  salt: string;
  digest: string;
  __v: number;
}

export interface WaitersResponse {
  error: boolean;
  errormessage: string;
  waiters: Waiter[];
}

export interface Cooker {
  _id: string;
  username: string;
  email: string;
  role: string;
  idRestaurant: string;
}

export interface Bartender {
  _id: string;
  username: string;
  email: string;
  role: string;
  idRestaurant: string;
}


export interface CookersResponse {
  error: boolean;
  errormessage: string;
  cooks: Cooker[];
}

export interface BartendersResponse {
  error: boolean;
  errormessage: string;
  bartenders: Bartender[];
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

export interface UserCreateResponse {
  error: boolean;
  errormessage: string;
  idNewWaiter: string;
  usernameNewWaiter: string;
  emailNewWaiter: string;
  passwordToChange: string;
}
