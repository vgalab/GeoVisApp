import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as d3 from 'd3';
import { DatasetInfo } from '../DatasetInfo';

@Component({
  selector: 'app-vis-main',
  templateUrl: './vis-main.component.html',
  styleUrls: ['./vis-main.component.scss'],
})
export class VisMainComponent implements OnInit {

  svgWidth;
  svgHeight;

  @Input() private brushedChartData: any;
  @Input() isShowingBrushedChartData: boolean;

  private _isShowingSelectedRangeOnChart: boolean;
  @Input() set isShowingSelectedRangeOnChart(value: boolean) {
    this._isShowingSelectedRangeOnChart = value;
    this.updateChartBasedOnSelectedRange();
  }
  get isShowingSelectedRangeOnChart() {
    return this._isShowingSelectedRangeOnChart;
  }

  @Input() uploadedFiles: FileList;
  @Input() openedPath: string;

  private _datasetInfo: DatasetInfo;
  @Input() set datasetInfo(value: DatasetInfo) {
    this._datasetInfo = value;
    this.svgWidth = this.datasetInfo.xCount;
    this.svgHeight = this.datasetInfo.yCount
    this.mainSvg.attr("viewBox", "0 0 " + this.svgWidth + " " + this.svgHeight);
  }
  get datasetInfo() {
    return this._datasetInfo;
  }

  private _pickedDate: string;
  @Input() set pickedDate(value: string) {
    this._pickedDate = value;
    this.updateSvgImage();
  }
  get pickedDate() {
    return this._pickedDate;
  }

  private _selectedVariable: string;
  @Input() set selectedVariable(value: string) {
    this._selectedVariable = value;
    this.updateSvgImage();
  }
  get selectedVariable() {
    return this._selectedVariable;
  }

  private _isSelectionEnabled: boolean;
  @Input() set isSelectionEnabled(value: boolean) {
    this._isSelectionEnabled = value;
    if (value) {
      this.mainSvg.call(this.zoom)
        .on("mousedown.zoom", null)
        .on("touchstart.zoom", null)
        .on("touchmove.zoom", null)
        .on("touchend.zoom", null);
    }
    else {
      this.mainSvg.call(this.zoom);
    }
  }
  get isSelectionEnabled() {
    return this._isSelectionEnabled;
  }

  private _selectionRectColor: string;
  @Input() set selectionRectColor(value: string) {
    this._selectionRectColor = value;
    this.updateSelectionRectColor(value);
  }
  get selectionRectColor() {
    return this._selectionRectColor;
  }

  private _selectionRectOpacity: number;
  @Input() set selectionRectOpacity(value: number) {
    this._selectionRectOpacity = value;
    this.updateSelectionRectOpacity(value);
  }
  get selectionRectOpacity() {
    return this._selectionRectOpacity;
  }

  private _resetVisImageTransform = () => this.zoom.transform(this.mainSvg as any, d3.zoomIdentity);
  @Input() resetVisImageTransform: () => void;
  @Output() resetVisImageTransformChange = new EventEmitter();

  private _showPCBrushedRange = () => {
    this.mainSvg.selectAll(".brushed-chart-data-vis").remove();
    if (this.isShowingBrushedChartData) {
      const g = this.mainSvg.append("g")
        .classed("brushed-chart-data-vis", true)
        .attr("transform", this.mainSvg.select("g.image-holder").attr("transform"));;
      g.selectAll("rect")
        .data(this.brushedChartData)
        .enter()
        .append("rect")
        .attr("x", (d: any) => +d.x - 1)
        .attr("y", (d: any) => +d.y - 1)
        .attr("width", 2)
        .attr("height", 2)
        .attr("fill", "white")
        .attr("opacity", .5);
    }
  };
  @Input() showPCBrushedRange: () => void;
  @Output() showPCBrushedRangeChange = new EventEmitter();

  @Input() updateChart: (date: string, xMin?: number, yMin?: number, xMax?: number, yMax?: number) => void;


  private userSelectRect: { start: [number, number], end: [number, number] } = { start: null, end: null };

  private get mainSvg() {
    return d3.select("app-vis-main svg.main-svg");
  }

