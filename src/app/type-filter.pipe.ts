import { Pipe, PipeTransform } from '@angular/core';
import { Tranche, TYPE } from './model/Trajet';

@Pipe({
  name: 'type',
  pure: false
})
export class TypeFilterPipe implements PipeTransform {

  transform(items: Tranche[], type: string): Tranche[] {
    if (!items || !type) {
      return items;
    }
    // filter items array, items which match and return true will be kept, false will be filtered out
    return items.filter((item: Tranche) => item.typePalette.code === type);
  }

}
