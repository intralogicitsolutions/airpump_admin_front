import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipInputEvent } from '@angular/material/chips';
import { ToastrService } from 'ngx-toastr';
import { ApiCallService } from 'src/app/services/api-call.service';
import { ActivatedRoute } from '@angular/router';
import { map, startWith, timeout } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectionListChange } from '@angular/material/list';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-assign-responsible',
  templateUrl: './assign-responsible.component.html',
  styleUrls: ['./assign-responsible.component.scss']
})
export class AssignResponsibleComponent {


  items: any = [];
  subItems: any = [];
  expandedIndex = 0;
  selectedOptions: any = [];
  selectedControlOptions: any = [];
  selectable = true;
  removable = true;
  addOnBlur = true;
  snackBarRef: any;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  fruits: any = [];
  controlLibraryChapterData: any;
  controlLibraryDetails: any;
  panelOpenState = false;
  controlLibraryActionDetails: any;
  readMore: boolean = false;
  lengthFlag: boolean = false;
  assignedUserData: any = []
  currentlyOpenedItemIndex = -1;
  // @ViewChild('controlLibraryDetail') controlLibraryDetail: any;
  @ViewChild('searchInput') searchInput: any;
  @ViewChild('searchInput1') searchInput1: any;
  filteredOptions: any = [];
  filteredContributorOptions: any = []
  assignForm: FormGroup = new FormGroup({});
  userDetails: any = [];
  assignUserArray: any = [];
  contibuteUserArray: any = [];
  previousAssignedUser: any = [];
  markedNACount = 0;
  authStatus = true;
  serviceErrorMsg = '';

  constructor(private fb: FormBuilder, public bsModalRef: BsModalRef,
    public options: ModalOptions,
    private toastr: ToastrService, private apiCallService: ApiCallService, private activatedRoute: ActivatedRoute, private cdr: ChangeDetectorRef) { }


  ngOnInit() {
    console.log(this.options.initialState);
    this.getEvidence()
    this.assignForm = this.fb.group({
      assignUser: [''],
      contibuteUser: ['']
    })
    console.log(this.assignForm)
    // this.cdr.detectChanges();
    const body = { "search": "" }
    this.getUserList(body)
    console.log(this.assignForm['controls']['assignUser'].valueChanges)
    this.filteredOptions = this.assignForm['controls']['assignUser'].valueChanges.pipe(
      startWith(''),
      map((subactivity: string | null) => (subactivity ? this._filter(subactivity) : this.userDetails.slice())),
    );
    console.log(this.filteredOptions)
    this.filteredContributorOptions = this.assignForm['controls']['contibuteUser'].valueChanges.pipe(
      startWith(''),
      map((subactivity: string | null) => (subactivity ? this._filter(subactivity) : this.userDetails.slice())),
    );
    this.cdr.detectChanges()
  }
  getEvidence() {
    this.assignedUserData = []
    console.log(this.selectedOptions)
    let selectedOptions: any = this.options.initialState ? this.options.initialState['selectedOptions'] : [];
    selectedOptions.map((option: any) => {
      this.apiCallService.getOperationalActivity(option.control_library_control_action_id, true).subscribe((activity: any) => {
        console.log(activity)
        if (activity.statusCode === 200) {
          console.log(activity);
          activity.data.map((ele: any) => {
            this.assignedUserData.push(ele)
          })
        }
      })
    })
  }
  showSuccess() {
    this.bsModalRef.hide()
    this.toastr.success('The responsibles will be notified by email containing necessary instructions..', 'The action were successfully assigned.', { closeButton: true });
  }
  displayFn(user: any) {
    let displayValue: any;
    if (Array.isArray(user)) {
      user.forEach((user, index) => {
        if (index === 0) {
          displayValue = user.first_name + ' ' + user.last_name;
        } else {
          displayValue += ', ' + user.first_name + ' ' + user.last_name;
        }
      });
    }
    return displayValue;
  }
  private _filter(name: any): string[] {
    console.log(name);
    const filterValue = name?.first_name ? name.first_name.toLowerCase() : name.toLowerCase();
    console.log(filterValue);
    return this.userDetails.filter((subactivity: any) => subactivity?.first_name.toLowerCase()?.indexOf(filterValue) !== -1);
  }


  addAssignUser() {
    this.assignUserArray = []
    this.assignUserArray.push(this.assignForm['controls']['assignUser'].value);
    this.assignForm['controls']['assignUser'].setValue(null);
    this.assignForm['controls']['assignUser'].updateValueAndValidity();
    this.searchInput.nativeElement.value = ''
  }
  removeAssignUser(user: any) {
    const index = this.assignUserArray.indexOf(user);

    if (index >= 0) {
      this.assignUserArray.splice(index, 1);
    }
  }
  addContributeUser() {
    // this.contibuteUserArray = []
    if (this.contibuteUserArray.indexOf(this.assignForm['controls']['contibuteUser'].value) === -1) {
      this.contibuteUserArray.push(this.assignForm['controls']['contibuteUser'].value);
      this.assignForm['controls']['contibuteUser'].setValue(null);
      this.assignForm['controls']['contibuteUser'].updateValueAndValidity();
    }
    this.searchInput1.nativeElement.value = ''
  }
  removeContributeUser(user: any) {
    const index = this.contibuteUserArray.indexOf(user);

    if (index >= 0) {
      this.contibuteUserArray.splice(index, 1);
    }
  }
  async submitAssignUser() {
    console.log(this.assignForm, this.selectedOptions, this.previousAssignedUser)
    if (this.assignForm.valid) {
      await this.previousAssignedUser.map((ele: any) => {
        if (ele['is_deleted'] === true) {
          return;
        } else {
          if (ele['status'] === 1) // Only update the selected lines
          {
            ele['is_assigned'] = true;
            ele['status'] = 0;
            this.apiCallService.updateControlLibraryAction(ele).subscribe((response) => {
              console.log(response);
              // this.userDetails = response;
            })
          }
        }
      });
      await this.selectedOptions.map(async (ele: any) => {
        if (ele['is_deleted'] === true) {
          this.toastr.error(ele['title'] + ' is not allowed. As it is deleted.');
          return;
        } else {
          const userData: any = localStorage.getItem('user');
          const parsedData = JSON.parse(userData);
          await this.contibuteUserArray.map((user: any) => {
            const json = {
              control_library_control_action_id: ele._id,
              control_action_id: ele.Id,
              title: ele.title,
              assigned_to_user_id: user._id,
              supervised_by_user_id: this.assignUserArray[0]['_id'],
              description: ele.description || " ",
              created_by: parsedData.data._id,
              modified_by: parsedData.data._id
            }
            console.log(json)
            this.apiCallService.assignControlLibraryAction(json).subscribe((data: any) => {
              console.log(data)
              if (data.message) {
                this.toastr.error(data.message);
              } else {
                this.showSuccess()
                this.bsModalRef.hide();
              }

            })
          })
        }
      })
    }
  }

  getUserList(body: any) {
    this.apiCallService.searchUser(body).subscribe((response) => {
      console.log(response);
      this.userDetails = response;
    })
  }
  closeModal() {
    this.bsModalRef.hide();
  }

}