  private readonly zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", () => {
    const t = d3.event.transform;
    this.mainSvg.selectAll("g").attr("transform", t);
    this.mainSvg.selectAll("g.user-tags circle")
      .attr("r", 3 / t.k);
  });

  constructor() { }

  ngOnInit() {
    this.resetVisImageTransformChange.emit(this._resetVisImageTransform);
    this.showPCBrushedRangeChange.emit(this._showPCBrushedRange);

    this.generateVisulization();
  }

  private generateVisulization() {
    var g = this.mainSvg.append("g")
      .classed("image-holder", true);
    var img = g.append("image")
      .attr("width", "100%")
      .attr("height", "100%");
    this.mainSvg
      .on("contextmenu.preventDefault", () => d3.event.preventDefault())
      .on("mousedown.selectRect", () => this.selectRectMouseDownHandler(img.node()))
      .on("mousemove.selectRect", () => this.selectRectMouseMoveHandler(img.node()))
      .on("mouseup.selectRect", () => this.selectRectMouseUpHandler(img.node()))
    this.generateSvgZoom();
  }

  private selectRectMouseDownHandler(referenceObject: d3.BaseType) {

    if (this.isSelectionEnabled) {
      this.mainSvg.selectAll("g.user-select-rect").remove();
      console.log(".")
      this.userSelectRect.start = d3.mouse(referenceObject as any);
      this.userSelectRect.end = null;
      var g = this.mainSvg.append("g")
        .classed("user-select-rect", true)
        .attr("transform", this.mainSvg.select("g.image-holder").attr("transform"));
      g.append("rect");
      this.updateSelectionRectColor(this.selectionRectColor);
      this.updateSelectionRectOpacity(this.selectionRectOpacity);
    }
  }

  private updateSelectionRectColor(color: string) {
    var g = this.mainSvg.select("g.user-select-rect");
    if (!g.empty()) {
      g.select("rect").attr("fill", color);
    }
  }

  private updateSelectionRectOpacity(opacity: number) {
    var g = this.mainSvg.select("g.user-select-rect");
    if (!g.empty()) {
      g.select("rect").attr("opacity", opacity);
    }
  }

  private selectRectMouseMoveHandler(referenceObject: d3.BaseType) {
    if (this.isSelectionEnabled && !this.userSelectRect.end) {
      var g = this.mainSvg.select("g.user-select-rect");
      if (!g.empty()) {
        var mousePosition = d3.mouse(referenceObject as any);
        var rect = g.select("rect");

        rect.attr("x", Math.min(mousePosition[0], this.userSelectRect.start[0]))
          .attr("y", Math.min(mousePosition[1], this.userSelectRect.start[1]))
          .attr("width", Math.max(mousePosition[0], this.userSelectRect.start[0]) - Math.min(mousePosition[0], this.userSelectRect.start[0]))
          .attr("height", Math.max(mousePosition[1], this.userSelectRect.start[1]) - Math.min(mousePosition[1], this.userSelectRect.start[1]));
      }
    }
  }

  private selectRectMouseUpHandler(referenceObject: d3.BaseType) {
    if (this.isSelectionEnabled) {
      this.userSelectRect.end = d3.mouse(referenceObject as any);
      this.updateChartBasedOnSelectedRange();
    }
  }

  private generateSvgZoom() {
    this.mainSvg
      .call(this.zoom);
  }

  private async updateSvgImage() {
    if (this.pickedDate && this.selectedVariable) {
      var filePath =
        "img" + "/" +
        this.pickedDate.substring(0, 4) + "/" +
        this.pickedDate.substring(5, 7) + "/" +
        this.pickedDate.substring(8, 10) + "/" +
        this.selectedVariable + ".png";

      var link = this.openedPath + "/" + filePath;
      this.mainSvg.select("g.image-holder image")
        .attr("xlink:href", link);
    }
  }

  private updateChartBasedOnSelectedRange() {
    if (this.isShowingSelectedRangeOnChart) {
      var minCoordinate = [
        Math.min(this.userSelectRect.start[0], this.userSelectRect.end[0]),
        Math.min(this.userSelectRect.start[1], this.userSelectRect.end[1]),
      ];
      var maxCoordinate = [
        Math.max(this.userSelectRect.start[0], this.userSelectRect.end[0]),
        Math.max(this.userSelectRect.start[1], this.userSelectRect.end[1]),
      ];

      this.updateChart(this.pickedDate, minCoordinate[0], minCoordinate[1], maxCoordinate[0], maxCoordinate[1]);
    }
    else {
      this.updateChart(this.pickedDate);
    }
  }

}