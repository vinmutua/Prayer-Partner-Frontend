import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ServicesModule } from './services/services.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ServicesModule
  ],
  exports: [
    ServicesModule
  ],
  providers: [
    provideHttpClient()
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only.');
    }
  }
}
