

/* 
 *    File: embedded.ts 
 *    Copyright(c) 2022 Chain-Sys Corporation Inc.
 *    Duplication or distribution of this code in part or in whole by any media
 *    without the express written permission of Chain-Sys Corporation or its agents is
 *    strictly prohibited.
 */
import { Component,ViewChild, ElementRef, Renderer2, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-embedded',
  templateUrl: './embedded.html',
  styleUrls: ['./embedded.scss'],
})
export class embedded implements OnInit {
  @ViewChild('pdf', { static: true }) pdf: ElementRef;

  constructor(public router:Router,public sanitizer:DomSanitizer,private renderer: Renderer2) { }
  
  ngOnInit() {
    
    this.renderer.removeAttribute(this.pdf.nativeElement, "data");
    this.router.routerState.root.queryParams.subscribe(page=>{
      this.renderer.setAttribute(this.pdf.nativeElement,"data",page.emUrl)
      
    })
  }

}
