import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginUserComponent } from './login-user/login-user.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { TouristHomeComponent } from './tourist-home/tourist-home.component';
import { OwnerHomeComponent } from './owner-home/owner-home.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { RegistrationComponent } from './registration/registration.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { AdminAddUserComponent } from './admin-add-user/admin-add-user.component';
import { AdminUpdDelUserComponent } from './admin-upd-del-user/admin-upd-del-user.component';
import { AdminAccDenyUserComponent } from './admin-acc-deny-user/admin-acc-deny-user.component';
import { AdminCottagesComponent } from './admin-cottages/admin-cottages.component';
import { TouristCottagesComponent } from './tourist-cottages/tourist-cottages.component';
import { TouristReservationsComponent } from './tourist-reservations/tourist-reservations.component';
import { OwnerCottagesComponent } from './owner-cottages/owner-cottages.component';
import { OwnerReservationsComponent } from './owner-reservations/owner-reservations.component';
import { OwnerStatisticsComponent } from './owner-statistics/owner-statistics.component';
import { TouristSpecCottageComponent } from './tourist-spec-cottage/tourist-spec-cottage.component';

export const routes: Routes = [
  {path: "", component:HomepageComponent, title: 'Planinska vikendica'},
  {path: "login", component: LoginUserComponent},
  {path: "login/admin", component: LoginAdminComponent},
  {path: "registration", component: RegistrationComponent},
  {path: "updatePassword", component: UpdatePasswordComponent},

  //tourist
  {path:"tourist", component: TouristHomeComponent},
  {path:"tourist/cottages", component: TouristCottagesComponent},
  {path:"tourist/reservations", component: TouristReservationsComponent},
  {path:"tourist/cottage_info/:id", component: TouristSpecCottageComponent},

  //owner
  {path:"owner", component: OwnerHomeComponent},
  {path:"owner/reservations", component: OwnerReservationsComponent},
  {path:"owner/cottages", component: OwnerCottagesComponent},
  {path:"owner/statistics", component: OwnerStatisticsComponent},

  //admin
  {path:"admin", component: AdminHomeComponent},
  {path: "admin/addUser", component: AdminAddUserComponent},
  {path: "admin/update_deleteUser", component: AdminUpdDelUserComponent},
  {path: "admin/accept_denyUser", component: AdminAccDenyUserComponent},
  {path: "admin/admin_cottages", component: AdminCottagesComponent}

];
