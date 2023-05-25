import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/services/api-call.service';

@Component({
  selector: 'app-frameworks',
  templateUrl: './frameworks.component.html',
  styleUrls: ['./frameworks.component.scss']
})
export class FrameworksComponent implements OnInit {

  constructor(private apiCallService: ApiCallService) { }
  frameworkData: any[] = [];
  authStatus = true;
  serviceErrorMsg = '';
  
  ngOnInit(): void {
    this.getFrameworkData();
  }
  getFrameworkData(): void {
    this.apiCallService.getFrameworkDetails().subscribe((data:any) => {
      console.log(data);
      if(data.statusCode === 200) {
        this.frameworkData = data.data;
      } else
	  {
		if (!data.auth)	{
			this.authStatus = false;
			this.serviceErrorMsg = data.message;
		}
	  }
    })
  }
}
