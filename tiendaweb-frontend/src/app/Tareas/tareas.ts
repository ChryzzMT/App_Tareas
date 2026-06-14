import {Component, inject} from '@angular/core';
import { ApiClient } from '../core/http/api-client';
import {RouterLink} from '@angular/router';
import { CommonModule} from '@angular/common';
import { Router } from '@angular/router'
import { Materia } from '../Materias/materia'
import{ SubTareasVer} from '../SubTareas/subTareasVer';
// import {Subtarea} from '../SubTareas/Subtarea';

@Component({
  selector: 'app-tareas',
  imports: [RouterLink, CommonModule],
  templateUrl: './tareas.html',
})
export class Tareas {
  private api = inject(ApiClient);
  private url = 'http://localhost:5056/GestionTareas';

  tareas: Tarea[] = [];
  tareascompletadas:Tarea[] = [];
  tareasDesfasadas:Tarea[] = [];

  ngOnInit() {
    const usuarioId = localStorage.getItem('usuarioId');

    this.api.post(this.url + '/SETUSUARIO?usuario=' + usuarioId, {}).subscribe({
      next: () => {
        this.api.get<Tarea[]>(this.url + '/Listar-Tareas').subscribe({
          next: data =>{ this.tareas = data
            this.VerificarTareasTiempo();
          },
          error: error => console.error('Error al obtener tareas', error)
        });
        this.api.get<Tarea[]>(this.url + '/ConseguirTareasCompletadas').subscribe({
          next: data => this.tareascompletadas = data,
          error: error => console.error('Error al obtener tareas completadas', error)
        })



      }
    });
  }

    eliminar(titulo: string) {
    this.api.delete(this.url + '/Eliminar-Tarea/' + titulo).subscribe({
      next: () => this.tareas = this.tareas.filter(t => t.titulo !== titulo),
      error: error => console.error( 'Error al eliminar tarea', error)
    });
  }

  private router = inject(Router)

  editar(tarea: Tarea) {
    this.router.navigate(['/tarea'], { state: { tarea } });
  }

  verSubtareas(tarea: Tarea) {
    this.router.navigate(['/subtareas'], { state: { tarea } });
  }

  MarcarCompletada( tareaid : number):void {
    this.api.put(`${this.url}/MarcarCompletado?tareaid=${tareaid}` , {} ).subscribe({
      next : () => this.ngOnInit(),
      error: error => console.error('Error al completar la  tarea', error)
    })
  }

  VerificarTareasTiempo():void{

    var fechahoy =  Date.now();

    for(let i =this.tareas.length-1;i>=0; i--){
      var objeto = this.tareas[i];
      var fechaentregaobj = new Date(objeto.fechaEntrega).getTime();
      if(fechaentregaobj < fechahoy && objeto.estado.toLowerCase() !="completada"){
        objeto.estado="Vencida";
        this.tareasDesfasadas.push(objeto);
        this.tareas.splice(i,1);
      }
    }
}


  // protected readonly SubTareasVer = SubTareasVer;
}

export interface Tarea {
  idTarea: number;
  titulo: string;
  descripcion: string;
  pesoTarea: number;
  fechaEntrega:string ;
  estado: string;
  idMateria: number;
  materia: Materia;
}

