import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipInputEvent } from '@angular/material/chips';
import { ToastrService } from 'ngx-toastr';
import { ApiCallService } from 'src/app/services/api-call.service';
import { ActivatedRoute } from '@angular/router';
import { map, startWith, timeout } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MatSelectionList,
  MatSelectionListChange,
} from '@angular/material/list';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AssignResponsibleComponent } from 'src/app/modals/assign-responsible/assign-responsible.component';

declare var $: any;
@Component({
  selector: 'app-communications-security',
  templateUrl: './communications-security.component.html',
  styleUrls: ['./communications-security.component.scss'],
})
export class CommunicationsSecurityComponent {
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
  assignedUserData: any = [];
  bsModalRef!: BsModalRef;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private apiCallService: ApiCallService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}
  currentlyOpenedItemIndex = -1;
  @ViewChild('allSelected') allSelected!: MatSelectionList;
  @ViewChild('controlLibraryDetail') controlLibraryDetail: any;
  @ViewChild('searchInput') searchInput: any;
  @ViewChild('searchInput1') searchInput1: any;
  filteredOptions: any = [];
  filteredContributorOptions: any = [];
  assignForm!: FormGroup;
  userDetails: any = [];
  assignUserArray: any = [];
  contibuteUserArray: any = [];
  previousAssignedUser: any = [];
  markedNACount = 0;
  authStatus = true;
  serviceErrorMsg = '';

  openSnackBar() {
    this.getEvidence();
    $('#assignResponsibleModal').modal('show');
    // const frameworkId = this.activatedRoute.snapshot.paramMap.get('framework_id');
    // const domainId = this.activatedRoute.snapshot.paramMap.get('domain_id');
    // console.log(frameworkId, domainId);
    // const initialState: any = {
    //   frameworkId: frameworkId,

    // };
    // this.bsModalRef = this.modalService.show(AssignResponsibleComponent, { initialState });
    // this.bsModalRef.componentInstance.user = this.user;
  }
  getEvidence() {
    this.assignedUserData = [];
    console.log(this.selectedOptions);
    this.selectedOptions.map((option: any) => {
      this.apiCallService
        .getOperationalActivity(option._id, true)
        .subscribe((activity: any) => {
          console.log(activity);
          if (activity.statusCode === 200) {
            console.log(activity);
            activity.data.map((ele: any) => {
              this.assignedUserData.push(ele);
            });
          }
        });
    });
  }
  showSuccess() {
    $('#assignResponsibleModal').modal('hide');
    this.toastr.success(
      'The responsibles will be notified by email containing necessary instructions..',
      'The action were successfully assigned.',
      { closeButton: true }
    );
  }
  ngOnInit(): void {
    this.getChapterDetails();
    this.assignForm = this.fb.group({
      assignUser: [''],
      contibuteUser: [''],
    });
    const body = { search: '' };
    this.getUserList(body);
    this.filteredOptions = this.assignForm['controls'][
      'assignUser'
    ].valueChanges.pipe(
      startWith(''),
      map((subactivity: string | null) =>
        subactivity ? this._filter(subactivity) : this.userDetails.slice()
      )
    );
    console.log(this.filteredOptions);
    this.filteredContributorOptions = this.assignForm['controls'][
      'contibuteUser'
    ].valueChanges.pipe(
      startWith(''),
      map((subactivity: string | null) =>
        subactivity ? this._filter(subactivity) : this.userDetails.slice()
      )
    );
    this.cdr.detectChanges();
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
    const filterValue = name?.first_name
      ? name.first_name.toLowerCase()
      : name.toLowerCase();
    console.log(filterValue);
    return this.userDetails.filter(
      (subactivity: any) =>
        subactivity?.first_name.toLowerCase()?.indexOf(filterValue) !== -1
    );
  }

  onChange(options: any): void {
    console.log(options);
    this.selectedOptions = [];
    this.markedNACount = 0;

    // if (options.length > 0) {
    this.controlLibraryActionDetails = [];
    const controlId = options._id;
    const domainId = options.control_library_domain_id;
    const chapterId = options.control_library_chapter_id;
    if (options.status === 0) {
      this.onChangeControlLine(options);
      this.selectedControlOptions.push(options);
      this.cdr.detectChanges();
    }
    this.apiCallService
      .getControlLibraryActionDetails(chapterId, domainId, controlId)
      .subscribe((data: any) => {
        if (data.statusCode === 200 && data.data.length !== 0) {
          console.log(data);
          $('#assignActionsModal').modal('show');
          this.controlLibraryActionDetails = data.data[0];
          this.controlLibraryActionDetails.action_library.map((action: any) => {
            if (action.status === 1) {
              this.selectedOptions.push(action);
            }
            if (action.is_deleted) {
              this.markedNACount = this.markedNACount + 1;
            }
          });
          this.previousAssignedUser =
            this.controlLibraryActionDetails.action_library;
          if (this.controlLibraryActionDetails.description.length > 100) {
            this.readMore = true;
            this.lengthFlag = false;
          } else {
            this.readMore = false;
            this.lengthFlag = true;
          }
        } else {
          $('#assignActionsModal').modal('show');
          this.controlLibraryActionDetails = [];
        }
      });
    // }
  }

  onChangeControlLine(change: any) {
    console.log(change, this.selectedControlOptions);
    // console.log(change.option.value,change);
    // console.log(change.option.selected);

    if (change.status === 1) {
      change['status'] = 0;
    } else {
      change['status'] = 1;
    }
    this.apiCallService
      .updateControlLibraryControl(change)
      .subscribe((response) => {
        console.log(response, this.selectedControlOptions.indexOf(change));
        this.controlLibraryDetails.splice(
          this.controlLibraryDetails.indexOf(change),
          1,
          change
        );
      });
  }

  addAssignUser() {
    this.assignUserArray = [];
    this.assignUserArray.push(this.assignForm['controls']['assignUser'].value);
    this.assignForm['controls']['assignUser'].setValue(null);
    this.assignForm['controls']['assignUser'].updateValueAndValidity();
    this.searchInput.nativeElement.value = '';
  }
  removeAssignUser(user: any) {
    const index = this.assignUserArray.indexOf(user);

    if (index >= 0) {
      this.assignUserArray.splice(index, 1);
    }
  }
  addContributeUser() {
    // this.contibuteUserArray = []
    if (
      this.contibuteUserArray.indexOf(
        this.assignForm['controls']['contibuteUser'].value
      ) === -1
    ) {
      this.contibuteUserArray.push(
        this.assignForm['controls']['contibuteUser'].value
      );
      this.assignForm['controls']['contibuteUser'].setValue(null);
      this.assignForm['controls']['contibuteUser'].updateValueAndValidity();
    }
    this.searchInput1.nativeElement.value = '';
  }
  removeContributeUser(user: any) {
    const index = this.contibuteUserArray.indexOf(user);

    if (index >= 0) {
      this.contibuteUserArray.splice(index, 1);
    }
  }
  getChapterDetails() {
    const frameworkId =
      this.activatedRoute.snapshot.paramMap.get('framework_id');
    const domainId = this.activatedRoute.snapshot.paramMap.get('domain_id');
    console.log(frameworkId, domainId);
    this.apiCallService
      .getControlLibraryChapterDetails(frameworkId, domainId)
      .subscribe((data: any) => {
        if (data.statusCode === 200) {
          // console.log(data);
          this.controlLibraryChapterData = data.data[0];
        } else {
          if (!data.data.auth) {
            this.authStatus = false;
            this.serviceErrorMsg = data.data.message;
          }
        }
      });
  }
  setOpened(chapter: any, itemIndex: any) {
    this.currentlyOpenedItemIndex = itemIndex;
    const domainId = this.activatedRoute.snapshot.paramMap.get('domain_id');
    this.selectedControlOptions = [];
    this.apiCallService
      .getControlLibraryDetails(chapter._id, domainId)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          console.log(response);
          this.controlLibraryDetails = response.data;

          this.controlLibraryDetails.map((action: any) => {
            if (action.status === 1) {
              this.selectedControlOptions.push(action);
            }
          });
          console.log('selected Array: ', this.selectedControlOptions);
        }
      });
  }

  setClosed(itemIndex: any) {
    if (this.currentlyOpenedItemIndex === itemIndex) {
      this.currentlyOpenedItemIndex = -1;
    }
  }
  closeModal() {
    $('#assignActionsModal').modal('hide');
    // this.controlLibraryDetail.deselectAll();
  }

  onActionSelectionChange(change: MatSelectionListChange) {
    console.log(change.option.value, change.option.selected);
    if (change.option.selected) {
      change.option.value['status'] = 1;
    } else {
      change.option.value['status'] = 0;
    }
  }

  changeSelection(event: any) {
    console.log(event);
    if (event.checked) {
      this.controlLibraryActionDetails.action_library.map((ele: any) => {
        ele['status'] = 1;
      });
      this.allSelected.selectAll();
    } else {
      this.selectedOptions = [];
    }
  }

  onControlSelectionChange(change: MatSelectionListChange) {
    console.log(change.option.value, change.option.selected);
    if (change.option.selected) {
      change.option.value['status'] = 1;
    } else {
      change.option.value['status'] = 0;
    }
  }

  async submitAssignUser() {
    console.log(
      this.assignForm,
      this.selectedOptions,
      this.previousAssignedUser
    );
    if (this.assignForm.valid) {
      await this.previousAssignedUser.map((ele: any) => {
        if (ele['is_deleted'] === true) {
          return;
        } else {
          if (ele['status'] === 1) {
            // Only update the selected lines
            ele['is_assigned'] = true;
            ele['status'] = 0;
            this.apiCallService
              .updateControlLibraryAction(ele)
              .subscribe((response) => {
                console.log(response);
                // this.userDetails = response;
              });
          }
        }
      });
      await this.selectedOptions.map(async (ele: any) => {
        if (ele['is_deleted'] === true) {
          this.toastr.error(
            ele['title'] + ' is not allowed. As it is deleted.'
          );
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
              description: ele.description || ' ',
              created_by: parsedData.data._id,
              modified_by: parsedData.data._id,
            };
            console.log(json);
            this.apiCallService
              .assignControlLibraryAction(json)
              .subscribe((data: any) => {
                console.log(data);
                if (data.message) {
                  this.toastr.error(data.message);
                } else {
                  this.showSuccess();
                  this.closeModal();
                }
              });
          });
        }
      });
    }
  }

  getUserList(body: any) {
    this.apiCallService.searchUser(body).subscribe((response) => {
      console.log(response);
      this.userDetails = response;
    });
  }

  markAsNA() {
    console.log(this.selectedOptions);
    this.selectedOptions.map((ele: any) => {
      if (ele['is_assigned'] === true) {
        this.toastr.error(
          ele['title'] +
            ' is already assigned to contributor. It cannot be marked as N/A'
        );
      } else {
        if (ele['is_deleted'] === false && ele['status'] === 1) {
          ele['is_deleted'] = true;
          ele['status'] = 0;
          this.markedNACount = this.markedNACount + 1;
        } else if (ele['is_deleted'] === true && ele['status'] === 1) {
          ele['is_deleted'] = false;
          ele['status'] = 0;
          this.markedNACount = this.markedNACount - 1;
        }

        this.apiCallService
          .updateControlLibraryAction(ele)
          .subscribe((response) => {
            console.log(response);
            // this.userDetails = response;
          });
      }
    });
  }
}
