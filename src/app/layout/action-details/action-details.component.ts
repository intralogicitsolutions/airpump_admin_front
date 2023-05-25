import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCallService } from 'src/app/services/api-call.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { AssignResponsibleComponent } from 'src/app/modals/assign-responsible/assign-responsible.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map, startWith } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-action-details',
  templateUrl: './action-details.component.html',
  styleUrls: ['./action-details.component.scss']
})
export class ActionDetailsComponent implements OnInit {
  activityData: any;
  comment: any;
  commentFlag: boolean = false;
  readMore: boolean = false;
  lengthFlag: boolean = false;
  serverUrl = environment.apiRoot;
  authStatus: boolean = true;
  tab: any;
  bsModalRef!: BsModalRef;
  assignForm!: FormGroup;
  userDetails: any = [];
  @ViewChild('searchInput') searchInput: any;
  @ViewChild('searchInput1') searchInput1: any;
  filteredOptions: any = [];
  filteredContributorOptions: any = []
  assignUserArray: any = [];
  contibuteUserArray: any = [];
  previousAssignedUser: any = [];
  markedNACount = 0;
  serviceErrorMsg = '';
  selectedOptions: any = [];
  assignedUserData: any = []
  selectable = true;
  removable = true;
  addOnBlur = true;
  stateMachine: any = {
	"Not Started": "Start Working",
	"Work Started": "Sign Off", 
	"Sign Off": "Sign", 
	"Signed": "Done"
  };
  user_rights = '';
  button_disabled: boolean = false;
  action_signed: boolean = false;

  
  constructor(private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private apiCallService: ApiCallService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService) {
		
    const userData: any = localStorage.getItem('user');
    const parsedData = JSON.parse(userData);
    if (parsedData.data.access_rights != 'ADMIN') this.authStatus = false;
	this.user_rights = parsedData.data.access_rights;

    // console.log(this.authStatus);
    // console.log(parsedData.data.access_rights);
  }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe((params) => {
      if (params?.['tab']) {
        this.tab = params?.['tab'];
        this.router.navigate([], {
          queryParams: {
            tab: null,
          },
          queryParamsHandling: 'merge',
        });
      }
    });

    this.getActionDetails();
    this.assignForm = this.fb.group({
      assignUser: [''],
      contibuteUser: ['']
    })
    // console.log(this.assignForm)
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
  
  getActionDetails() {

    const id = this.activatedRoute.snapshot.paramMap.get('action_id');
    // console.log(id)
    this.apiCallService.getOperationalActivity(id).subscribe((activity: any) => {
      console.log(activity)
      if (activity.statusCode === 200) {
        this.activityData = activity.data[0];
        // this.getAssignedUserData();
        this.selectedOptions.push(this.activityData)
        if (this.activityData.description.length > 100) {
          this.readMore = true;
          this.lengthFlag = false;
        } else {
          this.readMore = false;
          this.lengthFlag = true;
        }
		this.setActionStatus();
      }
    });
  }
  
  setActionStatus() {
	  
	  if (this.activityData.state !== 'Signed') {
		  if (this.user_rights === 'ENDUSER' && this.activityData.state === 'Sign Off') {
			  this.button_disabled = true;
		  }
		  else {
			  this.button_disabled = false;
		  }
	  } 
	  else {
		  this.action_signed = true;
	  }
  }
  
  getAssignedUserData() {
    this.assignedUserData = []
    const id = this.activatedRoute.snapshot.paramMap.get('action_id');
    console.log(id)
    this.apiCallService.getOperationalActivity(this.activityData?.control_library_control_action_id, true).subscribe((activity: any) => {
      console.log(activity)
      if (activity.statusCode === 200) {
        activity.data.map((ele: any) => {
          this.assignedUserData.push(ele)
        })
      }
    })
  }
  
