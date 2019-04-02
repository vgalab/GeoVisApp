import { Component, OnInit } from '@angular/core';
import { DatasetInfo } from './DatasetInfo';
import { ElectronService } from 'ngx-electron';
import * as d3 from 'd3';

@Component({
  selector: 'app-vis',
  templateUrl: './vis.page.html',
  styleUrls: ['./vis.page.scss'],
})
export class VisPage implements OnInit {

  uploadedDirectoryName: string = "No opened dataset";
  openedPath: string;
  uploadedFiles: FileList;
  datasetInfo: DatasetInfo;
  pickedDate: string;
  selectedVariable: string;
  brushedChartData: any;

  isShowingBrushedChartData: boolean;
  isSelectionEnabled: boolean;
  isShowingSelectedRangeOnChart: boolean;
  selectionRectColor: string;
  selectionRectOpacity: number;

  resetVisImageTransform: () => void;
  showPCBrushedRange: () => void;

  updateChart: (date: string, xMin?: number, yMin?: number, xMax?: number, yMax?: number) => void;

  constructor(private electronService: ElectronService) {
    this.isSelectionEnabled = false;
    this.selectionRectOpacity = .3;
  }

  ngOnInit() {
  }

  async fileUploadClicked(filePicker) {
    // filePicker.click();
    const selectedPaths = this.electronService.remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    });

    this.openedPath = selectedPaths[0].replace(/\\/g, "/");

    this.uploadedDirectoryName = this.openedPath.split("/").pop();

    this.datasetInfo = (await d3.json(this.openedPath + "/dataset.json") as any).datasetInfo;
    this.pickedDate = this.datasetInfo.minDate;
    this.selectedVariable = this.datasetInfo.variableList[0];
  }

}
