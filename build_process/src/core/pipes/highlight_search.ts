import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightSearch implements PipeTransform {

  transform(value: any, args: any): any {
    if(!value) {
      return ""
    }
    if (!args) {
      return value;
    }
    
    var re = new RegExp(args.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    return value.replace(re, "<b>$&</b>");
  }
}