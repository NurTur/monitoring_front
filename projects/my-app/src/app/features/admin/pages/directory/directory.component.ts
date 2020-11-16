import { Component, OnInit } from '@angular/core';
import { DirectoryService } from 'projects/my-app/src/app/core/services/directory.service';

@Component({
  selector: 'my-org-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss']
})
export class DirectoryComponent implements OnInit {

  channelType: any;
  sensorModel: any;
  sensorType: any;
  manufacturers: any;
  controllerModel: any;
  sensorStatus: any;
  controllerStatus: any;
  channelValueStatus: any;
  countries: any;

  channelValueStatusModal: boolean;
  sensorStatusModal: boolean;
  controllerStatusModal: boolean;
  sensorTypeModal: boolean;
  equipmentModal: boolean;
  sensorModelModal: boolean;
  controllerModelModal: boolean;
  channelTypeModal: boolean;
  manufacturerModal: boolean;
  countryModal: boolean;

  isCountry: boolean;
  isChannelValueStatus: boolean;
  isSensorStatus: boolean;
  isControllerStatus: boolean;
  isChennelType: boolean;
  isSensorType: boolean;
  isSensorModel: boolean;
  isControllerModel: boolean;
  isManufacturer: boolean;
  constructor(private directoryService: DirectoryService) {}

  ngOnInit() {
    if (this.isChennelType) {
      this.getChannelType();
    }
    if (this.isSensorModel) {
      this.getSensorModel();
    }
    if (this.isControllerModel) {
      this.getControllerModel();
    }
    if (this.isControllerStatus) {
      this.getControllerStatus();
    }
    if (this.isSensorStatus) {
      this.getSensorStatus();
    }
    if (this.isChannelValueStatus) {
      this.getChannelValueStatus();
    }
    this.getManufacturer();
    this.getCountry();
    this.getSensorType();
  }

  getChannelType() {
    this.directoryService.getChannelType().subscribe((channelType: any) => {
      this.channelType = channelType;
    });
  }
  getSensorType() {
    this.directoryService.getSensorTypeList().subscribe((sensorType: any) => {
      this.sensorType = sensorType;
    });
  }
  getSensorModel() {
    this.directoryService.getSensorModelList().subscribe((sensorModel: any) => {
      this.sensorModel = sensorModel;
    });
  }
  getControllerModel() {
    this.directoryService.getControllerModel().subscribe((controllerModel: any) => {
      this.controllerModel = controllerModel;
    });
  }
  getSensorStatus() {
    this.directoryService.getSensorStatus().subscribe((sensorStatus: any) => {
      this.sensorStatus = sensorStatus;
    });
  }
  getControllerStatus() {
    this.directoryService.getControllerStatus().subscribe((controllerStatus: any) => {
      this.controllerStatus = controllerStatus;
    });
  }
  getChannelValueStatus() {
    this.directoryService.getChannelValueStatus().subscribe((channelValueStatus: any) => {
      this.channelValueStatus = channelValueStatus;
    });
  }
  getManufacturer() {
    this.directoryService.getManufacturer().subscribe((manufacturers: any) => {
      this.manufacturers = manufacturers;
    });
  }
  getCountry() {
    this.directoryService.getCountry().subscribe((countries: any) => {
      this.countries = countries;
    });
  }

