import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {

  transform(items: any, invert?: boolean, select?: any, propName?: any): any {
    if (items === undefined || items === null) return items;
	else {
		if (select !== 'All'){
			if (!invert)
				return select ? items.filter((item : any) => item[propName] === select) : items;
			else 
				return select ? items.filter((item : any) => item[propName] != select) : items;
	} 	else {
			return items;
	}
	}
  }
}
