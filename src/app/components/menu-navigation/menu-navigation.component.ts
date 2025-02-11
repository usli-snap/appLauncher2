import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../services/menu.service';
import { PreferencesService } from '../../services/preferences.service';
import { LocationFilterPipe } from '../../pipes/location-filter.pipe';
import { MenuItem, MenuResponse } from '../../models/menu.interface';

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
    defaultMenuId: number | null = null;
    isAllLinksActive = false;
    isUtilitiesActive = false;
    readonly MAIN_MENU_IDS = [4, 33, 6, 7, 9, 10, 181];
    isLoading = true;
    private menuDataCache: MenuResponse | null = null;

    constructor(
        private menuService: MenuService,
        private preferencesService: PreferencesService
    ) {
        // Check for saved default menuId, with fallback and SSR handling
        this.defaultMenuId = this.preferencesService.getDefaultMenuId();
        this.activeMenuId = this.defaultMenuId ?? 4;
    }

    ngOnInit(): void {
        this.loadMenuData();
    }

    private loadMenuData(): void {
        this.isLoading = true;
        this.menuService.getMenuData().subscribe({
            next: (response) => {
                this.menuDataCache = response;
                this.mainMenuItems = this.menuService.getMainMenuItems(response.view);
                this.showSection(this.activeMenuId as number);
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading menu data:', error);
                this.isLoading = false;
            }
        });
    }

    showSection(menuId: number): void {
        this.activeMenuId = menuId;
        this.isAllLinksActive = false;
        this.isUtilitiesActive = false;

        if (this.menuDataCache) {
            this.displayedItems = this.menuService.getSubmenuItems(this.menuDataCache.view, menuId);
        }
    }

    showAllLinks(): void {
        this.activeMenuId = null;
        this.isAllLinksActive = true;
        this.isUtilitiesActive = false;

        if (this.menuDataCache?.view) {
            const allItems = this.menuDataCache.view;

            // Group items by MenuID with proper typing
            const groupedItems = allItems.reduce<{ [key: number]: MenuItem[] }>((groups, item) => {
                if (item.MenuID && this.MAIN_MENU_IDS.includes(item.MenuID)) {
                    if (!groups[item.MenuID]) {
                        groups[item.MenuID] = [];
                    }
                    groups[item.MenuID].push(item);
                }
                return groups;
            }, {});

            // Transform grouped items into display format
            this.displayedItems = Object.entries(groupedItems)
                .flatMap(([menuId, items]: [string, MenuItem[]]) =>
                    items.map(item => ({
                        ...item,
                        MenuID: Number(menuId),
                        Description: this.getMenuTitle(Number(menuId))
                    }))
                );
        }
    }

    private getMenuTitle(menuId: number): string {
        switch (menuId) {
            case 4: return 'Hospitality and Liquor';
            case 33: return 'Non Profit';
            case 6: return 'Personal';
            case 7: return 'Professional';
            case 9: return 'Regional Teams';
            case 10: return 'Private Label';
            case 181: return 'Instant Access';
            default: return '';
        }
    }

    setDefaultSection(menuId: number): void {
        this.preferencesService.setDefaultMenuId(menuId);
        this.defaultMenuId = menuId;
        const menuName = this.mainMenuItems.find(item => item.MenuID === menuId)?.Description;
        alert(`${menuName} has been set as your default preference`);
    }

    showUtilities(): void {
      this.activeMenuId = null;
      this.isAllLinksActive = false;
      this.isUtilitiesActive = true;

      this.menuService.getMenuData().subscribe({
          next: (response) => {
              if (response && response.view) {
                  //console.log('Response data:', response);
                  this.displayedItems = this.menuService.getUtilitiesItems(response.view);
                  //console.log('Displayed utilities items:', this.displayedItems);
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
