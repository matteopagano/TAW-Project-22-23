import { Schema, model, Document} from 'mongoose';

import * as User from '../Model/User';
import * as Cook from '../Model/Cook';
import * as Waiter from '../Model/Waiter';
import * as Cashier from '../Model/Cashier';
import * as Bartender from '../Model/Bartender';
import * as Restaurant from '../Model/Restaurant';

export function generateRandomString(n) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < n; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }



