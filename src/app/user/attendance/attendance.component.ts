import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { autoCompleteModal } from 'src/app/util/iautocomplete/iautocomplete.component';
import { ResponseModel } from 'src/auth/jwtService';
import { AjaxService } from 'src/providers/ajax.service';
import { ApplicationStorage, GetEmployees } from 'src/providers/ApplicationStorage';
import { ErrorToast, Toast, UserDetail, WarningToast } from 'src/providers/common-service/common.service';
import { AccessTokenExpiredOn, UserLeave, UserTimesheet, UserType } from 'src/providers/constants';
import { iNavigation } from 'src/providers/iNavigation';
import { UserService } from 'src/providers/userService';
declare var $: any;

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  isFormReady: boolean = false;
  attendanceArray: FormArray;
  employeeId: number = 0;
  userName: string = "";
  fromDate: any = null;
  toDate: any = null;
  isEmployeesReady: boolean = false;
  userDetail: UserDetail = new UserDetail();
  time = new Date();
  intervalId;
  DayValue: number = 0;
  clientId: number = 0;
  client: any = null;
  isLoading: boolean = false;
  billingHrs: string = '';
  NoClient: boolean = false;
  isAttendanceDataLoaded: boolean = false;
  divisionCode: number = 0;
  daysInMonth: number = 0;
  monthName: Array<any> = [];
  presentMonth: boolean = true;
  cachedData: any = null;
  currentAttendance: any = null;
  employeesList: autoCompleteModal = new autoCompleteModal();
  applicationData: any = null;
  emails: Array<any> = [];
  employees: Array<any> = [];
  //-------------------------- required code starts --------------------------

  commentValue: string = null;
  today: Date = null;
  tomorrow: Date = null;
  isComment: boolean = false;
  currentDays: Array<any> = [];

  constructor(private fb: FormBuilder,
    private http: AjaxService,
    private nav: iNavigation,
    private local: ApplicationStorage,
    private user: UserService
  ) { }

  ngOnInit(): void {
    this.today = new Date();
    this.tomorrow = new Date(new Date().setDate(this.today.getDate() + 1));
    this.isFormReady = false;
    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);

    this.DayValue = this.time.getDay();
    this.cachedData = this.nav.getValue();
    this.employeesList.placeholder = "Employee";
    this.employeesList.className = 'disable-field';
    this.employeesList.isMultiSelect = true;
    this.loadAutoComplete();
    this.isEmployeesReady = true;
    if(this.cachedData) {
      this.employeeId = this.cachedData.EmployeeUid;
      this.clientId = this.cachedData.ClientUid;
      this.userName = this.cachedData.FirstName + " " + this.cachedData.LastName;
      this.loadMappedClients();
    } else {
      let expiredOn = this.local.getByKey(AccessTokenExpiredOn);
      this.userDetail = this.user.getInstance() as UserDetail;
      if(expiredOn === null || expiredOn === "")
      this.userDetail["TokenExpiryDuration"] = new Date();
      else
      this.userDetail["TokenExpiryDuration"] = new Date(expiredOn);
      let Master = this.local.get(null);
      if(Master !== null && Master !== "") {
        this.userDetail = Master["UserDetail"];
        this.employeeId = this.userDetail.UserId;
        this.userName = this.userDetail.FirstName + " " + this.userDetail.LastName;
        //$('#loader').modal('show');
        this.loadMappedClients();
      } else {
        Toast("Invalid user. Please login again.")
      }
    }
  }

  bindAttendace(data: Array<any>) {
    if(data && data.length > 0) {
      this.currentDays = [];
      this.presentMonth = true;
      let index = 0;
      while(index < data.length) {
        data[index].AttendanceDay = new Date(data[index].AttendanceDay);
        if (data[index].IsHoliday) {
          data[index].PresentDayStatus = 4;
          data[index].AttendenceStatus = 4;
        } else if(data[index].IsWeekend) {
          data[index].PresentDayStatus = 3;
          data[index].AttendenceStatus = 3;
        }
        index++;
      }

      this.currentDays = data.reverse();
    } else {
      WarningToast("Unable to bind data. Please contact admin.");
    }
  }

  loadMappedClients() {
    this.isLoading = true;
    if(this.employeeId <= 0) {
      Toast("Invalid user selected.")
      return;
    }

    let now = new Date();
    this.fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
    this.toDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let data = {
      EmployeeUid: Number(this.employeeId),
      ClientId: Number(this.clientId),
      UserTypeId : UserType.Employee,
      AttendenceFromDay: this.fromDate,
      AttendenceToDay: this.toDate,
      ForYear: this.fromDate.getFullYear(),
      ForMonth: this.fromDate.getMonth() + 1,
      CompanyId: this.userDetail.CompanyId
    }
    this.loadMappedData(data);
  }

  loadMappedData(data: any) {
    this.http.post("Attendance/GetAttendanceByUserId", data).then((response: ResponseModel) => {
      if(response.ResponseBody.EmployeeDetail) {
        this.client = response.ResponseBody.EmployeeDetail;
        this.getMonths();
      }
      else {
        this.NoClient = true;
        this.isAttendanceDataLoaded = false;
      }

      if (response.ResponseBody.AttendacneDetails) {
        this.bindAttendace(response.ResponseBody.AttendacneDetails);
        //this.createPageData(response.ResponseBody.AttendacneDetails);
        this.isAttendanceDataLoaded = true;
      }

      this.divisionCode = 1;
      this.isLoading = false;
    }).catch(err => {
      this.isLoading = false;
      WarningToast(err.error.HttpStatusMessage);
    });
  }



  getMonths() {
    this.monthName = [];
    var dt = new Date(this.client.CreatedOn);
    var month = dt.getMonth()+1;
    var year = dt.getFullYear();
    let i = 1;
    if (year == new Date().getFullYear()) {
      //this.daysInMonth = new Date(year, month, dt.getDate()).getDate();
      i = month;
    }
    while( i <= new Date().getMonth()+1) {
      var mnth = Number((((i+1) > 9 ? "" : "0") + i));
      month++;
      this.monthName.push( {
        name: new Date(year, mnth-1, 1).toLocaleString("en-us", { month: "short" }),
        value: mnth-1
      }); // result: Aug
      i++;
    }
    this.monthName.reverse();
  }

  previousMonthAttendance(month: number, index: number) {
    let startDate = new Date(new Date().getFullYear(), month, 1);
    let endDate;
    if (month == new Date().getMonth())
      endDate = new Date();
    else
      endDate = new Date(new Date().getFullYear(), month+1, 0);

    let data = {
      EmployeeUid: Number(this.employeeId),
      ClientId: Number(this.clientId),
      UserTypeId : UserType.Employee,
      AttendenceFromDay: startDate,
      AttendenceToDay: endDate,
      ForYear: new Date().getFullYear(),
      ForMonth: month + 1,
      CompanyId: this.userDetail.CompanyId
    }
    let radiobtn = document.querySelectorAll('input[name="btnradio"]');
    if (radiobtn.length > 0) {
      for (let i = 0; i < radiobtn.length; i++) {
        radiobtn[i].removeAttribute('checked');
      }
      radiobtn[index].setAttribute('checked', '');
    }
    this.loadMappedData(data);
  }

  getMonday(d: Date) {
    if(d) {
      d = new Date(d);
      var day = d.getDay(),
          diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
      return new Date(d.setDate(diff));
    }
    return null;
  }

  applyWorkFromHome(e: any) {
    this.currentAttendance = e;
    this.today = this.currentAttendance.AttendanceDay;

    this.today = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate()
    );

    this.tomorrow = this.today;

    this.currentAttendance.AttendanceDay = this.today;
    this.commentValue = this.currentAttendance.UserComments;
    $('#commentModal').modal('show');
  }

  submitAttendance() {
    this.isLoading = true;
    let commment = {
      EmployeeUid: this.employeeId,
      UserTypeId: UserType.Employee,
      AttendanceDay: this.currentAttendance.AttendanceDay,
      AttendenceFromDay: this.today,
      AttendenceToDay: this.tomorrow,
      UserComments: this.commentValue,
      Emails: this.emails
    }
    if (this.commentValue == '') {
      this.isComment = true;
      this.isLoading = false;
      return;
    }
    this.http.post('Attendance/SubmitAttendance', commment).then((response: ResponseModel) => {
      if (response.ResponseBody && response.ResponseBody === "updated" || response.ResponseBody === "inserted") {
        let current = this.currentDays.find(x => x.AttendanceDay === this.currentAttendance.AttendanceDay);
        if(current) {
          current.PresentDayStatus = 2;
        }
        this.isLoading = false;
        Toast("Wow!!!  Your attendance submitted successfully.");
      } else {
        this.isLoading = false;
        ErrorToast(response.ResponseBody, 20);
      }

      $('#commentModal').modal('hide');
    }).catch(e => {
      this.isLoading = false;
    })
  }

  //-------------------------- required code ends --------------------------

  checkDateExists(currenDate: Date, existingDateList: Array<any>) {
    let i = 0;
    let date = null;
    while(i < existingDateList.length) {
      date = new Date(existingDateList[i]["AttendanceDay"]);
      if(currenDate.getFullYear() == date.getFullYear() &&
         currenDate.getMonth() == date.getMonth() &&
         currenDate.getDate() == date.getDate()) {
           return true;
         }
      i++;
    }
    return false;
  }

  activateMe(elemId: string) {
    switch(elemId) {
      case "attendance-tab":
      break;
      case "timesheet-tab":
        this.nav.navigateRoot(UserTimesheet, this.cachedData);
        break;
      case "leave-tab":
        this.nav.navigateRoot(UserLeave, this.cachedData);
      break;
    }
  }

  loadAutoComplete() {
    this.isEmployeesReady = false;
    this.employeesList.data = [];
    this.employeesList.placeholder = "Employee";
    this.employeesList.data = GetEmployees();
    this.applicationData = GetEmployees();
    this.employeesList.className = "";
    this.isEmployeesReady = true;
  }

  addEmployeeEmail() {
    let employee = this.applicationData.find(x => x.value == this.employeeId);
    this.emails.push(employee.email);
    this.employees.push({
      Id: employee.value,
      Name: employee.text,
      Email: employee.email
    });
    let index = this.employeesList.data.findIndex(x => x.value == this.employeeId);
    this.employeesList.data.splice(index, 1);
  }

  removeEmail(index: number) {
    if (index >-1) {
      this.employeesList.data.push({
        value: this.employees[index].Id,
        text: this.employees[index].Name
      });
      this.employees.splice(index, 1);
    }
  }
}
