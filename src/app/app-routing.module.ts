import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ContactComponent } from './contact/contact.component';
import { HomeStepsComponent } from './home-page/home-steps/home-steps.component';
import { TrajetCommandeComponent } from './trajet-commande/trajet-commande.component';
import { MessagesComponent } from './messages/messages.component';
import { MesCommandesComponent } from './trajet-commande/mes-commandes/mes-commandes.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuardService } from './service/auth-guard.service';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  {
    path: 'admin', component: AdminComponent, canActivate: [AuthGuardService],
    data: {
      expectedRole: 'ROLE_ADMIN'
    }  },
  { path: 'contact', component: ContactComponent },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'message/:action', component: MessagesComponent },
  { path: 'trajets', component: TrajetCommandeComponent },
  {
    path: 'mescommandes', component: MesCommandesComponent, canActivate: [AuthGuardService],
    data: {
      expectedRole: 'ROLE_USER'
    }  },
  { path: '**', component: MessagesComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
