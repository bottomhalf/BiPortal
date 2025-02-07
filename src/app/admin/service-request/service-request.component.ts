import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { autoCompleteModal } from 'src/app/util/iautocomplete/iautocomplete.component';
import { ResponseModel } from 'src/auth/jwtService';
import { AjaxService } from 'src/providers/ajax.service';
import { GetEmployees } from 'src/providers/ApplicationStorage';
import { ErrorToast, Toast, ToLocateDate } from 'src/providers/common-service/common.service';
import { Filter } from 'src/providers/userService';
declare var $: any;

@Component({
  selector: 'app-service-request',
  templateUrl: './service-request.component.html',
  styleUrls: ['./service-request.component.scss']
})
export class ServiceRequestComponent implements OnInit {
  isPageReady: boolean = false;
  orderByNameAsc: boolean = false;
  requestDetail: Array<any> = [];
  requestFilter: Filter = null;
  requestForm: FormGroup = null;
  isLoading: boolean = false;
  isFormReady: boolean = false;
  requestId: string = '';
  employeesList: autoCompleteModal = null;
  employeeIds: Array<any> = [];
  managers: Array<any> = [];
  submitted: boolean = false;
  maxDate: any = null;
  frommodel: NgbDateStruct;
  tomodel: NgbDateStruct;

  constructor(
    private http: AjaxService,
    private fb: FormBuilder
    ) { }

  ngOnInit(): void {
    this.employeesList = new autoCompleteModal();
    this.employeesList.data = [];
    this.employeesList.placeholder = "Employee";
    this.employeesList.data = GetEmployees();
    this.employeesList.className = "";
    this.employeesList.isMultiSelect = true;
    this.maxDate = {year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()};
    this.requestFilter = new Filter();
    this.loadPageData()
  }

  selectedEmployee(e: any) {
    console.log(e);
    let index = this.managers.findIndex(x => x.value == e.value);
    if(index == -1) {
      this.managers.push(e);
    } else {
      this.managers.splice(index, 1);
    }
  }

  loadPageData() {
    this.http.post("ServiceRequest/GetServiceRequest", this.requestFilter).then((response: ResponseModel) => {
      if (response.ResponseBody) {
        this.requestDetail = response.ResponseBody;
        this.isPageReady = true;
        Toast("Request service data loaded successfully.")
      } else {
        ErrorToast("Fail to get the result.");
      }
    });
  }

  initForm(service: any) {
    this.requestForm = this.fb.group({
      ServiceRequestId: new FormControl(service.ServiceRequestId),
      CompanyId: new FormControl(service.CompanyId),
      RequestTypeId: new FormControl(service.RequestTypeId, [Validators.required]),
      RequestTitle: new FormControl(service.RequestTitle, [Validators.required]),
      RequestDescription: new FormControl(service.RequestDescription, [Validators.required]),
      Quantity: new FormControl(service.Quantity),
      Duration: new FormControl(service.Duration),
      FromDate: new FormControl(service.FromDate),
      ToDate: new FormControl(service.ToDate),
      RequestedTo_1: new FormControl(service.RequestedTo_1),
      RequestedTo_2: new FormControl(service.RequestedTo_2),
      RequestedTo_3: new FormControl(service.RequestedTo_3),
      Reference: new FormControl(service.Reference),
      RequestStatus: new FormControl(service.RequestStatus),
      RequestedBy: new FormControl(service.RequestedBy),
      RequestedOn: new FormControl(service.RequestedOn),
      UpdatedOn: new FormControl(service.UpdatedOn)
    });
  }

  CreateUpdateRequest() {
    this.submitted = true;
    this.isLoading = true;
    let errorCounter =- 0;
    if (this.requestForm.invalid) {
      this.isLoading = false;
      return;
    }
    if (this.managers.length <=0) {
      this.isLoading = false;
      ErrorToast("Please select at least one manager");
      return;
    }
    let fileIds = this.managers.map(x => x.value);
    let value = this.requestForm.value;
    value.AssignTo = JSON.stringify(fileIds);
    if (value.RequestTypeId == "BOOKING") {
      if (value.ToDate == null || value.ToDate == '0001-01-01T00:00:00') {
        this.requestForm.get('ToDate').setValue(null);
        this.isLoading = false;
        errorCounter++;
      }
      if (value.FromDate == null || value.FromDate == '0001-01-01T00:00:00') {
        this.requestForm.get('FromDate').setValue(null);
        this.isLoading = false;
        errorCounter++;
      }
      let fromdate = new Date(value.FromDate).setHours(0,0,0,0);
      let todate = new Date(value.ToDate).setHours(0,0,0,0);
      if (fromdate > todate) {
        ErrorToast("Todate must be greater than from date");
        this.isLoading = false;
        errorCounter++;
      }
    }
    if (errorCounter === 0) {
      this.http.post("ServiceRequest/AddUpdateServiceRequest", value).then(res => {
        if (res.ResponseBody) {
          this.requestDetail = res.ResponseBody;
          $('#addupdateModal').modal('hide');
          this.isLoading = false;
          this.isPageReady = true;
          Toast("Request service addded/updated successfully.")
        }
      }).catch(e => {
        this.isLoading = false;
      })
    } else {
      ErrorToast("Please fill all the mandatory fields");
    }
  }

  resetFilter() {

  }

  filterRecords() { }

  arrangeDetails() { }

  EditCurrent(service: any) {
    this.isFormReady = false;
    if (service) {
      this.requestId = service.RequestTypeId;
      if (service.FromDate) {
        service.FromDate = ToLocateDate(service.FromDate);
        this.frommodel = { day: service.FromDate.getDate(), month: service.FromDate.getMonth() + 1, year: service.FromDate.getFullYear()};
      }
      if (service.ToDate) {
        service.ToDate = ToLocateDate(service.ToDate);
        this.tomodel = { day: service.ToDate.getDate(), month: service.ToDate.getMonth() + 1, year: service.ToDate.getFullYear()};
      }
      if (service.AssignTo) {
        this.employeeIds = JSON.parse(service.AssignTo);
      }
      this.initForm(service);
      this.isFormReady = true;
      $('#addupdateModal').modal('show');
    }
  }

  enableAppropiateSection(e: any) {
    let value = e.target.value;
    if (value) {
      this.requestId = value;
      if (this.requestId == "SERVICE") {

      } else if (this.requestId == "BOOKING") {
        this.requestForm.controls.Duration.setValidators([Validators.required]);
        this.requestForm.controls.FromDate.setValidators([Validators.required]);
        this.requestForm.controls.ToDate.setValidators([Validators.required]);
        this.requestForm.controls.Duration.updateValueAndValidity();
        this.requestForm.controls.ToDate.updateValueAndValidity();
        this.requestForm.controls.FromDate.updateValueAndValidity();
      } else if (this.requestId == "PRODUCT") {

      }
    }
  }

  GetFilterResult(result: any) { }

  onDateSelection(e: NgbDateStruct) {
    let date = new Date(e.year, e.month - 1, e.day);
    this.requestForm.controls["FromDate"].setValue(date);
  }

  toDateSelection(e: NgbDateStruct) {
    let date = new Date(e.year, e.month - 1, e.day);
    this.requestForm.controls["ToDate"].setValue(date);
  }

  get f() {
    return this.requestForm.controls;
  }

  removeManager() {

  }
}
