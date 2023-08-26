import { Component } from '@angular/core';
import { UsersRequestService } from 'src/app/common/api/http-requests/requests/users/users-request.service';
import { Waiter, WaitersResponse } from 'src/app/common/interfaces/api/users/users-api-interfaces';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-display-waiters-data',
  templateUrl: './display-waiters-data.component.html',
  styleUrls: ['./display-waiters-data.component.css']
})
export class DisplayWaitersDataComponent {
  waiters: Waiter[] = [];
  public chartWaiters: any;

  constructor(
    private urs : UsersRequestService,
  ){

  }
  ngOnInit(): void {
    this.get_waiters()
  }

  get_waiters(){
    this.urs.get_waiters().subscribe((data: WaitersResponse) => {
      this.waiters = data.waiters;
      this.createWaiterChart()
    });
  }

  createWaiterChart() {
    if (this.waiters.length === 0) {
        return;
    }

    const waiterData: { [key: string]: number } = {};

    this.waiters.forEach(waiter => {
        const waiterName = waiter.username;
        const ordersServedCount = waiter.ordersServed.length;

        waiterData[waiterName] = ordersServedCount;
    });

    const labels = Object.keys(waiterData);
    const data = Object.values(waiterData);

    const scaleOptions = {
        y: {
            beginAtZero: true
        }
    };

    const barOptions = {
        indexAxis: 'x' as const,
        categoryPercentage: 0.1
    };

    this.chartWaiters = new Chart("chartWaitersCanvas", {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Number of Orders Served',
                    data: data,
                    backgroundColor: 'orange'
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