  getDateFormat(date: any) {
    return moment(date).format('YYYY-MM-DD')
  }
  addComment() {
    this.commentFlag = true;
  }
  addCommentData() {
    let commentData = this.comment.trim();
    // if (this.comment !== undefined && this.comment !== '' && this.comment !== null) {
    if (commentData !== undefined && commentData !== '' && commentData !== null) {
      const userData: any = localStorage.getItem('user');
      const parsedData = JSON.parse(userData);
      const id = this.activatedRoute.snapshot.paramMap.get('action_id');
      const json = {
        comment_text: commentData,
        comment_user_id: parsedData.data._id,
        comment_user_name: parsedData.data.first_name + ' ' + parsedData.data.last_name,
      }
      console.log(this.activityData)
      if (this.activityData.comments?.length > 0) {
        this.activityData.comments?.splice(0, 0, json);
      } else {
        this.activityData['comments'] = []
        this.activityData.comments?.push(json);
      }
      const body = {
        _id: id,
        comments: this.activityData.comments
      }
      console.log(body)
      this.apiCallService.updateComments(body).subscribe((res: any) => {
        console.log(res);
        if (res.statusCode === 200) {
          this.comment = '';
          this.getActionDetails();
        }
      });
    }
  }
  get sortByLastModifiedDesc() {
    return this.activityData?.comments?.sort((a: any, b: any) => {
      return <any>new Date(b.comment_timestamp) - <any>new Date(a.comment_timestamp);
    });
  }
  uploadEvidence(event: any) {
    console.log(event)
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const size: any = (file.size / 1024 / 1024).toFixed(2);
      if (size <= 2) {
        this.uploadFile(file);
        event.target.value = '';

      }
      else {
        this.toastr.error('Can\'t upload big files more than 2mb', '', { closeButton: true });
      }
    }
  }
  uploadFile(file: any) {
    const id: any = this.activatedRoute.snapshot.paramMap.get('action_id');
    console.log(id)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', id);
    formData.append('name', file.name)
    console.log(formData, file)
    this.apiCallService.uploadEvidence(formData).subscribe((response: any) => {
      if (response.statusCode === 200) {
        file = ''
        this.getActionDetails();
      }
    })
  }
  navigatetoDoc(evidence: any) {
    window.open(this.serverUrl + '/' + evidence.evidence_location, '_blank');
  }
  openSnackBar() {
    this.getAssignedUserData()
    $('#assignResponsibleModal').modal('show');

  }
  showSuccess() {
    $('#assignResponsibleModal').modal('hide');
    this.toastr.success('The responsibles will be notified by email containing necessary instructions..', 'The action were successfully assigned.', { closeButton: true });
  }
  // addAssignUser() {
  //   // this.activityData['_id']
  //   const initialState: any = {
  //     selectedOptions: [this.activityData]
  //   };
  //   this.bsModalRef = this.modalService.show(AssignResponsibleComponent, { initialState });
  // }
  getUserList(body: any) {
    this.apiCallService.searchUser(body).subscribe((response) => {
      console.log(response);
      this.userDetails = response;
    })
  }
  // showSuccess() {
  //   this.bsModalRef.hide()
  //   this.toastr.success('The responsibles will be notified by email containing necessary instructions..', 'The action were successfully assigned.', { closeButton: true });
  // }
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
    const filterValue = name?.first_name ? name.first_name.toLowerCase() : name.toLowerCase();
    return this.userDetails.filter((subactivity: any) => subactivity?.first_name.toLowerCase()?.indexOf(filterValue) !== -1);
  }

  // addAssignUser() {
    // this.assignUserArray = []
    // this.assignUserArray.push(this.assignForm['controls']['assignUser'].value);
    // this.assignForm['controls']['assignUser'].setValue(null);
    // this.assignForm['controls']['assignUser'].updateValueAndValidity();
    // this.searchInput.nativeElement.value = ''
  // }
  // removeAssignUser(user: any) {
    // const index = this.assignUserArray.indexOf(user);

    // if (index >= 0) {
      // this.assignUserArray.splice(index, 1);
    // }
  // }
  
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
              control_library_control_action_id: ele.control_library_control_action_id,
              control_action_id: ele.control_action_id,
              title: ele.title,
              assigned_to_user_id: user._id,
              // supervised_by_user_id: this.assignUserArray[0]['_id'],
              supervised_by_user_id: parsedData.data._id,
              description: ele.description || " ",
              created_by: parsedData.data._id,
              modified_by: parsedData.data._id
            }
            // console.log(json)
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

  updateActionDetailsStatus() {
	  
	  let success: boolean = true;
	  
	  if (this.activityData.state == "Not Started") {
		  this.activityData.state = "Work Started"
	  } else if(this.activityData.state == "Work Started") {
		  if(this.activityData.evidence.length > 0) {
			  this.activityData.state = "Sign Off"
		  }
		  else {
			this.toastr.error('You need to add evidence before you can set to sign off.');
			success = false;
			return;
		  }
	  } else if(this.activityData.state == "Sign Off") {
		  this.activityData.state = "Signed"
	  } else {
		  this.activityData.state = "Not Started"
	  }
	  	
	if(success) {
		this.apiCallService.updateActivityDetailsState(this.activityData).subscribe((activity: any) => {
		  console.log(activity)
		  if (activity.statusCode === 200) {
			this.getActionDetails();
		  }
		});
	}
  }
}
