import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HomeComponent } from './home/home.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { TaskInputComponent } from './task-input/task-input.component';
import { TaskModuleComponent } from './task-module/task-module.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { MatSliderModule, MatRadioModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import { ReportComponent } from './report/report.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    WorkspaceComponent,
    TaskInputComponent,
    TaskModuleComponent,
    ReportComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
