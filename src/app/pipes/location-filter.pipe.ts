import { Pipe, PipeTransform } from '@angular/core';
import { MenuItem } from '../models/menu.interface';

@Pipe({
    name: 'locationFilter',
    standalone: true
})
export class LocationFilterPipe implements PipeTransform {
    transform(items: MenuItem[], locationId: number): MenuItem[] {
        if (!items) return [];
        return items.filter(item => item.LocationID === locationId);
    }
}
