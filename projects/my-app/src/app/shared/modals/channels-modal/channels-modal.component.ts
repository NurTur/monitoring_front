import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WSService } from '../../../core/services/ws.service';
import { Subscription } from 'rxjs';

import { PagesService } from './../../../core/services/pages.service';
import { ChannelService } from './../../../core/services/channel.service';

@Component({
  selector: 'my-org-channels-modal',
  templateUrl: './channels-modal.component.html',
  styleUrls: ['./channels-modal.component.scss']
})
export class ChannelsModalComponent implements OnInit, OnDestroy {
  channelList: any = [];
  arrayChannels: any = [];
  allComplete = false;
  id: any;
  loader: boolean;
  selectedChannels = '';
  @Input() selectedPage: any;
  @Output() closeChannelsModal = new EventEmitter<any>();
  @Output() getGraphs = new EventEmitter<any>();

  private subscriptions: Subscription[] = [];
  constructor(private channelService: ChannelService,
              private activatedRoute: ActivatedRoute,
              private ws: WSService,
              private pagesService: PagesService) {
    activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id');
    });
   }

  ngOnInit(): void {
    this.getChannels();
    this.ws.connect(this.id);
    this.ws.getData().subscribe((res: any) => {
      if (res) {
        this.channelList = this.channelList.filter((x: any) => x.id !== res.id);
        this.channelList.unshift(res);
      }
    });
  }
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
  updateAllComplete(item: any) {
    if (this.selectedChannels.length === 0) {
      this.arrayChannels = [];
    } else {
      this.arrayChannels = this.selectedChannels.split(',').map(Number);
    }
    if (item.completed) {
      this.arrayChannels.push(item.id);
    } else {
      this.arrayChannels.forEach((id: any, i: number) => {
        if (id === item.id) {
          this.arrayChannels.splice(i, 1);
        }
      });
    }
    this.selectedChannels = this.arrayChannels.join(',');
  }

  someComplete(): boolean {
    if (this.channelList === null) {
      return false;
    }
    return this.channelList.filter((t: any) => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.channelList == null) {
      return;
    }
    !completed ? this.channelList.filter((t: any) => t.completed = false) : this.channelList.filter((t: any) => t.completed = true);
    if (completed) {
      this.channelList.map((item: any) => {
        this.arrayChannels.push(JSON.stringify(item.id));
      });
      this.selectedChannels = this.arrayChannels.join(',') + ',' + this.selectedChannels;
    } else {
      this.selectedChannels = '';
    }
  }
  getChannels() {
    this.loader = true;
    this.channelService.getChannelList(this.id).subscribe((res) => {
      this.loader = false;
      this.channelList = res;
      this.channelService.getChannelsPage(this.selectedPage.id).subscribe((channels: any) => {
        this.selectedChannels = channels.channels;
        const arr = this.selectedChannels.split(',');
        arr.map((i: any) => {
          this.channelList.map((m: any) => {
            if (m.id === Number(i)) {
              m.completed = true;
            }
          });
        });
      });
    });
  }
  close() {
    this.closeChannelsModal.emit();
  }
  save() {
    const data = {
      id: this.selectedPage.id,
      channels: this.selectedChannels
    };
    this.channelService.updateSelectedChannels(data).subscribe((channels: any) => {
      this.channelList = channels;
      this.getGraphs.emit();
      this.close();
    });
  }
}
