export const Login = "login";
export const Initialpage = "initialpage";
export const Users = "users";
export const Sales = "sales";
export const Setting = "setting";
export const JsonFormatter = "jsonformatter";
export const TableSampleData = "tablesampledata";
export const Home = "home";
export const GraphicsDb = "graphicsdb";
export const FeedBack = "feedbacks";
export const SamplePage = "samplepage";

export const UploadScript = "uploadscript";
export const UserProfile = "userprofile";
export const CodeGenerator = "codegenerator";
export const LiveUrl = "liveurl";
export const ApiKey = "AIzaSyAkFANPvmh1x_ajxADulhWiPcsNJHqw1Hs";
export const AccessTokenExpiredOn = "access_token_expired_on";
export const ProjectName = "onlinedatabuilder";
export const ServerError = 500;
export const BadRequest = 400;
export const Success = 200;
export const UnAuthorize = 401;
export const NotFound = 404;
export const Forbidden = 403;
export const AccessToken = ProjectName + "_access_token";
export const Authorization = "Authorization";
export const Master = ProjectName + "_master";
export const UserDetailName = ProjectName + "_UserDetail";
export const DocumentPathName = "documents";
export const UserPathName = "User";
export const ProfileImage = "profile";
export const InsertOrUpdateSuccessfull = "Inserted/Updated successfully";

export enum FileSystemType {
  User = 1,
  Bills = 2
}


// ********************** API route pages  *******************

export const Blogs = "api/blogs";
export const Article = "api/blogs/article/:articleid";


// ********************** Admin route pages  *******************

export const Employees = "admin/employees";
export const Dashboard = "admin/dashboard";
export const Documents = "admin/documents";
export const DocumentsPage = "admin/documentspage/:path";
export const BuildPdf = "admin/generatebill";
export const ManageEmployee = 'admin/employees/manageemployee';
export const Clients = 'admin/clients';
export const RegisterClient = 'admin/clients/registerclient';
export const Files = 'admin/files';
export const Resume = 'admin/resumes';
export const SideMenu = 'admin/sidemenu';
export const BillDetail = 'admin/billdetail';
export const Profile = 'admin/profile';
export const Recent = 'admin/recent';
export const Roles = 'admin/roles';
export const Companies = 'admin/Companies';
export const CreateResume = 'admin/CreateResume';
export const Recruiter = 'admin/Recruiter';
export const Attendance = 'admin/attendance';
export const Leave = 'admin/leave'
export const Timesheet = 'admin/timesheet';
export const AdminSummary = "admin/summary";
export const AdminDeclaration = "admin/declaration";
export const AdminSalary = "admin/salary";
export const AdminPreferences = "admin/preferences";
export const AdminPreviousIncome = 'admin/declaration/previousincome';
export const AdminForm12B = 'admin/declaration/form12b';
export const AdminFreeTaxFilling = 'admin/declaration/freetaxfilling';
export const AdminDeclarationApprovalRule = 'admin/declaration/declarationapprovalrule';
export const AdminTaxcalculation = 'admin/taxcalculation';
export const SalaryComponentStructure = 'admin/payrollsettings/salarycomponentstructure';
export const CustomSalaryStructure = 'admin/payrollsettings/customsalarystructure';
export const AdminResetPassword = 'admin/resetpassword';
export const AdminIncomeTax = 'admin/salary/incometax';
export const AdminPaySlip = 'admin/salary/payslip';
export const AdminNotification = 'admin/notification';
export const PayrollComponents = 'admin/payrollcomponents';
export const AdminApprovalRequest = 'admin/request';
export const PayrollSettings = 'admin/payrollsettings';
export const CompanyInfo = 'admin/payrollsettings/company-info';
export const CompanySettings = 'admin/payrollsettings/company-settings';
export const Payroll = 'admin/payrollsettings/payroll';
export const PFESISetup = 'admin/payrollsettings/pfesisetup';
export const Expenses = 'admin/expenses';
export const ManageLeavePlan = 'admin/leave/manageleaveplan';
export const ManageYearEnding = 'admin/manageyearending';
export const SalaryBreakup = 'admin/employees/alarybreakup';
export const EmailService = 'admin/email';
export const OrganizationSetting = 'admin/organization-setting';
export const Holiday = 'admin/planholidays';
export const Project = 'admin/project';
export const EmailSetting = 'admin/emailsetting';
export const EmailLinkConfig = 'admin/emaillinkconfig';
export const Company = 'admin/companysettings';
export const ProjectWiki = 'admin/project/wiki';
export const ProjectList = 'admin/project';
export const ManageProject = 'admin/manage-project';
export const EmailTemplate = 'admin/emailtemplate';
export const ManageEmailTemplate = 'admin/emailtemplate/manageemailtemplate';
export const EmployeePerformance = 'admin/employees/employeeperformance';
export const TaxRegime = 'admin/taxregime';
export const CompanyLogo = 'admin/companylogo';
export const Annexure = 'admin/annexure';
export const OfferLetter = 'admin/offerletter';
export const EmailConfiguration = 'admin/emailconfiguration';
export const ServiceRequest = 'admin/servicerequest';
export const Products = 'admin/products';
export const ManageShift = 'admin/manageshift';
export const WorkFlow = 'admin/workflow';
export const ManageWorkFlow = 'admin/manageworkflow';

