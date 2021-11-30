import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { GammaComponent } from './gamma/gamma.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'home',
      component: HomeComponent,
    },
    {
      path: 'clasicos',
      loadChildren: () => import('./clasicos/clasicos.module')
        .then(m => m.ClasicosModule),
    },
    {
      path: 'gamma',
      component: GammaComponent,
    },
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full',
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
