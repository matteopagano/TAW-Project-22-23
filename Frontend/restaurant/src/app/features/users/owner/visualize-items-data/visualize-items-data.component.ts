import { Component } from '@angular/core';
import { ItemsRequestService } from 'src/app/common/api/http-requests/requests/items/items-request.service';
import { MenuItem } from 'src/app/common/interfaces/api/items/items-api-interfaces';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-visualize-items-data',
  templateUrl: './visualize-items-data.component.html',
  styleUrls: ['./visualize-items-data.component.css']
})
export class VisualizeItemsDataComponent {
  items : MenuItem [] = []
  public chartItems: any;
  constructor(
    private irs : ItemsRequestService
  ){
    this.fetchItems()
  }

  fetchItems() {
    this.irs.getItems().subscribe(
      response => {
        this.items = response.tables;
        console.log(this.items)
        this.createItemsChart()
      },
      error => {
        console.error('Errore durante il recupero degli item:', error);
      }
    );
  }

  ngOnInit(): void {
    this.fetchItems();
  }

  createItemsChart() {
    if (this.items.length === 0) {
      return;
    }
    const labels = this.items.map(item => item.itemName);
    const data = this.items.map(item => item.countServered);

    this.chartItems = new Chart("itemsChartCanvas", {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Count Servered',
            data: data,
            backgroundColor: [
              'blue',
              'green',
              'red',
              'purple',
              'orange',
              'pink',
              'teal',
            ]
          }
        ]
      },
      options: {
        aspectRatio: 1.5,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}

