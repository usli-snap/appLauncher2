import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { MenuResponse, MenuItem } from '../models/menu.interface';

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    private readonly MAIN_MENU_IDS = [4, 33, 6, 7, 9, 10, 181];

    constructor(private http: HttpClient) {}

    getMenuData(): Observable<MenuResponse> {
        return this.http.get<MenuResponse>('/assets/data/USLIMainApiResponse.json');
    }

    getMainMenuItems(data: MenuItem[]): MenuItem[] {
        return data.filter(item => this.MAIN_MENU_IDS.includes(item.MenuID));
    }

    getSubmenuItems(data: MenuItem[], parentId: number): MenuItem[] {
        return data.filter(item =>
            item.ParentID === parentId &&
            (!item.CommandLine || item.CommandLine.startsWith('ms-appinstaller:?source='))
        );
    }

    getAllItemsWithLinks(data: MenuItem[]): MenuItem[] {
        return data.filter(item =>
            item.CommandLine &&
            item.CommandLine.trim() !== '' &&
            item.CommandLine.startsWith('ms-appinstaller:?source=')
        );
    }

    getUtilitiesItems(data: MenuItem[]): MenuItem[] {
        // Log the data for debugging
        console.log('All menu items:', data);

        const utilitiesItems = data.filter(item => {
            console.log('Checking item:', item);
            return item.LocationID === 2;
        });

        // Log the filtered items
        console.log('Utilities items:', utilitiesItems);
        return utilitiesItems;
    }
}
