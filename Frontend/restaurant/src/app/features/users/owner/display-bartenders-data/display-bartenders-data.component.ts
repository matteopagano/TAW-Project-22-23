import { Component } from '@angular/core';
import { UsersRequestService } from 'src/app/common/api/http-requests/requests/users/users-request.service';
import { Bartender, BartendersResponse } from 'src/app/common/interfaces/api/users/users-api-interfaces';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-display-bartenders-data',
  templateUrl: './display-bartenders-data.component.html',
  styleUrls: ['./display-bartenders-data.component.css']
})
export class DisplayBartendersDataComponent {

  public chartBartenders: any;
  bartenders: Bartender[] = [];
  constructor(
    private urs : UsersRequestService,
  ){

  }
  ngOnInit(): void {
    this.get_bartenders();
  }

  get_bartenders() {
    this.urs.get_bartenders().subscribe((data: BartendersResponse) => {
      this.bartenders = data.bartenders;
      this.createBartenderChart();
      console.log(this.bartenders)
    });
  }

  createBartenderChart() {
    if (this.bartenders.length === 0) {
      return;
    }

    const bartenderData: { [key: string]: number } = {};

    this.bartenders.forEach(bartender => {
      const bartenderName = bartender.username;
      bartender.itemsPrepared.forEach(item => {
        const itemCount = item.count;

        if (!bartenderData[bartenderName]) {
          bartenderData[bartenderName] = 0;
        }

        bartenderData[bartenderName] += itemCount;
      });
    });

    const labels = Object.keys(bartenderData);
    const data = Object.values(bartenderData);

    const scaleOptions = {
      y: {
        beginAtZero: true
      }
    };
    const barOptions = {
      indexAxis: 'x' as const,
      categoryPercentage: 0.1
    };
    this.chartBartenders = new Chart("bartenderChartCanvas", {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Number of Items Prepared',
            data: data,
            backgroundColor: 'blue'
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
