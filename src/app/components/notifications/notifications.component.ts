import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

// ngrx
import { Store, select } from '@ngrx/store';
import { Notification } from '../../ngrx-notifications/notifications.model';
import { AppState } from '../../ngrx-notifications/app.state';
import { deleteNotification } from '../../ngrx-notifications/notifications.actions';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent {
  visible: boolean = true;
  toggleVisibility() {
    this.visible = !this.visible;
  }

  // Definimos el observable:
  notifications: Notification[] = []; // Matriz local para almacenar las tareas
  constructor(private store: Store<AppState>) {}

  ngOnInit(){
    this.store.pipe(select('notifications')).subscribe((notifications: Notification[])=>{
      this.notifications = notifications;
    })
  }

  deleteNotification(notificationId: string){
    this.store.dispatch(deleteNotification({notificationId}))
    this.notificationsCompleted();
  }

  notificationsCompleted(){
    if(this.notifications.length === 0){
      localStorage.setItem('terminado', 'si')
    }
  }
}