// ********************** Admin route pages  *******************

export const UserDashboard = "user/dashboard";
export const UserAttendance = "user/attendance";
export const UserProfilePage = "user/profile";
export const UserTimesheet = "user/timesheet";
export const Summary = "user/summary";
export const Declaration = "user/declaration";
export const Salary = "user/salary";
export const Preferences = "user/preferences";
export const UserLeave = 'user/leave';
export const PreviousIncome = 'user/previousincome';
export const Form12B = 'user/form12b';
export const FreeTaxFilling = 'user/freetaxfilling';
export const TaxSavingInvestment = 'user/taxsavinginvestment';
export const PaySlip = 'user/payslip';
export const IncomeTax = 'user/incometax';
export const Taxcalculation = 'user/taxcalculation';
export const ResetPassword = 'user/resetpassword';
export const Notification = 'user/notification';
export const ApprovalRequest = 'user/request';
export const UserHoliday = 'user/planholidays';
export const UserProjectList = 'user/project';

// *************************** file name constancts  *************
export const Doc = "doc";
export const Docx = "docx";
export const ADocx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
export const Pdf = "pdf";
export const APdf = "application/pdf";
export const Txt = "txt";
export const FlatFile = "file";
export const Zip = "zip";
export const Excel = "xlsx";
export const Ppt = "ppt";
export const Directory = "";
export const JImage = 'jpg';
export const PImage = 'png';
export const AImage = "jpeg";

export const DocImg = "assets/ext/doc.png";
export const PdfImg = "assets/ext/pdf.png";
export const TxtImg = "assets/ext/txt.png";
export const FlatFileImg = "assets/ext/file.png";
export const ZipImg = "assets/ext/zip.jpg";
export const ExcelImg = "assets/ext/excel.png";
export const PptImg = "assets/ext/ppt.jpg";
export const DirectoryImg = "assets/ext/directory.jpg";
export const Images = "assets/ext/image.png";
export const DocumentPath = "Documents";
export const UserPath = "User";
export const UserImage = "assets/images/faces/face.jpg";
export const OrgLogo = "assets/images/organization-logo.jpg"


export class API {
  public static GETEMPLOYEEBYFILTER: string = "employee/GetEmployees";
}


export const MaxAllowedFileSize = 2048

export enum UserType {
  Admin = 1,
  Employee = 2,
  Candidate = 3,
  Client = 4,
  Other = 5,
  Compnay = 6
}

export enum ItemStatus
{
    Completed = 1,
    Pending = 2,
    Canceled = 3,
    NotGenerated = 4,
    Rejected = 5,
    Generated = 6,
    Raised = 7,
    Submitted = 8,
    Approved = 9,
    ReAssigned = 10
}

class FileRoleType
{
    PrimaryLogo = "Company Primary Logo";
    CompanyLogo = "Company Logo";
    OtherFile = "Other File";
}