  changeDirectory(name: string) {
    if (name === 'channel-type') {
      this.isChennelType = true;
      this.isSensorType = false;
      this.isSensorModel = false;
      this.isControllerModel = false;
      this.isSensorStatus = false;
      this.isControllerStatus = false;
      this.isChannelValueStatus = false;
      this.isManufacturer = false;
      this.isCountry = false;
    } else if (name === 'sensor-type') {
      this.isChennelType = false;
      this.isSensorType = true;
      this.isSensorModel = false;
      this.isControllerModel = false;
      this.isSensorStatus = false;
      this.isControllerStatus = false;
      this.isChannelValueStatus = false;
      this.isManufacturer = false;
      this.isCountry = false;
    } else if (name === 'sensor-model') {
      this.isChennelType = false;
      this.isSensorType = false;
      this.isSensorModel = true;
      this.isControllerModel = false;
      this.isSensorStatus = false;
      this.isControllerStatus = false;
      this.isChannelValueStatus = false;
      this.isManufacturer = false;
      this.isCountry = false;
    } else if (name === 'controller-model') {
      this.isChennelType = false;
      this.isSensorType = false;
      this.isSensorModel = false;
      this.isControllerModel = true;
      this.isSensorStatus = false;
      this.isControllerStatus = false;
      this.isChannelValueStatus = false;
      this.isManufacturer = false;
      this.isCountry = false;
    } else if (name === 'sensor-status') {
      this.isChennelType = false;
      this.isSensorType = false;
      this.isSensorModel = false;
      this.isControllerModel = false;
      this.isSensorStatus = true;
      this.isControllerStatus = false;
      this.isChannelValueStatus = false;
      this.isManufacturer = false;
      this.isCountry = false;
    } else if (name === 'controller-status') {
      this.isChennelType = false;
      this.isSensorType = false;
      this.isSensorModel = false;
      this.isControllerModel = false;
      this.isSensorStatus = false;
      this.isControllerStatus = true;
      this.isChannelValueStatus = false;
      this.isManufacturer = false;
      this.isCountry = false;
    } else if (name === 'channel-value-status') {
      this.isChennelType = false;
      this.isSensorType = false;
      this.isSensorModel = false;
      this.isControllerModel = false;
      this.isSensorStatus = false;
      this.isControllerStatus = false;
      this.isChannelValueStatus = true;
      this.isManufacturer = false;
      this.isCountry = false;
    }
    else if (name === 'manufacturer') {
      this.isChennelType = false;
      this.isSensorType = false;
      this.isSensorModel = false;
      this.isControllerModel = false;
      this.isSensorStatus = false;
      this.isControllerStatus = false;
      this.isChannelValueStatus = false;
      this.isManufacturer = true;
      this.isCountry = false;
    } else if (name === 'country') {
      this.isChennelType = false;
      this.isSensorType = false;
      this.isSensorModel = false;
      this.isControllerModel = false;
      this.isSensorStatus = false;
      this.isControllerStatus = false;
      this.isChannelValueStatus = false;
      this.isManufacturer = false;
      this.isCountry = true;
    }
    if (this.isChennelType) {
      this.getChannelType();
    }
    if (this.isSensorType) {
      this.getSensorType();
    }
    if (this.isSensorModel) {
      this.getSensorModel();
    }
    if (this.isControllerModel) {
      this.getControllerModel();
    }
    if (this.isControllerStatus) {
      this.getControllerStatus();
    }
    if (this.isSensorStatus) {
      this.getSensorStatus();
    }
    if (this.isChannelValueStatus) {
      this.getChannelValueStatus();
    }
  }
  changeModal(name: string) {
    if (name === 'equipment') {
      this.equipmentModal = !this.equipmentModal;
    } else if (name === 'sensor-type') {
      this.sensorTypeModal = !this.sensorTypeModal;
    } else if (name === 'sensor-model') {
      this.sensorModelModal = !this.sensorModelModal;
    } else if (name === 'controller-model') {
      this.controllerModelModal = !this.controllerModelModal;
    } else if (name === 'channel-type') {
      this.channelTypeModal = !this.channelTypeModal;
    } else if (name === 'sensor-status') {
      this.sensorStatusModal = !this.sensorStatusModal;
    } else if (name === 'controller-status') {
      this.controllerStatusModal = !this.controllerStatusModal;
    } else if (name === 'channel-value-status') {
      this.channelValueStatusModal = !this.channelValueStatusModal;
    } else if (name === 'manufacturer') {
      this.manufacturerModal = !this.manufacturerModal;
    } else if (name === 'country') {
      this.countryModal = !this.countryModal;
    }
  }

}
