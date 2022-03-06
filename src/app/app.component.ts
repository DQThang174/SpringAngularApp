import {Component, OnInit} from '@angular/core';
import {Employee} from "./employee";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {EmployeeService} from "./employee.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'employeemanagerapp';
  fromGourp!: FormGroup;
  public employees!: Employee[];
  editEmployee!: Employee;
  deleteEmployeeId!: Employee;

  constructor(private employeeService: EmployeeService,
              private fb: FormBuilder) {
    this.fromGourp = this.fb.group({
      name: [null],
      email: [null, [Validators.required]],
      jobTitle: [null],
      phone:[null],
      imageUrl:[null]
    })
  }

  public getEmployees():void{
    this.employeeService.Employees().subscribe(
      (response: Employee[]) =>{
      this.employees = response;
    },
      (error : HttpErrorResponse) => {
        alert(error.message)
      });
  }

  ngOnInit(): void {
    this.getEmployees();
    console.log('editemployee', this.editEmployee)
  }

  // kiểm tra và chuyển nó thành chữ thường = -1 là tìm thấy được giá trị
  public searchEmployee(key:string): void{
    const results: Employee[] = [];
    for (const employee of this.employees){
      if(employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1){
        results.push(employee)
      }
    }
    this.employees = results
    if(results.length == 0 || !key){
      this.getEmployees()
    }
  }

  // sử dụng main container tiện cho việc mở modal tổng trong giao diện
  public onOpenModal(employee: Employee, mode: string) : void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle','modal')
    if (mode === 'update'){
      this.editEmployee = employee
      button.setAttribute('data-target','#updateEmployeeModal')
    }
    if (mode === 'delete'){
      this.deleteEmployeeId = employee
      button.setAttribute('data-target','#deleteEmployeeModal')
    }
    container?.appendChild(button);
    button.click()
  }

  onAddEmployee(addForm: NgForm): void {
    this.employeeService.addEmployees(addForm.value).subscribe(
      (response: Employee)=>{
        console.log(response);
        this.getEmployees();
        addForm.reset()
      },
      (error : HttpErrorResponse) =>{
        alert(error.message);
        addForm.reset()
      }
    );
  }

  updateEmployee(employee: Employee): void {
    this.employeeService.updateEmployees(employee).subscribe(
      (response:Employee)=>{
        console.log(response)
        this.getEmployees()
      },
      (error :HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }

  deleteEmployee(employeeId: any): void {
    this.employeeService.deleteEmployees(employeeId).subscribe(
      (response: void)=>{
        console.log(response)
        this.getEmployees()
      },
      (error: HttpErrorResponse)=>{
        alert(error.message);
      }
    )
  }
}
