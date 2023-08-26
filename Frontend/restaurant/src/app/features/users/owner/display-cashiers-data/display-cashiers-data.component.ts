import { Component } from '@angular/core';
import { UsersRequestService } from 'src/app/common/api/http-requests/requests/users/users-request.service';
import { Cashier, CashiersResponse } from 'src/app/common/interfaces/api/users/users-api-interfaces';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-display-cashiers-data',
  templateUrl: './display-cashiers-data.component.html',
  styleUrls: ['./display-cashiers-data.component.css']
})
export class DisplayCashiersDataComponent {
  cashiers: Cashier[] = [];
  public chartCashiers: any;

  constructor(
    private urs : UsersRequestService,
  ){

  }
  ngOnInit(): void {
    this.get_cashiers();
  }

  get_cashiers(){
    this.urs.get_cashiers().subscribe((data: CashiersResponse) => {
      this.cashiers = data.cashiers;
      this.createCashierChart()

    });
  }

  createCashierChart() {
    if (this.cashiers.length === 0) {
        return;
    }

    const cashierData: { [key: string]: number } = {};

    this.cashiers.forEach(cashier => {
        const cashierName = cashier.username;
        const recipesPrintedCount = cashier.recipesPrinted.length;

        cashierData[cashierName] = recipesPrintedCount;
    });

    const labels = Object.keys(cashierData);
    const data = Object.values(cashierData);

    const scaleOptions = {
        y: {
            beginAtZero: true
        }
    };

    const barOptions = {
        indexAxis: 'x' as const,
        categoryPercentage: 0.1
    };

    this.chartCashiers = new Chart("cashierChartCanvas", {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Number of Recipes Printed',
                    data: data,
                    backgroundColor: 'purple'
                }
            ]
        },
        options: {
            aspectRatio: 2.5,
            scales: scaleOptions,
            plugins: {
                legend: {
                    display: false
                },
            },
            ...barOptions
        }
    });
}

}
