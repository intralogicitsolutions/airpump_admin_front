import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiCallService } from 'src/app/services/api-call.service';

@Component({
  selector: 'app-control-library',
  templateUrl: './control-library.component.html',
  styleUrls: ['./control-library.component.scss']
})
export class ControlLibraryComponent implements OnInit {

  constructor(private apiCallService: ApiCallService, private activatedRoute: ActivatedRoute) { }
  domainDetail: any;
  ngOnInit(): void {
    const frameworkId = this.activatedRoute.snapshot.paramMap.get('framework_id');
    console.log(frameworkId);
    this.getControlLibraryDomainData(frameworkId);
  }
  getControlLibraryDomainData(frameworkId: any) {
    this.apiCallService.getControlLibraryDomainDetails(frameworkId).subscribe((data: any) => {
      if (data.statusCode === 200) {
        console.log(data)
        this.domainDetail = data.data[0];
      }
    })
  }
  getUrl(image: any) {
    return image.image_url;
  }

}
