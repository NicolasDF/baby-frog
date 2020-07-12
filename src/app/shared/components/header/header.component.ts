import { Component, OnInit } from '@angular/core';
import { HeaderItem } from '../../models/header-item.model';

@Component({
  selector: 'bf-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  sections: HeaderItem[];

  constructor( ) { }

  ngOnInit() {
    this.sections = [
      {
        label: 'Sobre Nosotros',
        route: 'sobre-nosotros'
      },
      {
        label: 'Contactenos',
        route: 'contactenos'
      },
      {
        label: 'Productos',
        route: 'productos'
      }
    ];
  }

}
