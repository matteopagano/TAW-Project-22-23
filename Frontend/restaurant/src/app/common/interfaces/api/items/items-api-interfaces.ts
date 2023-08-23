

export interface MenuItem {
  _id: string;
  itemName: string;
  itemType: string;
  price: number;
  preparationTime: number;
  idRestaurant: string;
  __v: number;
}

export interface MenuItemsResponse {
  error: boolean;
  errormessage: string;
  tables: MenuItem[];
}
