import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ResponseModel } from 'src/auth/jwtService';
import { AjaxService } from 'src/providers/ajax.service';
import { ErrorToast, Toast } from 'src/providers/common-service/common.service';
import { CompanyAccounts, CompanyDetail, CompanyInfo, CompanySettings, CustomSalaryStructure, Payroll, PFESISetup, SalaryComponentStructure } from 'src/providers/constants';
import { iNavigation } from 'src/providers/iNavigation';
declare var $: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  PfNEsiPage: string = PFESISetup;
  CompanyInfoPage: string = CompanyInfo
  ManageCompanyDetail: string = CompanyDetail;
  ManageCompanyAccounts: string = CompanyAccounts;
  SalaryStructure: string = SalaryComponentStructure;
  CustomSalary: string = CustomSalaryStructure;
  PayRollPage: string = Payroll
  menuItem: any = {};
  active: number = 1;
  groupActiveId: number = 1;
  isLoading: boolean = false;
  submitted: boolean = false;
  companyGroupForm: FormGroup;
  model: NgbDateStruct;
  Companys: Array<CompanyGroup> = [];
  CompanyId: number = 0;
  isPageReady: boolean = false;
  currentCompnay: CompanyGroup = null;

  constructor(private nav: iNavigation,
              private fb: FormBuilder,
              private http: AjaxService
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.initForm();
    this.menuItem = {
      CS: false,
      PR: true,
      LAH: false,
      EX: false
    }
  }

  get f() {
    return this.companyGroupForm.controls;
  }

  redirectTo(pageName: string) {
    switch(pageName) {
      case PFESISetup:
        this.nav.navigate(PFESISetup, null);
        break;
      case CompanyInfo:
        this.nav.navigate(CompanyInfo, this.CompanyId);
        break;
      case Payroll:
        this.nav.navigate(Payroll, this.currentCompnay);
        break;
      case CompanyDetail:
        this.nav.navigate(CompanyDetail, this.CompanyId);
        break;
      case CompanyAccounts:
        this.nav.navigate(CompanyAccounts, this.CompanyId);
        break;
      case SalaryComponentStructure:
        this.nav.navigate(SalaryComponentStructure, null)
        break;
      case CustomSalaryStructure:
        this.nav.navigate(CustomSalaryStructure, null);
        break;
    }
  }

  changeMdneu(code: string) {
    this.menuItem = {
      CS: false,
      PR: false,
      LAH: false,
      EX: false
    };

    switch(code) {
      case 'CS':
        this.menuItem.CS = true;
        break;
      case 'PR':
        this.menuItem.PR = true;
        break;
      case 'LAH':
        this.menuItem.LAH = true;
        break;
      case 'EX':
        this.menuItem.EX = true;
        break;
    }
  }

  openModalToAddNewCompany() {
    $('#NewCompanyModal').modal('show');
  }

  onDateSelection(e: NgbDateStruct) {
    let date = new Date(e.year, e.month - 1, e.day);
    this.companyGroupForm.controls["InCorporationDate"].setValue(date);
  }

  loadData() {
    this.isPageReady = false;
    this.http.get("Company/GetAllCompany").then((response:ResponseModel) => {
      if (response.ResponseBody) {
        this.Companys = response.ResponseBody;
        if(this.Companys && this.Companys.length > 0) {
          this.currentCompnay = this.Companys[0];
          this.CompanyId = this.currentCompnay.CompanyId;
          Toast("Compnay list loaded successfully");
        } else {
          Toast("No compnay found under current organization. Please add one.");
        }
      } else {
        ErrorToast("Record not found.")
      }
      this.isPageReady = true;
    })
  }

  initForm() {
    this.companyGroupForm = this.fb.group({
      OrganizationName: new FormControl(''),
      CompanyName: new FormControl(''),
      CompanyDetail: new FormControl(''),
      InCorporationDate: new FormControl('')
    })
  }

  addNewCompany() {
    this.isLoading = true;
    this.submitted = true;
    if (this.companyGroupForm.invalid)
      return;
    let value:CompanyGroup = this.companyGroupForm.value;
    if (value) {
      this.http.post("Company/AddCompanyGroup", value).then((response:ResponseModel) => {
        if (response.ResponseBody) {
          this.Companys = response.ResponseBody;
          Toast("Company Group added successfully.");
          $('#NewCompanyModal').modal('hide');
        }
        else
          ErrorToast("Fail to add company group. Please contact to admin.");

        this.submitted = false;
        this.isLoading = false;
      });
    }
  }

  changeTab(index: number, item: CompanyGroup) {
    this.isPageReady = false;
    this.currentCompnay = this.Companys[0];
    if(index >= 0 &&  item.CompanyId > 0) {
      let result = document.querySelectorAll('.list-group-item > a');
      let i = 0;
      while (i < result.length) {
        result[i].classList.remove('active-tab');
        i++;
      }
      result[index].classList.add('active-tab');
      this.CompanyId =  item.CompanyId;
      this.isPageReady = true;
    } else {
      ErrorToast("Please select a company.")
    }
  }
}

class CompanyGroup {
  CompanyId: number = 0;
  OrganizationName: string = null;
  CompanyName: string = null;
  CompanyDetail: string = null;
  InCorporationDate: Date = null;
}
interface Payroll {

}
