import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'my-org-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input() pagination: any;
  @Input() filterForm: any;
  @Output() getNotify = new EventEmitter<any>();
  pages: any = [];
  pagesCount: number;
  constructor() { }
  ngOnInit(): void {
    this.pagesCount = Math.ceil(this.pagination.count / 20);
  }

  get showPointA() {
    if (this.pagesCount <= 7) {return false; }
    if ((this.pagesCount - this.filterForm.page) <= 3) {return true; }
    if ((this.pagesCount - this.filterForm.page) > 3 && (this.filterForm.page - 1) > 3) {return true; }
    return false;
  }

  get showPointB() {
      if (this.pagesCount <= 7) {return false; }
      if ((this.filterForm.page - 1) <= 3) {return true; }
      if ((this.pagesCount - this.filterForm.page) > 3 && (this.filterForm.page - 1) > 3) {return true; }
      return false;
  }
  get pageNumbers() {
    let arr: any = [];
    if (!this.showPointA && !this.showPointB) {
        for (let i = 1; i < this.pagesCount; i++) {
            arr.push(i);
        }
    } else if (!this.showPointA && this.showPointB) {
        arr = [1, 2, 3, 4, 5];
    } else if (this.showPointA && !this.showPointB) {
        arr = [this.pagesCount - 4, this.pagesCount - 3, this.pagesCount - 2, this.pagesCount - 1];
    } else if (this.showPointA && this.showPointB) {
        arr = [this.filterForm.page - 2, this.filterForm.page - 1, this.filterForm.page,
          this.filterForm.page + 1, this.filterForm.page + 2];
    }
    this.pages = arr;
    return arr;
  }
  jumpPage(next: boolean) {
    if (next) {
      if (this.filterForm.page < this.pagesCount - 5) {
        this.filterForm.page = this.filterForm.page + 5;
      } else {
        this.filterForm.page = this.pagesCount;
      }
    } else {
      if (this.filterForm.page > 5) {
        this.filterForm.page = this.filterForm.page - 5;
      } else {
        this.filterForm.page = 1;
      }
    }
    this.getNotify.emit();
  }

  changePage(page: number) {
    this.filterForm.page = page;
    this.getNotify.emit();
  }
  nextPage() {
    if (this.filterForm.page < this.pagesCount) {
      this.filterForm.page++;
      this.getNotify.emit();
    }
  }
  prevPage() {
    if (this.filterForm.page > 0) {
      this.filterForm.page--;
      this.getNotify.emit();
    }
  }
}
