import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { ScheduleComponent, DayService, WeekService, WorkWeekService, MonthService, AgendaService, DragAndDropService, ResizeService, EventSettingsModel, RenderCellEventArgs, ActionEventArgs } from '@syncfusion/ej2-angular-schedule';
import { DataManager, Query, Predicate } from '@syncfusion/ej2-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService, ResizeService, DragAndDropService]
})

export class AppComponent {
  @ViewChild('scheduleObj', { static: false }) private scheduleObj: ScheduleComponent;

  public data: object[] = [{
    Id: 1,
    Subject: 'Past time event',
    StartTime: new Date(new Date().setMilliseconds(-7200000)),
    EndTime: new Date(new Date().setMilliseconds(-3600000))
  }];

  public eventSettings: EventSettingsModel = {
    dataSource: this.data
  }

  isPast(args: ActionEventArgs): boolean {
    // Validating the corresponding event time is valid for edit action or not and returning the result
    let eventObj: { [key: string]: Object } = args.data instanceof Array ? args.data[0] : args.data;
    let result: boolean = eventObj.StartTime < new Date();
    if(!(args.data instanceof Array)) {
      let rule = new Predicate("Id", "equal", eventObj.Id as number, false);
      let datas: { [key: string]: Object }[] = new DataManager(this.scheduleObj.eventsData).executeLocal(new Query().where(rule)) as { [key: string]: Object }[];
      if(datas.length > 0) {
        result = datas[0].StartTime > new Date() ? result : datas[0].StartTime < new Date();
      }
    }
    return result;
  }

  onActionBegin(args: ActionEventArgs) {
    if (args.requestType === 'eventCreate' || args.requestType === 'eventChange' || args.requestType === "eventRemove") {
      if (this.isPast(args)) {
        // Preventing the edit by setting up "true" to "args.cancel"
        args.cancel = true;
        alert('Adding an event to the past time and editing an event on the past time is not allowed.');
      }
    }
  }

  onRenderCell(args: RenderCellEventArgs): void {
    // Adding "e-disable-date" class to preventing the CRUD actions in the past date and time cells
    if (args.date < new Date()) {
      args.element.classList.add('e-disable-dates');
    }
  }
}
