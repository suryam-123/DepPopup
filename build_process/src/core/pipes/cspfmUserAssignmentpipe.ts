 import { Pipe, PipeTransform } from '@angular/core';

 @Pipe({
     name: 'UserAssignSearchFilter'
 })
 export class UserAssignSearchFilter implements PipeTransform {
     transform(value: any, args?: any, type?: string): any {
         if(!value)return null;
         if(!args)return value;
         args = args.toLowerCase();
         if(type === 'User'|| type === 'Role' || type === 'Group'){
             return value.filter(function(item){
                 return JSON.stringify(item.display_name).toLowerCase().includes(args);
             });
         }else if(type === 'Responsibility'){
             return value.filter(function(item){
                 return JSON.stringify(item.responsibility_name).toLowerCase().includes(args);
             });
         }  
 }}