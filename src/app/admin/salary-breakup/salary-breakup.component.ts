import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AjaxService } from 'src/providers/ajax.service';
import { ErrorToast, Toast, ToFixed } from 'src/providers/common-service/common.service';
import { iNavigation } from 'src/providers/iNavigation';

@Component({
  selector: 'app-salary-breakup',
  templateUrl: './salary-breakup.component.html',
  styleUrls: ['./salary-breakup.component.scss']
})
export class SalaryBreakupComponent implements OnInit {
  salaryBreakupForm: FormGroup = null;
  isLoading: boolean = false;
  isReady: boolean = false;
  employeeUid: number = 0;
  salaryGroupId: number = 0;
  salaryComponents: Array<any> = [];
  isSalaryGroup: boolean = false;
  salaryGroup: any = null;
  salaryDetail: any = null;
  employeeCTC: number = 0;
  employeeDetails: any = null;
  isBasicSalaryEmpty: boolean = false;

  constructor(private http: AjaxService,
              private fb: FormBuilder,
              private nav: iNavigation) { }

  ngOnInit(): void {
    let data = this.nav.getValue();
    if (data) {
      this.employeeDetails = data;
      this.employeeUid = data.EmployeeUid;
      if(!data.CTC)
        data.CTC = 0;
      this.employeeCTC = data.CTC;
      this.loadData();
    } else {
      ErrorToast("Invalid employee selected")
    }
  }

  loadData() {
    this.isSalaryGroup = false;
    this.isReady = false;
    this.http.get(`SalaryComponent/GetSalaryBreakupByEmpId/${this.employeeUid}`).then(res => {
      let completeSalaryDetail = [];
      if(res.ResponseBody) {
        this.salaryDetail = res.ResponseBody;
        if (this.salaryDetail.CompleteSalaryDetail != null && this.salaryDetail.CompleteSalaryDetail != '{}') {
          completeSalaryDetail = JSON.parse(this.salaryDetail.CompleteSalaryDetail);
        } else {
          ErrorToast("Fail to get salary detail. Please contact to admin.");
          return;
        }
      } else {
        this.salaryDetail = {
          EmployeeId: 0,
          CTC: 0,
          GrossIncome: 0,
          NetSalary: 0,
          CompleteSalaryDetail: null,
          GroupId: 0,
          TaxDetail: null
        };
      }

      this.buildAndBindData(completeSalaryDetail);
    }).catch(e => {
      this.isReady = false;
      this.isSalaryGroup = true;
    });
  }

  buildAndBindData(completeSalaryDetail: any) {
    this.isBasicSalaryEmpty = false;
    if (completeSalaryDetail && completeSalaryDetail.length > 0) {
      let presentMonth = new Date().getMonth() + 1;
      let singleDetail = completeSalaryDetail.find(x => x.MonthNumber == presentMonth);

      if (singleDetail) {
        this.salaryComponents = singleDetail.SalaryBreakupDetails;
        if (this.salaryComponents.find(x => x.ComponentId == "BS").FinalAmount == 0)
          this.isBasicSalaryEmpty = true;
        else
          this.isBasicSalaryEmpty = false;

        this.isReady = true;
      } else {
        ErrorToast("Fail to get salary detail. Please contact to admin.");
        return;
      }
    } else {
      this.salaryComponents = [];
      this.isBasicSalaryEmpty = true;
    }

    this.initForm();
    this.isSalaryGroup = true;
  }

  saveSalaryBreakup() {
    this.isLoading = true;
    let value = this.salaryBreakupForm.value;
    if (value) {
      let presentMonth = new Date().getMonth() + 1;
      let presentYear = new Date().getFullYear();
      let formData = new FormData();
      formData.append('completesalarydetail', JSON.stringify(value.Components));
      this.http.post(`SalaryComponent/InsertUpdateSalaryBreakUp/
          ${this.employeeUid}/${presentMonth}/${presentYear}`, formData).then(res => {
        if (res.ResponseBody) {
          Toast("Salary breakup added successfully.");
          this.isLoading = false;
        }
      }).catch(e => {
        this.isLoading = false;
      })
    }
  }

  initForm() {
    this.salaryBreakupForm = this.fb.group({
      Components: this.buildComponents()
    });
  }

  buildComponents(): FormArray {
    let flag = false;
    let finalItemArray: FormArray = this.fb.array([]);
    this.fb.array(
      this.salaryComponents.map((item) => {
        finalItemArray.push(this.addGroupItems(item, flag))
      })
    );

    return finalItemArray;
  }

  addGroupItems(item: any, flag: boolean): FormGroup {
    return this.fb.group({
      ComponentId: new FormControl(item.ComponentId),
      ComponentName: new FormControl(item.ComponentName),
      FinalAmount: new FormControl(ToFixed((item.FinalAmount * 12), 2)),
      MonthlyAmount: new FormControl(ToFixed(item.FinalAmount, 2)),
      ComponentTypeId: new FormControl(item.ComponentTypeId),
      IsHighlight: new FormControl(flag),
    });
  }


  calculateSalary() {
    this.employeeCTC = Number(this.employeeCTC);
    if (!isNaN(this.employeeCTC) && this.employeeCTC > 0) {
      this.salaryCalculation();
    }
  }

  salaryCalculation() {
    if (this.employeeCTC > 0) {
      this.isSalaryGroup = true;
      this.http.get(`SalaryComponent/SalaryBreakupCalc/${this.employeeUid}/${this.employeeCTC}`)
      .then(res => {
        if (res.ResponseBody) {
          this.buildAndBindData(res.ResponseBody);
        }
      }).catch(e => {
        ErrorToast(e.ResponseBody.UserMessage);
      });
    }
  }
}
