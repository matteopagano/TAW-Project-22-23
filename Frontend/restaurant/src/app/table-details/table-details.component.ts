import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantHttpService } from '../restaurant-http.service';

@Component({
  selector: 'app-table-details',
  templateUrl: './table-details.component.html',
  styleUrls: ['./table-details.component.css']
})
export class TableDetailsComponent {
  restaurantId : any;
  tableId: any;
  groupDetails: any;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantHttpService // Inietta il servizio
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.tableId = params['id']; // Assicurati che 'id' corrisponda al nome del parametro nella route
      console.log('Table ID:', this.tableId); // Aggiungi questa riga per il debug
      // Chiama la funzione nel servizio per ottenere i dettagli del gruppo associato al tavolo
      this.restaurantService.getTableGroupDetails(this.tableId)
        .subscribe((data) => {
          // Ricevi i dettagli del gruppo dalla risposta HTTP
          this.groupDetails = data.group;
        });
    });
  }
}


