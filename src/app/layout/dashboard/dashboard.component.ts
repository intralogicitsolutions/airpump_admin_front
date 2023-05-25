import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/services/api-call.service';
import { Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dashboardData: any;
  dashboardAggregatedData: any;
  authStatus: boolean = true;
  tab: any;
  
  constructor(private apiCallService: ApiCallService, private route: Router, private activatedRoute: ActivatedRoute) { 
    const userData: any = localStorage.getItem('user');
    const parsedData = JSON.parse(userData);
	if (parsedData.data.access_rights === 'ENDUSER') this.authStatus = false;
  }

  ngOnInit(): void {
    
	if (this.authStatus) {
		this.getDashboardAggregatedData();
		this.getDashboardData(); //Send only for the sign off state
	} else {
		this.getDashboardData();
	}
	
	this.activatedRoute.queryParams.subscribe((params) => {
		if (params?.['tab']) {
			this.tab = params?.['tab'];
			this.route.navigate([], {
				queryParams: {
				tab: null,
				},
				queryParamsHandling: 'merge',
			});
		}
	});
  }
  
  getDashboardData(): void {
    this.apiCallService.getDashboardDetails().subscribe((data:any) => {
      // console.log(data);
      if(data.statusCode === 200) {
        this.dashboardData = data.data;
      }
    })
  }  
  
  getDashboardAggregatedData(): void {
    this.apiCallService.getDashboardDetailsAggregated().subscribe((data:any) => {
      // console.log(data);
      if(data.statusCode === 200) {
        this.dashboardAggregatedData = data.data;
		// console.log('this.dashboardAggregatedData', this.dashboardAggregatedData);
      }
    })
  }
}
