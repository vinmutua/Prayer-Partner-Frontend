import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import all services
import { AuthService } from '../../services/auth.service';
import { PrayerPartnerService } from '../../services/prayer-partner.service';
import { ThemeService } from '../../services/theme.service';
import { PrayerRequestService } from '../../services/prayer-request.service';
import { UserService } from '../../services/user.service';
import { PdfExportService } from '../../services/pdf-export.service';
import { ToastService } from '../../services/toast.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    AuthService,
    PrayerPartnerService,
    ThemeService,
    PrayerRequestService,
    UserService,
    PdfExportService,
    ToastService
  ]
})
export class ServicesModule { }
