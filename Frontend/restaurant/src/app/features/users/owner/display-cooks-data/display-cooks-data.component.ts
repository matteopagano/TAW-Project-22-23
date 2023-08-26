import { Component } from '@angular/core';
import { UsersRequestService } from 'src/app/common/api/http-requests/requests/users/users-request.service';
import { Cooker, CookersResponse } from 'src/app/common/interfaces/api/users/users-api-interfaces';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-display-cooks-data',
  templateUrl: './display-cooks-data.component.html',
  styleUrls: ['./display-cooks-data.component.css']
})
export class DisplayCooksDataComponent {

  cooks: Cooker[] = [];
  public chartCooks: any;

  constructor(
    private urs : UsersRequestService,
  ){

  }
  ngOnInit(): void {
    this.get_cooks();
  }

  get_cooks() {
    this.urs.get_cooks().subscribe((data: CookersResponse) => {
      this.cooks = data.cooks;
      this.createCookerChart();
      console.log(this.cooks)
    });
  }

  createCookerChart() {
    if (this.cooks.length === 0) {
      return;
    }

    const cookerData: { [key: string]: number } = {};

    this.cooks.forEach(cook => {
      const cookerName = cook.username;
      cook.itemsPrepared.forEach(item => {
        const itemCount = item.count;

        if (!cookerData[cookerName]) {
          cookerData[cookerName] = 0;
        }

        cookerData[cookerName] += itemCount;
      });
    });

    const labels = Object.keys(cookerData);
    const data = Object.values(cookerData);

    const scaleOptions = {
      y: {
        beginAtZero: true
      }
    };

    const barOptions = {
      indexAxis: 'x' as const,
      categoryPercentage: 0.1
    };

    this.chartCooks = new Chart("cookerChartCanvas", {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Number of Items Prepared',
            data: data,
            backgroundColor: 'limegreen'
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
