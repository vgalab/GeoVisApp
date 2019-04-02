import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DatasetInfo } from '../DatasetInfo';
import { ElectronService } from 'ngx-electron';
import { ChildProcessService } from 'ngx-childprocess';

@Component({
  selector: 'app-vis-control',
  templateUrl: './vis-control.component.html',
  styleUrls: ['./vis-control.component.scss'],
})
export class VisControlComponent implements OnInit {

  @Input() datasetInfo: DatasetInfo;

  private _isShowingSelectedRangeOnChart: boolean;
  @Input() set isShowingSelectedRangeOnChart(value: boolean) {
    this._isShowingSelectedRangeOnChart = value;
    this.isShowingSelectedRangeOnChartChange.emit(value);
  }
  @Output() isShowingSelectedRangeOnChartChange = new EventEmitter();
  get isShowingSelectedRangeOnChart() {
    return this._isShowingSelectedRangeOnChart;
  }

  private _pickedDate: string;
  @Input() set pickedDate(value: string) {
    this._pickedDate = value;
    this.pickedDateFrom = value;
    this.pickedDataTo = value;
    this.pickedDateChange.emit(value);
  }
  @Output() pickedDateChange = new EventEmitter();
  get pickedDate() {
    return this._pickedDate;
  }

  private _selectedVariable: string;
  @Input() set selectedVariable(value: string) {
    this._selectedVariable = value;
    this.selectedVariableChange.emit(value);
  }
  @Output() selectedVariableChange = new EventEmitter();
  get selectedVariable() {
    return this._selectedVariable;
  }

  private _isSelectionEnabled: boolean;
  @Input() set isSelectionEnabled(value: boolean) {
    this._isSelectionEnabled = value;
    this.isSelectionEnabledChange.emit(value);
  }
  @Output() isSelectionEnabledChange = new EventEmitter();
  get isSelectionEnabled() {
    return this._isSelectionEnabled;
  }

  private _selectionRectColor: string;
  @Input() set selectionRectColor(value: string) {
    this._selectionRectColor = value;
    this.selectionRectColorChange.emit(value);
  }
  @Output() selectionRectColorChange = new EventEmitter();
  get selectionRectColor() {
    return this._selectionRectColor;
  }

  private _selectionRectOpacity: number;
  @Input() set selectionRectOpacity(value: number) {
    this._selectionRectOpacity = value;
    this.selectionRectOpacityChange.emit(value);
  }
  @Output() selectionRectOpacityChange = new EventEmitter();
  get selectionRectOpacity() {
    return this._selectionRectOpacity;
  }

  private _isShowingBrushedChartData: boolean;
  @Input() set isShowingBrushedChartData(value: boolean) {
    this._isShowingBrushedChartData = value;
    this.isShowingBrushedChartDataChange.emit(value);
    if (this.showPCBrushedRange) {
      this.showPCBrushedRange();
    }
  }
  @Output() isShowingBrushedChartDataChange = new EventEmitter();
  get isShowingBrushedChartData() {
    return this._isShowingBrushedChartData;
  }

  pickedDateFrom: string;
  pickedDataTo: string;

  @Input() resetVisImageTransform: () => void;
  @Input() showPCBrushedRange: () => void;

  constructor(private electronService: ElectronService, private childProcessService: ChildProcessService) { }

  ngOnInit() { }

  generate() {
    var appPath = this.electronService.remote.app.getAppPath().replace(/\\/g, "/");
    var scriptPath = appPath + "/www/" + "assets/scripts/plot.py";
    var scriptParams = "";
    var command = "python " + scriptPath + " " + scriptParams;

    this.childProcessService.childProcess.exec(
      command,
      [],
      (err, stdout, stderr) => alert(stdout)
    );
  }


}
