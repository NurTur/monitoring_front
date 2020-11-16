import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

import { WSService } from './../../../../../core/services/ws.service';
import { PagesService } from './../../../../../core/services/pages.service';
import { Label } from 'ng2-charts';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { ChannelService } from './../../../../../core/services/channel.service';
import { ProjectsService } from 'projects/my-app/src/app/core/services/projects.service';

@Component({
  selector: 'my-org-graphic',
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.scss']
})
export class GraphicComponent implements OnInit, OnDestroy {

  id: any;
  selectedPage: any;
  channels: any;
  graphSettings = {
    type: 'custom',
    date: moment().format('YYYY-MM-DD'),
    dateStart: moment().subtract(12, 'months').format('YYYY-MM-DD'),
    dateEnd: moment().format('YYYY-MM-DD'),
    fixed: 'week',
  };
  channelsModal: boolean;
  loader: boolean;
  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      xAxes: [
        {
          type: 'time',
          position: 'bottom',
          time: {
            // tooltipFormat: "MM-DD-YYYY",
            displayFormats: {
              hour: 'DD.MM.YYYY HH:mm',
            },
          },
        },
      ],
    },
  };
  public lineChartColors = [
    {
      borderColor: '#FF9393',
      backgroundColor: 'rgba(0,0,0,0)',
      lineTension: 0,
    },
    {
      borderColor: '#A041FF',
      backgroundColor: 'rgba(0,0,0,0)',
      lineTension: 0,
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];
  private subscriptions: Subscription[] = [];
  childArray: any;
  selectParentPage: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private channelService: ChannelService,
    public pagesService: PagesService,
    private ws: WSService,
    private projects: ProjectsService) {
    activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id');
    });
  }

  ngOnInit(): void {
    this.getChannels();
  }
  getPageById() {
    setTimeout(() => {
      this.projects.pageList(this.id)
      .subscribe((res: any) => {
        if (this.selectedPage.parent === null) {
          this.selectParentPage = res.find((item: any) => this.selectedPage?.id === item?.id);
        } else {
          this.selectParentPage = res.find((item: any) => this.selectedPage?.parent === item?.id);
        }
        this.childArray = res.filter((item: any) => {
          if (item.parent !== null) {
            return item.parent === this.selectedPage.id || item.parent === this.selectedPage.parent;
          } else {
            return false;
          }
        });
      });
    }, 100);
  }
  ngOnDestroy() {
    if (this.lineChartData.length !== 0) {
      // this.ws.reject(this.id);
      this.subscriptions
      .forEach(s => s.unsubscribe());
    }
  }
  openChannelsModal() {
    this.channelsModal = true;
  }
  closeChannelsModal() {
    this.channelsModal = false;
  }
  changeTab(item: any) {
    this.pagesService.setPage(item);
    this.getChannels();
    this.selectedPage = item;
  }
  getChannels() {
    const pagesSub = this.pagesService.selectedPage$.subscribe((page: any) => {
      this.selectedPage = page;
      this.getPageById();
      this.channelService.getChannelsPage(page.id).subscribe((channels: any) => {
        this.channels = channels.channels;
        if (channels.channels.length !== 0) {
          this.getGraphs();
        } else {
          this.lineChartData = [];
        }
      });
    });
    this.subscriptions.push(pagesSub);
  }
  getGraphs() {
    this.loader = true;
    const filter = {
      project: this.id,
      start_datetime: moment().toISOString(),
      end_datetime: moment().toISOString(),
      channels: this.channels,
    };

    if (this.graphSettings.type === 'custom') {
      filter.start_datetime = moment(this.graphSettings.dateStart).format(
        'YYYY-MM-DDT00:00:00'
      );
      filter.end_datetime = moment(this.graphSettings.dateEnd).format(
        'YYYY-MM-DDT23:00:00'
      );
    } else if (this.graphSettings.type === 'date') {
      filter.start_datetime = moment(this.graphSettings.date)
        .subtract(1, 'days')
        .format('YYYY-MM-DDT00:00:00');
      filter.end_datetime = moment(this.graphSettings.date).format(
        'YYYY-MM-DDT23:00:00'
      );
    } else {
      if (this.graphSettings.fixed === 'week') {
        filter.start_datetime = moment()
          .subtract(7, 'days')
          .format('YYYY-MM-DDT00:00:00');
        filter.end_datetime = moment().format('YYYY-MM-DDT23:00:00');
      } else if (this.graphSettings.fixed === 'month') {
        filter.start_datetime = moment()
          .subtract(1, 'months')
          .format('YYYY-MM-DDT00:00:00');
        filter.end_datetime = moment().format('YYYY-MM-DDT23:00:00');
      } else {
        filter.start_datetime = moment()
          .subtract(1, 'years')
          .format('YYYY-MM-DDT00:00:00');
        filter.end_datetime = moment().format('YYYY-MM-DDT23:00:00');
      }
    }

    this.channelService.getGraphList(filter).subscribe((res: any[]) => {
      this.lineChartData = [];
      this.lineChartLabels = [];
      for (const item of res) {
        const elem: any = { label: item.code, fill: false, data: [] };
        const labels: any = [];
        for (const e of item.values) {
          elem.data.push(e.value);
          labels.push(moment(e.datetime).format('MM/DD/YYYY HH:mm'));
        }
        this.lineChartData.push(elem);
        this.lineChartLabels = labels;
      }
      this.loader = false;
    });
  }
}
