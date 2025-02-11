import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../services/menu.service';
import { MenuItem } from '../../models/menu.interface';
import { LocationFilterPipe } from '../../pipes/location-filter.pipe';

@Component({
    selector: 'app-menu-navigation',
    standalone: true,
    imports: [CommonModule, LocationFilterPipe],
    templateUrl: './menu-navigation.component.html',
    styleUrls: ['./menu-navigation.component.scss']
})
export class MenuNavigationComponent implements OnInit {
    mainMenuItems: MenuItem[] = [];
    displayedItems: MenuItem[] = [];
    activeMenuId: number | null = null;
    isAllLinksActive = false;
    isUtilitiesActive = false;

    constructor(private menuService: MenuService) {}

    ngOnInit(): void {
        this.menuService.getMenuData().subscribe(response => {
            this.mainMenuItems = this.menuService.getMainMenuItems(response.view);
        });
    }

    showSection(menuId: number): void {
        this.activeMenuId = menuId;
        this.isAllLinksActive = false;
        this.isUtilitiesActive = false;
        this.menuService.getMenuData().subscribe(response => {
            this.displayedItems = this.menuService.getSubmenuItems(response.view, menuId);
        });
    }

    showAllLinks(): void {
        this.activeMenuId = null;
        this.isAllLinksActive = true;
        this.isUtilitiesActive = false;
        this.menuService.getMenuData().subscribe(response => {
            this.displayedItems = this.menuService.getAllItemsWithLinks(response.view);
        });
    }

    showUtilities(): void {
        this.activeMenuId = null;
        this.isAllLinksActive = false;
        this.isUtilitiesActive = true;

        this.menuService.getMenuData().subscribe({
            next: (response) => {
                if (response && response.view) {
                    console.log('Response data:', response);
                    this.displayedItems = this.menuService.getUtilitiesItems(response.view);
                    console.log('Displayed utilities items:', this.displayedItems);
                } else {
                    console.error('Invalid response format:', response);
                }
            },
            error: (error) => {
                console.error('Error fetching utilities:', error);
            }
        });
    }
}
