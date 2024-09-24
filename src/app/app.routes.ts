import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { ItemsComponent } from './pages/items/items.component';
import { RoleGuard } from './services/role.guard';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { EditItemComponent } from './pages/edit-item/edit-item.component';
import { InventoriesComponent } from './pages/inventories/inventories.component';
import { AddItemComponent } from './pages/add-item/add-item.component';
import { ShipmentOrderComponent } from './pages/shipment-order/shipment-order.component';
import { ItemAnalysisComponent } from './pages/item-analysis/item-analysis.component';
import { StockTableComponent } from './pages/stock-table/stock-table.component';

export const routes: Routes = [
    {
        path:'login', component:LoginComponent
    },
    {
        path:'register', component:RegisterComponent
    },
    {
        path:'unauthorized', component:UnauthorizedComponent
    },
    { 
        path: 'add-item', 
        component: AddItemComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Admin', 'Manager'] }
    },
    { 
        path: 'edit-item/:guid', 
        component: EditItemComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Admin', 'Manager'] }
    },
    {
        path:'items', 
        component:ItemsComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Admin', 'Manager'] }
    },
    {
        path:'inventories', 
        component:InventoriesComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Admin', 'Manager'] }
    },
    {
        path:'shipmentorders', 
        component:ShipmentOrderComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Admin', 'Manager'] }
    },
    {
        path:'analyze', 
        component:ItemAnalysisComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Admin', 'Manager'] }
    },
    {
        path:'stock', 
        component:StockTableComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Admin', 'Manager'] }
    },
    {
        path:'', component:HomeComponent
    }
];
