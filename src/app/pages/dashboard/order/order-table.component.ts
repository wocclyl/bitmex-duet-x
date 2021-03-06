import { setInterval } from 'timers';

import { Component, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable, Subscription } from 'rxjs';

import { Order, OrderTableService } from '../../../@core/data/order-table.service';

@Component({
  selector: 'ngx-order-table',
  styleUrls: ['./order-table.component.scss'],
  templateUrl: './order-table.component.html',
})
export class OrderTableComponent implements OnDestroy {
  settings: any;
  source: LocalDataSource = new LocalDataSource();

  timer: Observable<number> = Observable.create((observer) => {
    const timer = setInterval(() => observer.next(), 2000);
    return () => clearInterval(timer);
  });
  sub: Subscription;

  private orderData: Order[];

  constructor(private service: OrderTableService) {
    this.settings = this.service.getSettings();
    this.loadData();
    this.sub = this.timer.subscribe(async () => {
      await this.loadData();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  async loadData() {
    let data = await this.service.getData();
    if (!this.orderData || JSON.stringify(this.orderData) !== JSON.stringify(data)) {
      data = await this.service.syncROE();
      this.orderData = data;
      this.source.load(data);
    }
  }
}
