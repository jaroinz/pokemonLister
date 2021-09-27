import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {ListerComponent} from "./lister/lister.component";

const routes: Routes = [
  {path: '',component: ListerComponent  }
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes),
    CommonModule
  ]
})

export class AppRoutingModule { }
