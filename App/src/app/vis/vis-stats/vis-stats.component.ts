import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import ParCoords from "parcoord-es";
import { DatasetInfo } from '../DatasetInfo';

@Component({
  selector: 'app-vis-stats',
  templateUrl: './vis-stats.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './vis-stats.component.scss',
    '../../../../node_modules/parcoord-es/dist/parcoords.css'
  ]
})
export class VisStatsComponent implements OnInit {

  @Input() uploadedFiles: FileList;
  @Input() openedPath: string;
  @Input() datasetInfo: DatasetInfo;

  private _pickedDate: string;
  @Input() private set pickedDate(value: string) {
    this._pickedDate = value;
    if (this.updateChart) {
      this.updateChart(value);
    }
    // if (value) {
    //   (async () => {
    //     this.chartData = await this.obtainChartData(value, 0, 0, 0, 0);
    //     console.log(this.chartData)
    //     this.generateChart();
    //   })();
    // }
  }
  private get pickedDate() {
    return this._pickedDate;
  }

  private _selectedVariable: string;
  @Input() private set selectedVariable(value: string) {
    this._selectedVariable = value;
    if (this.updateChart) {
      this.updateChart(value);
    }
  }
  private get selectedVariable() {
    return this._selectedVariable;
  }

  private chart: any;
  private chartData: any[];

  @Input() resetPCBrush: () => void;
  @Output() resetPCBrushChange = new EventEmitter();

  private _updateChart = async (date: string, xMin: number = 0, yMin: number = 0, xMax: number = this.datasetInfo.xCount, yMax: number = this.datasetInfo.yCount) => {
    if (date && this.datasetInfo) {
      this.chartData = await this.obtainChartData(this.pickedDate, xMin, yMin, xMax, yMax);
      this.generateChart();
    }
  };
  @Input() updateChart: (date: string, xMin?: number, yMin?: number, xMax?: number, yMax?: number) => void
  @Output() updateChartChange = new EventEmitter();

  @Input() brushedChartData: any;
  @Output() brushedChartDataChange = new EventEmitter();

  @Input() showPCBrushedRange: () => void;

  constructor() { }

  ngOnInit() {
    window.onresize = () => {
      this.generateChart();
    };

    this.updateChartChange.emit(this._updateChart);
  }

  private generateChart() {
    var keys = Object.keys(this.chartData[0]);
    keys.splice(keys.indexOf("x"), 1);
    keys.splice(keys.indexOf("y"), 1);

    var dimensions = {};
    for (const key of keys) {
      dimensions[key] = { "type": "number" }
    }

    d3.selectAll("div.stats-main-div").selectAll("*").remove();

    var selectedVariableMin = Math.min(...this.chartData.map(d => d[this.selectedVariable]));
    var selectedVariableMax = Math.max(...this.chartData.map(d => d[this.selectedVariable]));

    this.chart = ParCoords()("div.stats-main-div")
      .data(this.chartData)
      .dimensions(dimensions)
      .margin({
        top: 20,
        left: 20,
        right: 20,
        bottom: 20
      })
      .mode("queue")
      .render()
      .createAxes()
      .reorderable()
      .brushMode("1D-axes")
      .color(d => d3.scaleLinear().domain([selectedVariableMin, selectedVariableMax]).range(["blue", "red"] as any)(d[this.selectedVariable]))
      .alpha(.3)
      .on("brush", d => {
        this.brushedChartDataChange.emit(d);
        if (this.showPCBrushedRange) {
          this.showPCBrushedRange();
        }
      });

    this.brushedChartDataChange.emit(this.chartData);

    this.resetPCBrushChange.emit(
      () => this.chart.brushReset()
    );
  }

  private async obtainChartData(date: string, xMin: number, yMin: number, xMax: number, yMax: number) {
    var csv = await d3.csv(this.openedPath + "/" + "csv/" + this.pickedDate + ".csv");
    return csv.filter(d => +d.x >= xMin && +d.x <= xMax && +d.y >= yMin && +d.y <= yMax);
  }

}
