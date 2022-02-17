import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { tableConfig } from 'src/app/util/dynamic-table/dynamic-table.component';
import { ResponseModel } from 'src/auth/jwtService';
import { AjaxService } from 'src/providers/ajax.service';
import { CommonService, UserDetail } from 'src/providers/common-service/common.service';
import { Clients, Documents, DocumentsPage, RegisterClient } from 'src/providers/constants';
import { iNavigation } from 'src/providers/iNavigation';
import { Filter, UserService } from 'src/providers/userService';
import { DocumentUser } from '../documents/documents.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  documentForm: FormGroup = null;
  user: UserDetail = null;
  documents: Array<OnlineDocModel> = [];
  tableConfiguration: tableConfig = null;
  openModal: string = 'hide';
  isLoading: boolean = false;
  RegisterNewClient: string = RegisterClient;
  clients: Array<any> = [];
  activePage:number = 0;
  clientsData: Filter = null;
  isClientFound: boolean = false;
  clientDetails: clientModel = null;
  anyFilter: string = "";

  displayActivePage(activePageNumber:number){
    this.activePage = activePageNumber
  }

  constructor(private fb: FormBuilder,
    private http: AjaxService,
    private userService: UserService,
    private nav: iNavigation,
    private common: CommonService
  ) { }

  ngOnInit(): void {
    this.clientsData = new Filter();
    this.clientDetails = new clientModel();

    // this.paginationData.PageIndex = 1;
    // this.paginationData.PageSize = 10;
    // this.paginationData.TotalRecords = 95;
    this.documentForm = this.fb.group({
      "Title": new FormControl(""),
      "Description": new FormControl(""),
      "CreatedOn": new FormControl(new Date()),
      "PageLink": new FormControl("")
    });

    this.user = this.userService.getInstance();
    if (this.user !== undefined && this.user !== null)
      this.LoadData();
  }

  AddEditDocuments(clientId: number) {
    let userDetail: DocumentUser = new DocumentUser();
    userDetail.PageName = Clients;
    userDetail.UserId = clientId;
    this.nav.navigate(Documents, userDetail);
  }

  LoadData() {
    let filter: Filter = new Filter();
    let Mobile = '';
    let Email = '';
    if (this.user.Mobile !== null)
      Mobile = this.user.Mobile;

    if (this.user.EmailId !== null)
      Email = this.user.EmailId;

    if (Mobile !== "" || Email !== "") {
      filter.SearchString = `1 `;
      this.http.post("Clients/GetClients", this.clientsData).then((response: ResponseModel) => {
        this.clients = response.ResponseBody;
        if (this.clients.length > 0) {
          this.clientsData.TotalRecords = this.clients[0].Total;
          this.isClientFound = true;
        } else {
          this.clientsData.TotalRecords = 0;
        }
      });
    }
  }


  EditCurrent(data: any) {
    if (data !== null) {
      //data = data.item;
      let ClientId = data.ClientId;
      if (ClientId !== null && ClientId !== "") {
        this.http.get(`Clients/GetClientById/${ClientId}/${data.IsActive}`).then((response: ResponseModel) => {
          if (response.ResponseBody !== null) {
            this.nav.navigate(RegisterClient, response.ResponseBody);
          }
        }).catch(e => {
          this.common.ShowToast("Got error to get data. Please contact to admin.");
        })
      }
    }
  }

  CreateDocument() {
    if (this.documentForm.valid) {
      if (this.documentForm.controls['Title'].value !== "" &&
        this.documentForm.controls['Description'].value !== "") {
        this.isLoading = true;
        let filter: Filter = new Filter();
        filter.SearchString = `1=1 AND UD.MOBILENO = '${this.user.Mobile}' OR UD.EMAILID = '${this.user.EmailId}'`;
        filter["OnlineDocumentModel"] = this.documentForm.value;
        filter["Mobile"] = this.user.Mobile;
        filter["Email"] = this.user.EmailId;
        this.http.post('OnlineDocument/CreateDocument', filter)
          .then((response: ResponseModel) => {
            let data = response.ResponseBody;
            if (data !== null) {
              this.clients = data;;
              this.toggelAddUpdateModal();
            } else {
              this.toggelAddUpdateModal();
            }
            this.isLoading = true;
          }).catch(e => {
            this.isLoading = true;
          });
      } else {
        alert("Entry name is required field.");
      }
    }
  }

  GetFilterResult(e: Filter) {
    if(e != null) {
      this.clientsData = e;
      this.LoadData();
    }
  }

  openDocument(path: OnlineDocModel) {
    this.nav.navigate(DocumentsPage, path);
  }

  loadDocumentPage(value: any) {
    if (value !== null) {
      let doc: OnlineDocModel = JSON.parse(value);
      if (doc !== null) {
        this.nav.navigate(DocumentsPage, doc);
      }
    }
  }

  toggelAddUpdateModal() {
    // if(this.openModal === 'showmodal')
    //   this.openModal = 'hide';
    // else
    //   this.openModal = 'showmodal';
    // $('#addupdateModal').modal(this.openModal)

  }

  filterRecords() {
    let searchQuery = "";
    let delimiter = "";

    if(this.clientDetails.ClientName !== null && this.clientDetails.ClientName !== "") {
        searchQuery += ` ClientName like '${this.clientDetails.ClientName}%'`;
        delimiter = "and";
      }

    if(this.clientDetails.Email !== null && this.clientDetails.Email !== "") {
      searchQuery += ` ${delimiter} Email like '%${this.clientDetails.Email}%' `;
        delimiter = "and";
    }
    if(this.clientDetails.PrimaryContactNo !== null && this.clientDetails.PrimaryContactNo !== 0) {
      searchQuery += ` ${delimiter} PrimaryPhoneNo like '%${this.clientDetails.PrimaryContactNo}%' `;
        delimiter = "and";
    }
    if(this.clientDetails.City !== null && this.clientDetails.City !== "") {
      searchQuery += ` ${delimiter} City like '${this.clientDetails.City}%' `;
        delimiter = "and";
    }
    if(this.clientDetails.FirstAddress !== null && this.clientDetails.FirstAddress !== "") {
      searchQuery += ` ${delimiter} FirstAddress like '${this.clientDetails.FirstAddress}%' `;
        delimiter = "and";
    }
    if(searchQuery !== "") {
      this.clientsData.SearchString = `1=1 And ${searchQuery}`;
    }

    this.LoadData();
  }

  globalFilter() {
    let searchQuery = "";
    searchQuery = ` ClientName like '${this.anyFilter}%' OR Email like '${this.anyFilter}%' OR PrimaryPhoneNo like '%${this.anyFilter}%' OR City like '${this.anyFilter}%'`;
    if(searchQuery !== "") {
      this.clientsData.SearchString = `1=1 And ${searchQuery}`;
    }
    this.LoadData();
  }

  resetFilter() {
    this.clientsData.SearchString = "1=1";
    this.clientsData.PageIndex = 1;
    this.clientsData.PageSize = 10;
    this.clientsData.StartIndex = 1;
    this.clientsData.EndIndex = (this.clientsData.PageSize * this.clientsData.PageIndex);
    this.LoadData();
    this.clientDetails.ClientName="";
    this.clientDetails.PrimaryContactNo = null;
    this.clientDetails.Email="";
    this.clientDetails.FirstAddress="";
    this.clientDetails.City="";
    this.anyFilter = "";
  }
}

export class OnlineDocModel {
  constructor(data: any) {
    this.DocumentId = data['DocumentId'];
    this.Title = data['Title'];
    this.Description = data['Description'];
    this.UserId = data['UserId'];
    this.DocPath = data['DocPath'];
    this.CreatedOn = data['CreatedOn'];
    this.UpdatedOn = data['UpdatedOn'];
  }
  DocumentId: number = 0;
  Title: string = null;
  Description: string = null;
  UserId: string = null;
  DocPath: string = null;
  TotalRows: number = 0;
  CreatedOn: string = null;
  UpdatedOn: string = null;
}

export class clientModel {
  ClientName: string = '';
  City: string = '';
  PrimaryContactNo: number = null;
  Email: string = '';
  FirstAddress: string = '';
  Total: number = 0;
}
