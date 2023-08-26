import { Component } from '@angular/core';
import { GroupsRequestService } from 'src/app/common/api/http-requests/requests/groups/groups-request.service';
import { RecipesRequestService } from 'src/app/common/api/http-requests/requests/recipes/recipes-request.service';
import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { SocketService } from 'src/app/socket.service';
import { Group } from '../display-customers/display-customers.component';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-visualize-customers-data',
  templateUrl: './visualize-customers-data.component.html',
  styleUrls: ['./visualize-customers-data.component.css']
})
export class VisualizeCustomersDataComponent {

  public groups: Group[] = [];
  public chartCustomers: any;

  constructor(private ups : UserPropertyService,
    private socketService: SocketService,
    private grs : GroupsRequestService,
  ){

    this.socketService.joinRestaurantRoom(this.ups.getRestaurant());
    const socket = socketService.getSocket()

    socket.fromEvent("fetchGroupsNeeded").subscribe((data) => {
      console.log("fetchGroupsNeeded")
      this.getGroups()
    });

  }

  ngOnInit(): void {

    this.getGroups();

  }

  getGroups() {
    this.grs.getGroups().subscribe((data) => {
      this.groups = data.groups;
      console.log(this.groups)

      const dataByHour = this.processDataByHour(this.groups);

      const hours = dataByHour.map(entry => entry.hour);
      const counts = dataByHour.map(entry => entry.count);
      console.log(hours)
      console.log(counts)

      this.createGroupChart(hours, counts);

    }, (error) => {
      console.error('Errore nel recupero dei gruppi:', error);
    });
  }

  createGroupChart(hours: string[], counts: number[]): void {

    const barOptions = {
      indexAxis: 'x' as const,
      categoryPercentage: 0.1
    };

    this.chartCustomers = new Chart("chartCustomersCanvas", {
      type: 'bar',
      data: {
        labels: hours,
        datasets: [
          {
            label: 'Number of Groups',
            data: counts,
            backgroundColor: 'blue'
          }
        ]
      },
      options: {
        scales: {
          x: {
            beginAtZero: true,
            max: Math.max(...counts) + 1
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Group Count by Hour'
          },
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => `Hour: ${hours[context.dataIndex]}, Count: ${counts[context.dataIndex]}`
            }
          }
        },
        ...barOptions
      }
    });
  }

  processDataByHour(groups: Group[]): { hour: string, count: number }[] {
    const dataByHour: { hour: string, count: number }[] = [];

    groups.forEach(group => {
      const startTimeParts = group.dateStart.split(':');
      const hour = startTimeParts[0];

      const existingEntry = dataByHour.find(entry => entry.hour === hour);

      if (existingEntry) {
        existingEntry.count++;
      } else {
        dataByHour.push({ hour, count: 1 });
      }
    });

    return dataByHour;
  }

}
