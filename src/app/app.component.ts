import { Component, OnInit } from "@angular/core";
import { GetDataService } from "./get-data.service";
import { AstMemoryEfficientTransformer } from "@angular/compiler";
import { Chart } from "chart.js";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  data: any;
  list: any;
  page = 1;
  catgory = "animals";
  disbledNext = false;
  BarChart: any;
  constructor(private getDataService: GetDataService) {}
  ngOnInit() {
    this.getDataService.get(this.catgory, null, null).subscribe(response => {
      console.log("response", response);
      this.data = response;
      this.list = response["data"].children;
      this.handleGraghData(this.list);
    });
  }
  getFormatHour(hour) {
    return hour.toString().length > 1 ? `${hour}:00` : `0${hour}:00`;
  }
  handleGraghData(list) {
    const graghData = list.map(item => {
      item = {
        hour: this.getFormatHour(
          this.convertToDate(item.data.created_utc).getHours()
        ),
        value: item.data.ups
      };
      return item;
    });
    const canvas = document.createElement("canvas");
    canvas.id = "barChart";
    document.getElementById("canvas-warpper").appendChild(canvas);
    document.getElementById("barChart").replaceWith(canvas);
    // Bar chart:
    this.BarChart = new Chart("barChart", {
      type: "bar",
      data: {
        labels: graghData.map(item => {
          return item.hour;
        }),
        datasets: [
          {
            label: "upvotes by post time.",
            data: graghData.map(item => {
              return item.value;
            }),
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",

              "rgba(166, 47, 216, 0.2)",
              "rgba(31, 94, 183, 0.2)",
              "rgba(1, 183, 41, 0.2)",
              "rgba(232, 82, 27, 0.2)"
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",

              "rgba(166, 47, 216,1)",
              "rgba(31, 94, 183, 1)",
              "rgba(1, 183, 41, 1)",
              "rgba(232, 82, 27, 1)"
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        title: {
          text: "Bar Chart",
          display: true
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
    this.BarChart.update();
  }
  convertToDate(date) {
    return new Date(date);
  }
  goBack() {
    const paylod = {
      kind: this.list[0].kind,
      id: this.list[0].data.id
    };
    this.getDataService
      .get(this.catgory, "before", paylod)
      .subscribe(response => {
        this.page = this.page - 1;
        this.data = response["data"];
        this.list = response["data"].children;
        this.handleGraghData(this.list);
        this.disbledNext = false;
      });
  }

  nextPage() {
    const paylod = {
      kind: this.list[this.list.length - 1].kind,
      id: this.list[this.list.length - 1].data.id
    };

    this.getDataService
      .get(this.catgory, "after", paylod)
      .subscribe(response => {
        this.page = this.page + 1;
        console.log("response", response);
        this.data = response["data"];
        this.list = response["data"].children;
        this.handleGraghData(this.list);
        this.data.after == null
          ? (this.disbledNext = true)
          : (this.disbledNext = false);
      });
  }

  removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach(dataset => {
      dataset.data.pop();
    });
    chart.update();
  }
}
