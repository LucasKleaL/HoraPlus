import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent extends AppComponent implements OnInit {

  private currentRoute: string = '';
  private routeMap: { [key: string]: string } = {
    'extrahours': 'Horas Extras',
    'daysoff': 'Folgas',
    'justifications': 'Justificativas',
    'employees': 'Funcionários',
    'departments': 'Setores',
    'add': 'Adicionar',
    'edit': 'Editar',
    'view': 'Visualizar',
  }
  public breadcrumbItems: { label: string, url: string }[] = [];

  constructor(_snackBar: MatSnackBar, router: Router, private route: ActivatedRoute) {
    super(_snackBar, router);
  }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
      this.generateBreadcrumbItems();
      console.log(this.currentRoute);
    });
  }

  private generateBreadcrumbItems(): void {
    const segments = this.currentRoute.split('/').filter(segment => segment);
    this.breadcrumbItems = segments.map((segment, index) => {
      const url = '/' + segments.slice(0, index + 1).join('/');
      return { label: this.routeMap[segment] || segment, url };
    });
  }

}
