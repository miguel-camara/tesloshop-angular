import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <div class="flex justify-center h-[calc(45vh)] items-center">
      <span class="loading loading-ring loading-xl"></span>
    </div>
  `,
})
export class Loading { }
