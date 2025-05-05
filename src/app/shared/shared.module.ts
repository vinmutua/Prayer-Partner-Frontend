import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Import standalone components
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ModalComponent } from './components/modal/modal.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { PrayerRequestModalComponent } from './components/prayer-request-modal/prayer-request-modal.component';
import { PrayerRequestEditModalComponent } from './components/prayer-request-edit-modal/prayer-request-edit-modal.component';
import { EmailModalComponent } from './components/email-modal/email-modal.component';
import { NoPrayerRequestModalComponent } from './components/no-prayer-request-modal/no-prayer-request-modal.component';

// Define an empty array with proper typing for non-standalone components
// Currently we don't have any non-standalone components
const COMPONENTS: any[] = [];

const STANDALONE_COMPONENTS: any[] = [
  HeaderComponent,
  FooterComponent,
  ModalComponent,
  ConfirmationModalComponent,
  PrayerRequestModalComponent,
  PrayerRequestEditModalComponent,
  EmailModalComponent,
  NoPrayerRequestModalComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ...STANDALONE_COMPONENTS
  ],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ...COMPONENTS,
    ...STANDALONE_COMPONENTS
  ]
})
export class SharedModule { }