import { Component, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskCreate, TaskService } from '../../data-access/task.service';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
  providers: [TaskService],
})
export default class TaskFormComponent {
  private _formBuilder = inject(FormBuilder);
  private _taskService = inject(TaskService);
  private _router = inject(Router);

  loading = signal(false);

  idTask = input.required<string>();

  form = this._formBuilder.group({
    title: this._formBuilder.control('', Validators.required),
    completed: this._formBuilder.control(false, Validators.required),
  });

  constructor() {
    effect(() => {
      const id = this.idTask();
      if (id) {
        this.getTask(id);
      }
    });
  }

  async submit() {
    if (this.form.invalid) return;

    try {
      this.loading.set(true);
      const { title, completed } = this.form.value;
      const task: TaskCreate = {
        title: title || '',
        completed: !!completed,
      };

      const id = this.idTask();

      if (id) {
        await this._taskService.update(task, id);
      } else {
        await this._taskService.create(task);
      }

      toast.success(`Nota ${id ? 'actualizada' : 'creada'} correctamente.`);
      this._router.navigateByUrl('/tasks');
    } catch (error) {
      toast.error('Ocurrio un problema.');
    } finally {
      this.loading.set(false);
    }
  }

  async getTask(id: string) {
    const taskSnapshot = await this._taskService.getTask(id);

    if (!taskSnapshot.exists()) return;

    const task = taskSnapshot.data() as Task;

    this.form.patchValue(task);
  }

  async delete() {
    const id = this.idTask();

    if (!id) {
      toast.error('No se puede eliminar la nota, ID no encontrado.');
      return;
    }

    const confirmation = confirm('¿Estás seguro de que deseas eliminar esta nota?');
    
    if (!confirmation) return;

    try {
      this.loading.set(true);
      await this._taskService.delete(id);
      toast.success('Tarea eliminada correctamente.');
      this._router.navigateByUrl('/tasks');
    } catch (error) {
      toast.error('Ocurrió un problema al eliminar la tarea.');
    } finally {
      this.loading.set(false);
    }
  }
  goHome() {
    this._router.navigateByUrl('/tasks');// Ajusta la ruta según tu aplicación
  }
}